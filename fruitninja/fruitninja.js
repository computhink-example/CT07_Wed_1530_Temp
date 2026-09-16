// Variables
let background;
let fruitGroup; // group for whole fruits
let fruitTypes  = []; // store fruit image objects
let trail;
let fruitHalves; // new group for sliced halves
let score = 0;
let missed = 0;
let gameState = "start"; // "start", "playing", "gameOver"

function preload() {
    // Load image
    background = loadImage("assets/dojobackground.png");
    // declare the peach object
    let peach = {
        whole: loadImage("assets/peachwhole.png"),
        half1: loadImage("assets/peachhalf.png"),
        half2: loadImage("assets/peachhalf2.png"),

        // Add scaleMod
        scaleMod: 1,
    }

    // declare the watermelon object
    let watermelon = {
        whole: loadImage("assets/watermelonwhole.png"),
        half1: loadImage("assets/watermelonhalf.png"),
        half2: loadImage("assets/watermelonhalf.png"),

        // Add scaleMod
        scaleMod: 1,
    }

    // new fruit types
    let tomato = {
        whole: loadImage("assets/tomato1.png"),
        half1: loadImage("assets/tomato2.png"),
        half2: loadImage("assets/tomato2.png"),

        // Add scaleMod
        scaleMod: 2,
    }

    let dragonfruit = {
        whole: loadImage("assets/dragonfruit1.png"),
        half1: loadImage("assets/dragonfruit2.png"),
        half2: loadImage("assets/dragonfruit2.png"),

        // Add scaleMod
        scaleMod: 2,
    }
    
    // store the fruit objects into an array
    fruitTypes = [peach, watermelon, tomato, dragonfruit];

}

function setup() {
    // Create canvas
    new Canvas(800, 600);
    world.gravity.y = 10;
    fruitGroup = new Group();
    fruitHalves = new Group(); // group for fruit halves
}

function draw() {
    clear();
    image(background, 0, 0, width, height); // image(image, x, y, width, height)

    // Draw depending on gameState
    if (gameState === "start") {
        // Start Menu
        fill("rgb(100, 255, 100)") // Text colour
        stroke("rgb(20, 20, 20)"); // Text outline
        strokeWeight(20);
        textSize(100);
        textAlign(CENTER, CENTER); // (horizontal, vertical) - LEFT, RIGHT, TOP, BOTTOM, CENTER
        text("Fruit Ninja", width / 2, height / 2); // (string, x pos, y pos)

        // Change to playing state
        if (kb.presses(" ") || mouse.presses()) {
            gameState = "playing";
        }
        return;
    } else if (gameState === "playing") {
        // Gameplay
        // Debug text
        fill("rgba(0, 210, 0, 0.8)") // Text colour
        textSize(50);
        textAlign(LEFT, BOTTOM); // Default alignment
        stroke("rgb(0, 0, 0)"); // Text outline
        strokeWeight(10);
        // noStroke(); // Remove outline
        // text("frameCount:"+ frameCount, 10, 40); // (string, x pos, y pos)
        text("Score: " + score, 10, 60);
        fill("rgba(210, 0, 0, 0.8)"); // ("rgba(red, green, blue, alpha)") alpha = transparency
        text("Missed: " + missed, 10, 120);

        // call spawnFruit function every x number of frames 
        if (frameCount % 10 == 0) {
            // 60 frames = 1 second
            spawnFruit();
        }

        // handle slicing when mouse is pressed
        if (mouse.pressing()){
            trail = new Sprite(mouse.x, mouse.y, 7);
            trail.collider = 'none';
            trail.color = 'red';
            trail.life = 10;
            sliceFruit(); // add this line to call function
        }

        // Check if fruits fall
        missedFruit();
        return;
    } else if (gameState === "gameOver") {
        // Game Over Screen

        return;
    }
}
// check if any fruit is sliced by the mouse
function sliceFruit(){
    for (let fruit of fruitGroup) {
        if (fruit.sliced){
            continue; // skip already sliced fruits
        }

        // calculate distance between mouse and fruit
        let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);

        // fruit is sliced
        if (d < ((fruit.d / 2) + 5)) {
            fruit.sliced = true; // prevent repeat slicing
            score += 1; // increment score

            const fx = fruit.x; // x coordinate for the sliced food
            const fy = fruit.y; // y coordinate for the sliced food

            fruit.remove(); // remove whole fruit

            splitFruit(fx, fy, fruit.type); // spawn halves

            break; // only slice one fruit per frame
        }
    }
}

function spawnFruit() {
    let fruitData = random(fruitTypes); // pick one at random
    let randomX = random(300, 500); // random X to spawn. Rem that canvas width is 800
    let fruit = new fruitGroup.Sprite(randomX, height+20, 40); // spawn at bottom
    fruit.image = fruitData.whole; // load image for whole

    // Size fix - scaleMod
    fruit.scale = fruitData.scaleMod;

    fruit.type = fruitData; // store reference to its type i.e. peach or watermelon
    fruit.vel.y = random(-10, -14); // shoot upward at random velocity. Adjust to try!
    fruit.vel.x = random(-2, 2); // sideways curve. Adjust to try!
    fruit.friction = 0; // no friction
    fruit.overlaps(allSprites); // disable collision
    fruit.layer = 2; // appear on top of split halves
}

// split a fruit into two halves and animate them
function splitFruit(x, y, fruitData) {
    // create left half
    let left = new fruitHalves.Sprite(x - 10, y, 40, 40);
    left.img  = fruitData.half1;

    // Size fix - scaleMod
    left.scale = fruitData.scaleMod;

    left.vel.x = -3; // veer left
    left.vel.y = random(-5, -2);
    left.rotationSpeed = -5;
    left.life = 60; // remove after 30 frames
    left.collider = "dynamic"; // dynamic - yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    left.overlaps(allSprites); // disable collision
    left.layer = 1;

    // create right half
    let right = new fruitHalves.Sprite(x + 10, y, 40, 40);
    right.img = fruitData.half2;

    // Size fix - scaleMod
    right.scale = fruitData.scaleMod;

    right.vel.x = 3; // veer right
    right.vel.y = random(-5, -2);
    right.rotationSpeed = 5;
    right.life = 60; // remove after 30 frames
    right.collider = "dynamic"; // dynamic - yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    right.overlaps(allSprites); // disable collision
    right.layer = 1;
}

function missedFruit() {
    // Loop through spawned fruits
    for (let fruit of fruitGroup) {
        // Check if fruit fell below canvas
        if (fruit.y > height + 50) {
            // Delete sprite and increment counter
            fruit.remove();
            missed += 1;
        }
    }
}