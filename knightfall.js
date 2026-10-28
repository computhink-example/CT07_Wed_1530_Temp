const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 438;
const LEVEL_LENGTH = 3900;
const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 56;
const PLAYER_GROUND_Y = GROUND_Y - PLAYER_HEIGHT / 2;

const WEAPONS = [
  { name: "Ember Bolt", cooldown: 20, damage: 2, speed: 10, spread: 0 },
  { name: "Storm Crossbow", cooldown: 9, damage: 1, speed: 14, spread: 0 },
  { name: "Triad Rune", cooldown: 34, damage: 1, speed: 9, spread: 0.22 }
];

let player;
let enemies = [];
let projectiles = [];
let hostileProjectiles = [];
let boss;
let gameState = "title";
let selectedWeapon = 0;
let playerHealth = 6;
let bossHealth = 28;
let fireCooldown = 0;
let hurtCooldown = 0;
let bossSpawned = false;
let facingDirection = 1;

function setup() {
  new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  camera.x = CANVAS_WIDTH / 2;
  camera.y = CANVAS_HEIGHT / 2;
  noStroke();
  createTitleSprites();
  window.addEventListener("keydown", preventGameKeyScrolling);
}

function createTitleSprites() {
  player = new Sprite(90, PLAYER_GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
  player.collider = "none";
  player.visible = false;
  player.color = "#4e9b79";
}

function startGame() {
  removeGameSprites();
  gameState = "playing";
  playerHealth = 6;
  bossHealth = 28;
  selectedWeapon = 0;
  fireCooldown = 0;
  hurtCooldown = 0;
  facingDirection = 1;
  bossSpawned = false;
  enemies = [];
  projectiles = [];
  hostileProjectiles = [];

  player = new Sprite(90, PLAYER_GROUND_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
  player.collider = "none";
  player.visible = false;
  player.color = "#4e9b79";
  player.jumpSpeedValue = 0;
  player.groundedValue = true;

  [620, 980, 1370, 1740, 2110, 2480, 2820, 3130].forEach((x, index) => {
    const enemy = new Sprite(x, PLAYER_GROUND_Y, 34, 48);
    enemy.collider = "none";
    enemy.visible = false;
    enemy.color = index % 2 === 0 ? "#b44e4c" : "#8c5c9d";
    enemy.healthValue = 4;
    enemy.touchCooldownValue = 0;
    enemy.patrolDirectionValue = index % 2 === 0 ? 1 : -1;
    enemies.push(enemy);
  });
}

function removeGameSprites() {
  if (player) player.remove();
  enemies.forEach(enemy => enemy.remove());
  projectiles.forEach(projectile => projectile.sprite.remove());
  hostileProjectiles.forEach(projectile => projectile.sprite.remove());
  if (boss) boss.remove();
  boss = undefined;
}

function draw() {
  background("#9ac7cb");

  if (gameState === "playing") updateGame();

  camera.on();
  drawLandscape();
  if (gameState !== "title") drawCharacters();
  camera.off();

  drawHealthBar();
  drawWeaponLabel();
  drawBossHealth();

  if (gameState === "title") drawTitleScreen();
  if (gameState === "won") drawEndScreen("THE SIEGE IS BROKEN", "The Rune Warden has fallen. Press R to ride again.");
  if (gameState === "lost") drawEndScreen("YOUR QUEST ENDS HERE", "Press R to rise and try again.");
}

function drawCharacters() {
  drawKnight(player.x, player.y, facingDirection, hurtCooldown > 0);

  enemies.forEach((enemy, index) => {
    drawEnemy(enemy.x, enemy.y, enemy.patrolDirectionValue, index % 2);
  });

  if (bossSpawned && bossHealth > 0) drawRuneWarden(boss.x, boss.y);
}

function updateGame() {
  updatePlayer();
  updateEnemies();
  updateProjectiles();
  updateBoss();

  camera.x = constrain(player.x, CANVAS_WIDTH / 2, LEVEL_LENGTH - CANVAS_WIDTH / 2);
  camera.y = CANVAS_HEIGHT / 2;

  if (playerHealth <= 0) gameState = "lost";
  if (bossSpawned && bossHealth <= 0) gameState = "won";
}

function updatePlayer() {
  const movementSpeed = 4.2;
  let horizontalSpeed = 0;

  if (keyIsDown(LEFT_ARROW)) horizontalSpeed -= movementSpeed;
  if (keyIsDown(RIGHT_ARROW)) horizontalSpeed += movementSpeed;
  if (horizontalSpeed !== 0) facingDirection = Math.sign(horizontalSpeed);

  player.x = constrain(player.x + horizontalSpeed, PLAYER_WIDTH / 2, LEVEL_LENGTH - PLAYER_WIDTH / 2);
  player.jumpSpeedValue += 0.62;
  player.y += player.jumpSpeedValue;

  if (player.y >= PLAYER_GROUND_Y) {
    player.y = PLAYER_GROUND_Y;
    player.jumpSpeedValue = 0;
    player.groundedValue = true;
  } else {
    player.groundedValue = false;
  }

  if (fireCooldown > 0) fireCooldown--;
  if (hurtCooldown > 0) hurtCooldown--;
  if (mouseIsPressed && fireCooldown === 0) fireWeapon();
}

function updateEnemies() {
  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];
    if (enemy.touchCooldownValue > 0) enemy.touchCooldownValue--;

    const distanceToPlayer = player.x - enemy.x;
    if (abs(distanceToPlayer) < 280) {
      enemy.x += Math.sign(distanceToPlayer) * 1.15;
    } else {
      enemy.x += enemy.patrolDirectionValue * 0.7;
      if (enemy.x < 400 || enemy.x > LEVEL_LENGTH - 650) enemy.patrolDirectionValue *= -1;
    }

    if (rectanglesOverlap(player, enemy) && enemy.touchCooldownValue === 0 && hurtCooldown === 0) {
      playerHealth--;
      hurtCooldown = 45;
      enemy.touchCooldownValue = 55;
    }
  }
}

