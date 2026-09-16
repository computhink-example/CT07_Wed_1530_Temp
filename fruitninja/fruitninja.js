// Variables
let background;
let fruitGroup; // group for whole fruits
let fruitTypes  = []; // store fruit image objects
let trail;
let fruitHalves; // new group for sliced halves

function preload() {
    // Load image
    background = loadImage("assets/dojobackground.png");
    // declare the peach object
    let peach = {
        whole: loadImage("assets/peachwhole.png"),
        half1: loadImage("assets/peachhalf.png"),
        half2: loadImage("assets/peachhalf2.png"),
    }

    // declare the watermelon object
    let watermelon = {
        whole: loadImage("assets/watermelonwhole.png"),
        half1: loadImage("assets/watermelonhalf.png"),
        half2: loadImage("assets/watermelonhalf.png"),
    }

    // new fruit types
    let tomato = {
        whole: loadImage("assets/tomato1.png"),
        half1: loadImage("assets/tomato2.png"),
        half2: loadImage("assets/tomato2.png"),
    }

    let dragonfruit = {
        whole: loadImage("assets/dragonfruit1.png"),
        half1: loadImage("assets/dragonfruit2.png"),
        half2: loadImage("assets/dragonfruit2.png"),

        // Add scaleMod
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

    // Debug text
    fill("#dadada") // Text colour
    textSize(50);
    text("frameCount:"+ frameCount, 10, 40);

    // call spawnFruit function
    if (frameCount % 20 == 0) {
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

   
}
// check if any fruit is sliced by the mouse
function sliceFruit(){
    for (let fruit of fruitGroup) {
        if (fruit.sliced){
            continue; // skip already sliced fruits
        }

        // calculate distance between mouse and fruit
        let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);

        if (d < ((fruit.d / 2) + 5)) {
            fruit.sliced = true; // prevent repeat slicing

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
    right.vel.x = 3; // veer right
    right.vel.y = random(-5, -2);
    right.rotationSpeed = 5;
    right.life = 60; // remove after 30 frames
    right.collider = "dynamic"; // dynamic - yes gravity and yes collision / static - no gravity and yes collision / none - no gravity and no collision
    right.overlaps(allSprites); // disable collision
    right.layer = 1;
}
