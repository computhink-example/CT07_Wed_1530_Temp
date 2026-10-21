// Sprite groups
let walls;
let dots;
let powerups;

// Game variables
let pacman;
let blinky, pinky, inky, clyde;
let ghosts;

let score = 0;

// Tile map layout
let tilemap = [
    "wwwwwwwwww",
    "w        w",
    "w  dddd  w",
    "w  dddd  w",
    "w  dddd  w",
    "w  dddd  w",
    "w  dddd  w",
    "w  dddd  w",
    "wp      pw",
    "wwwwwwwwww"
]

function preload() {

}

function setup() {
    new Canvas(200, 200);
    background(0);

    // Create groups for tilemap
    walls = new Group();
    walls.w = 20;
    walls.h = 20;
    walls.tile = "w";
    walls.color = "blue";
    walls.collider = "static";
    walls.bounciness = 0;
    walls.strokeWeight = 0; // Remove outline
    
    dots = new Group();
    dots.diameter = 5;
    dots.tile = "d";
    dots.color = "white";
    dots.collider = "none";
    
    powerups = new Group();
    powerups.diameter = 10;
    powerups.tile = "p";
    powerups.color = "white";
    powerups.collider = "none";

    // Create tilemap
    new Tiles(tilemap, 10, 10, 20, 20); // (array, x pos, y pos, tile width, tile height)

    // Pacman sprite
    pacman = new Sprite();
    pacman.x = 30;
    pacman.y = 30;
    pacman.diameter = 18;
    pacman.color = "yellow";
    pacman.bounciness = 0;
    pacman.friction = 0;

    // Ghost sprites
    blinky = new Sprite();
    blinky.x = 50;
    blinky.y = 30;
    blinky.color = "red";
    
    pinky = new Sprite();
    pinky.x = 70;
    pinky.y = 30;
    pinky.color = "pink";

    inky = new Sprite();
    inky.x = 90;
    inky.y = 30;
    inky.color = "cyan";

    clyde = new Sprite();
    clyde.x = 110;
    clyde.y = 30;
    clyde.color = "orange";

    ghosts = [blinky, pinky, inky, clyde];

    for (let ghost of ghosts) {
        ghost.diameter = 18;
        ghost.collider = "dynamic";
        ghost.bounciness = 0;
        ghost.friction = 0;
    }

    for (let i = 0; i < ghosts.length; i++) {
        // Allow ghost to pass through pacman
        ghosts[i].overlaps(pacman);

        for (let j = i + 1; j < ghosts.length; j++) {
            // Allow ghosts to pass through each other
            ghosts[i].overlaps(ghosts[j]);
        }
    }
}

function draw() {
    // Clear canvas
    background(0);

    // Pacman movement
    if (kb.presses("up") || kb.presses("w")) {
        pacman.vel.x = 0;
        pacman.vel.y = -2;
    } else if (kb.presses("down") || kb.presses("s")) {
        pacman.vel.x = 0;
        pacman.vel.y = 2;
    } else if (kb.presses("left") || kb.presses("a")) {
        pacman.vel.x = -2;
        pacman.vel.y = 0;
    } else if (kb.presses("right") || kb.presses("d")) {
        pacman.vel.x = 2;
        pacman.vel.y = 0;
    }

    // Loop through each dot in group
    for (let dot of dots) {
        // Check dot collision
        if (pacman.overlaps(dot)) {
            dot.remove();
            score += 10;
            console.log(score);
        }
    }

    // Call ghost movement
    for (let ghost of ghosts) {
        if (frameCount % 60 === 0) {
            ghostDirection(ghost);
        }
    }
}

// Function for ghosts to move in random directions
function ghostDirection(ghost) {
    // Random number to choose direction
    let direction = floor(random(1, 5));
    
    // Ghost movement
    if (direction === 1) {
        ghost.vel.x = 0;
        ghost.vel.y = -2;
    } else if (direction === 2) {
        ghost.vel.x = 0;
        ghost.vel.y = 2;
    } else if (direction === 3) {
        ghost.vel.x = -2;
        ghost.vel.y = 0;
    } else if (direction === 4) {
        ghost.vel.x = 2;
        ghost.vel.y = 0;
    }
}

// Center sprite movement
function setMovement(character) {
    character.x = round((character.x - 10) / 20) * 20 + 10;
    character.y = round((character.y - 10) / 20) * 20 + 10;
}