function fireWeapon() {
  const weapon = WEAPONS[selectedWeapon];
  const angles = weapon.spread === 0 ? [0] : [-weapon.spread, 0, weapon.spread];
  const direction = facingDirection;

  angles.forEach(angle => {
    const projectile = new Sprite(player.x + direction * 24, player.y - 3, 18, 8);
    projectile.collider = "none";
    projectile.color = selectedWeapon === 2 ? "#9fe8ff" : "#ffd36a";
    const velocityX = direction * weapon.speed * Math.cos(angle);
    const velocityY = weapon.speed * Math.sin(angle);
    projectiles.push({ sprite: projectile, velocityX, velocityY, damageValue: weapon.damage });
  });

  fireCooldown = weapon.cooldown;
}

function updateProjectiles() {
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];
    projectile.sprite.x += projectile.velocityX;
    projectile.sprite.y += projectile.velocityY;

    let hitTarget = false;
    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
      const enemy = enemies[enemyIndex];
      if (rectanglesOverlap(projectile.sprite, enemy)) {
        enemy.healthValue -= projectile.damageValue;
        hitTarget = true;
        if (enemy.healthValue <= 0) {
          enemy.remove();
          enemies.splice(enemyIndex, 1);
        }
        break;
      }
    }

    if (!hitTarget && bossSpawned && rectanglesOverlap(projectile.sprite, boss)) {
      bossHealth -= projectile.damageValue;
      hitTarget = true;
    }

    if (hitTarget || abs(projectile.sprite.x - player.x) > CANVAS_WIDTH) {
      projectile.sprite.remove();
      projectiles.splice(index, 1);
    }
  }

  for (let index = hostileProjectiles.length - 1; index >= 0; index--) {
    const projectile = hostileProjectiles[index];
    projectile.sprite.x += projectile.velocityX;
    if (rectanglesOverlap(projectile.sprite, player) && hurtCooldown === 0) {
      playerHealth--;
      hurtCooldown = 45;
      projectile.sprite.remove();
      hostileProjectiles.splice(index, 1);
    } else if (abs(projectile.sprite.x - player.x) > CANVAS_WIDTH) {
      projectile.sprite.remove();
      hostileProjectiles.splice(index, 1);
    }
  }
}

