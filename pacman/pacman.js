// Sprite groups
let walls;
let dots;
let powerups;

// Game variables
let pacman;
let blinky, pinky, inky, clyde;

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

    // Ghost sprites
    blinky = new Sprite();
    blinky.x = 50;
    blinky.y = 30;
    blinky.diameter = 18;
    blinky.color = "red";
    blinky.collider = "none";
    
    pinky = new Sprite();
    pinky.x = 70;
    pinky.y = 30;
    pinky.diameter = 18;
    pinky.color = "pink";
    pinky.collider = "none";

    inky = new Sprite();
    inky.x = 90;
    inky.y = 30;
    inky.diameter = 18;
    inky.color = "cyan";
    inky.collider = "none";

    clyde = new Sprite();
    clyde.x = 110;
    clyde.y = 30;
    clyde.diameter = 18;
    clyde.color = "orange";
    clyde.collider = "none";
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


}

// Function for ghosts to move in random directions
function ghostDirection(ghost) {
    // Random number to choose direction
    let direction = floor(random(1, 5));
    
    
}