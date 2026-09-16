// Game objects
let bird;
let floor;

// Image assets
let birdMidImg;
let background;
let base;

function preload() {
    birdMidImg = loadImage("assets/yellowbird-midflap.png");
    background = loadImage("assets/background-day.png");
    base = loadImage("assets/base.png");
}

function setup() {
    new Canvas(400, 600);
    
    world.gravity.y = 10;

    // Debug text
    fill("#fc0303");   // Text colour
    textSize(14);

    // Create bird sprite
    bird = new Sprite();
    bird.img = birdMidImg;
    bird.width = 30;
    bird.height = 30;
    bird.mass = 2;  // How heavy, heavier = affected by gravity more
    bird.drag = 0.02;   // Air resistance, higher = more resistance
    bird.bounciness = 0.5;  // Higher = bouncier
    bird.collider = "dynamic";  // Collidable, movable and affected by physics

    // Create floor sprite
    floor = new Sprite();
    floor.img = base;
    floor.width = width;
    floor.height = 125;
    floor.x = width / 2;
    floor.y = height - 20;
    floor.collider = "static";  // Collidable but will not move
}

function draw() {
    image(background, 0, 0, width, height); // (image, x, y, width, height)

    if (kb.presses("space") || mouse.presses("left")) {
        bird.sleeping = false;  // Make sure no sprite is not idle
        bird.vel.y = -5;   // Up velocity
    }

    // Debug info
    text("vel.y: " + bird.vel.y.toFixed(2), 10, 20);    // (text, x, y)
    text("isMoving: " + bird.isMoving, 10, 40);
    text("sleeping: " + bird.sleeping, 10, 60);
}