function updateBoss() {
  if (!bossSpawned && player.x >= LEVEL_LENGTH - 720) {
    boss = new Sprite(LEVEL_LENGTH - 430, PLAYER_GROUND_Y - 15, 92, 112);
    boss.collider = "none";
    boss.visible = false;
    boss.color = "#633d78";
    bossSpawned = true;
    boss.attackCooldownValue = 70;
    boss.moveDirectionValue = -1;
  }
  if (!bossSpawned || bossHealth <= 0) return;

  boss.x += boss.moveDirectionValue * 1.2;
  if (boss.x < LEVEL_LENGTH - 620 || boss.x > LEVEL_LENGTH - 320) boss.moveDirectionValue *= -1;

  if (boss.attackCooldownValue > 0) boss.attackCooldownValue--;
  if (boss.attackCooldownValue === 0) {
    const spell = new Sprite(boss.x - 48, boss.y + 8, 24, 16);
    spell.collider = "none";
    spell.color = "#d8a6ff";
    hostileProjectiles.push({ sprite: spell, velocityX: -5 });
    boss.attackCooldownValue = 78;
  }

  if (rectanglesOverlap(player, boss) && hurtCooldown === 0) {
    playerHealth--;
    hurtCooldown = 50;
  }
}

function rectanglesOverlap(first, second) {
  return abs(first.x - second.x) < (first.w + second.w) / 2 &&
    abs(first.y - second.y) < (first.h + second.h) / 2;
}

function drawLandscape() {
  fill("#7aa6a0");
  for (let x = 180; x < LEVEL_LENGTH; x += 460) {
    triangle(x - 220, GROUND_Y, x, 165 + (x % 3) * 22, x + 250, GROUND_Y);
  }

  fill("#49685c");
  rect(0, GROUND_Y, LEVEL_LENGTH, CANVAS_HEIGHT - GROUND_Y);
  fill("#a6bd73");
  rect(0, GROUND_Y, LEVEL_LENGTH, 12);

  for (let x = 120; x < LEVEL_LENGTH; x += 320) {
    fill("#6e5848");
    rect(x, GROUND_Y - 66, 14, 66);
    rect(x - 10, GROUND_Y - 70, 34, 9);
    fill("#d9b866");
    ellipse(x + 7, GROUND_Y - 80, 10, 10);
  }
}

function drawHealthBar() {
  const left = 22;
  const top = 20;
  fill("#17242a");
  rect(left, top, 210, 24, 4);
  fill("#d85c55");
  rect(left + 4, top + 4, 202 * (max(0, playerHealth) / 6), 16, 3);
  fill("#f3ead4");
  textSize(15);
  textAlign(LEFT, CENTER);
  text(`HEALTH ${max(0, playerHealth)}/6`, left + 10, top + 12);
}

function drawWeaponLabel() {
  const left = 22;
  fill("#17242a");
  rect(left, 54, 220, 28, 4);
  fill("#f3ead4");
  textSize(14);
  textAlign(LEFT, CENTER);
  text(`WEAPON ${selectedWeapon + 1}: ${WEAPONS[selectedWeapon].name}`, left + 10, 68);
}

function drawBossHealth() {
  if (!bossSpawned || gameState !== "playing") return;
  const left = CANVAS_WIDTH / 2 - 150;
  fill("#17242a");
  rect(left, 20, 300, 24, 4);
  fill("#aa65bc");
  rect(left + 4, 24, 292 * (max(0, bossHealth) / 28), 16, 3);
  fill("#f3ead4");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("RUNE WARDEN", camera.x, 32);
}

function drawTitleScreen() {
  drawOverlay();
  fill("#f3ead4");
  textAlign(CENTER, CENTER);
  textSize(42);
  text("KNIGHTFALL", CANVAS_WIDTH / 2, 165);
  textSize(20);
  fill("#e6bb68");
  text("THE RUNE SIEGE", CANVAS_WIDTH / 2, 205);
  fill("#f3ead4");
  textSize(16);
  text("Arrow keys: move     Space: jump     Click: fire", CANVAS_WIDTH / 2, 270);
  text("1 / 2 / 3: switch weapons", CANVAS_WIDTH / 2, 298);
  textSize(18);
  fill("#e6bb68");
  text("Press SPACE or click to begin", CANVAS_WIDTH / 2, 355);
}

function drawEndScreen(title, subtitle) {
  drawOverlay();
  textAlign(CENTER, CENTER);
  fill("#e6bb68");
  textSize(34);
  text(title, CANVAS_WIDTH / 2, 235);
  fill("#f3ead4");
  textSize(18);
  text(subtitle, CANVAS_WIDTH / 2, 285);
}

