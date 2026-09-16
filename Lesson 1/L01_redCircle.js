function setup() {
    createCanvas(600, 400);
    background(220);

    let x = 5;
    let y = 10;
    let total = x + y;
    for (let i = 0; i < 5; i++) {
        console.log(i)
    }
    console.log("Sum: " + total)
}

function draw() {
    fill("#fc0000");
    ellipse(300,150,50,50);
    fill("#ffcc00");
    ellipse(300,200,50,50);
    fill("#4efc03");
    ellipse(300,250,50,50);
}