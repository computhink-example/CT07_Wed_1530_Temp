function setup() {
  // Set up the canvas
  new Canvas(800, 400);
  background(250);  // Background colour

  // Basic shape testing

  // write your codes here
  // fill("#fff700")   // Colour in shape
  // stroke("#383838") // Outline
  // strokeWeight(10)    // Outline thickness

  // circle(400, 200, 100)     // x, y, diameter
  // rect(500, 200, 100, 200)  // x, y, width, height
  // triangle(50, 50, 400, 200, 50, 350)  // x1, y1, x2, y2, x3, y3
  // quad(400, 50, 700, 350, 400, 250, 100, 350)  // x1, y1, x2, y2, x3, y3, x4, y4

  // End Basic shape testing

   // Create a bouncing ball sprite
   // write your codes here
   ball = new Sprite(400, 200, 100);
   ball.color = "#fff700";
   ball.stroke = "#383838";
   ball.strokeWeight = 5
}

function draw() {
  // write your codes here
  background(250)
  ball.x += 1
}