function setup() {
  // write your codes here
  // Set up the canvas
  new Canvas(800, 400);
  background(250);  // Background colour
  textSize(24); // Set text size
  fill("#fc0000");  // Set text colour

  // console.log("Hello.");  // Print

  // let a = 1;
  // let b = 2;
  // let sum = a + b;
  // console.log("Sum: " + sum);

  // --- Exercise: Area of Triangle ---
  // write your codes here
  // let base = 10;
  // let height = 5;
  // let area = 0.5 * base * height;
  // console.log("Area: " + area);
  // text("Area: " + area, 400, 200);  // (string, x, y)

  // --- Exercise: Sum of first 10 even numbers ---
  // write your codes here
  // let sum = 0;
  // let yPos = 50;
  // for (let i = 2; i <= 20; i += 2) {
  //   console.log(i);
  //   sum += i;
  //   text(i, 400, yPos);
  //   yPos += 20;
  // }
  // console.log("Sum: " + sum);
  // text("Sum: " + sum, 400, yPos);

  // --- Exercise: Age category classification ---
  // write your codes here
  // let age = 10;

  // if (age <= 9) {
  //   console.log("Lower Primary");
  // } else if (age <= 12) {
  //   console.log("Upper Primary");
  // } else if (age ) {
  //   console.log("Secondary");
  // }

  // --- Exercise: Display odd numbers backward using while loop ---
  // write your codes here
  // let number = 19;

  // while (number >= 1) {
  //   if (number % 2 == 1) {
  //     console.log(number);
  //   } 
  //   number--;
  // }

  // --- Exercise: Array operations (groceries) ---
  // write your codes here
  let groceries = ["apple" , "bread", "milk"];
  groceries.push("orange");
  groceries.push("butter");
  groceries.shift();  // Remove first item
  // groceries.pop();  // Remove last item
  // groceries.splice(1, 1); // (starting index, num of items to remove)
  groceries.splice(1, 1, "kaya"); // (starting index, num of items to remove, item(s) to insert)
  console.log(groceries);
}