function drawOverlay() {
  fill(16, 25, 35, 205);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawKnight(x, y, direction, isHurt) {
  push();
  translate(x, y);
  scale(direction, 1);

  fill("#293c3d");
  rect(-9, 7, 7, 15, 2);
  rect(2, 7, 7, 15, 2);
  fill("#43372e");
  rect(-11, 19, 10, 5, 2);
  rect(1, 19, 10, 5, 2);

  fill(isHurt ? "#f2d5a1" : "#4e9b79");
  rect(-11, -14, 22, 24, 4);
  fill("#d4b86e");
  rect(-11, 3, 22, 4, 1);
  rect(-2, -13, 4, 20, 1);

  fill("#bdc9c1");
  rect(-16, -12, 7, 16, 3);
  fill("#7d9a8d");
  rect(-17, -8, 8, 8, 2);
  fill("#bdc9c1");
  rect(9, -12, 7, 14, 3);
  fill("#d4b86e");
  rect(13, -11, 3, 10, 1);

  fill("#e5c69b");
  ellipse(0, -22, 17, 17);
  fill("#667d79");
  arc(0, -23, 19, 20, PI, TWO_PI);
  rect(-10, -23, 20, 5, 2);
  fill("#f0d47a");
  triangle(0, -38, -3, -27, 4, -27);
  fill("#263b3b");
  rect(2, -23, 6, 2, 1);
  pop();
}

function drawEnemy(x, y, direction, type) {
  push();
  translate(x, y);
  scale(direction, 1);

  fill("#292c34");
  rect(-8, 7, 7, 15, 2);
  rect(2, 7, 7, 15, 2);
  fill("#3d3030");
  rect(-10, 19, 10, 5, 2);
  rect(1, 19, 10, 5, 2);

  if (type === 0) {
    fill("#8b4546");
    rect(-11, -14, 22, 24, 3);
    fill("#c79c70");
    rect(-13, -12, 5, 15, 2);
    rect(8, -12, 5, 15, 2);
    fill("#d8c6a1");
    rect(-10, -27, 20, 7, 2);
    triangle(-9, -24, -15, -20, -8, -18);
    fill("#d1a878");
    ellipse(0, -19, 15, 16);
    fill("#d6d4ca");
    arc(0, -22, 18, 19, PI, TWO_PI);
    rect(-9, -22, 18, 4, 1);
  } else {
    fill("#554568");
    triangle(-12, 10, 0, -18, 12, 10);
    fill("#997aab");
    rect(-10, -13, 20, 24, 3);
    fill("#d5bb89");
    ellipse(0, -21, 15, 16);
    fill("#392f45");
    triangle(-10, -26, 0, -42, 10, -26);
    fill("#ea8d75");
    ellipse(3, -21, 3, 3);
    rect(11, -9, 3, 22, 1);
    fill("#a990c6");
    ellipse(12, -12, 8, 8);
  }
  pop();
}

function drawRuneWarden(x, y) {
  push();
  translate(x, y);
  fill("#352c49");
  triangle(-41, 52, 0, -31, 41, 52);
  fill("#633d78");
  rect(-36, -22, 72, 76, 15);
  fill("#a994b7");
  rect(-34, -17, 13, 35, 5);
  rect(21, -17, 13, 35, 5);
  fill("#c8af84");
  ellipse(0, -34, 40, 38);
  fill("#483958");
  arc(0, -39, 44, 44, PI, TWO_PI);
  triangle(-22, -42, -30, -74, -7, -47);
  triangle(22, -42, 30, -74, 7, -47);
  fill("#f1a4ef");
  ellipse(-8, -35, 8, 6);
  ellipse(8, -35, 8, 6);
  fill("#e4c269");
  ellipse(0, 8, 19, 19);
  fill("#f1a4ef");
  ellipse(0, 8, 9, 9);
  pop();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === 32) {
    if (gameState === "title" && keyCode === 32) startGame();
    else if (gameState === "playing" && keyCode === 32 && player.groundedValue) {
      player.jumpSpeedValue = -12.5;
      player.groundedValue = false;
    }
    return false;
  }

  if (key === "1" || key === "2" || key === "3") {
    if (gameState === "playing") selectedWeapon = Number(key) - 1;
    return false;
  }

  if ((key === "r" || key === "R") && (gameState === "won" || gameState === "lost")) {
    startGame();
    return false;
  }
}

function mousePressed() {
  if (gameState === "title") startGame();
}

function preventGameKeyScrolling(event) {
  if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
}