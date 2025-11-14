const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);

  // p5 text settings. BOLD and CENTER are constants provided by p5.
  // See the "Typography" section in the p5 reference: https://p5js.org/reference/
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.

  // trim the whitespace (the newline) and convert the string to a number
  const buttonState = Number(str.trim());


  // Move the origin to the center of the screen
  translate(windowWidth/2, windowHeight/2);

  // Set the background to cream
  background("pink");
  fill("coral");
  text("let's create!", 0, ((windowHeight / -2) + 50)); // Position text in center of the screen

  noCursor();
  console.log(mouseX, mouseY);

  let shapeIndex = 0;
  let lastButtonState = 0;

  const button1 = buttonState; // Button 1 (shape) state

  if (button1 === 1 && lastButtonState === 0) {
    shapeIndex = (shapeIndex + 1) % 2; // Toggle between 0 and 1
  }

  lastButtonState = button1;

  noCursor();
  noStroke();
  fill("white");

  const x = mouseX - windowWidth/2;
  const y = mouseY - windowHeight/2;

  if shapeIndex === 0 {
    circle(x, y, 50); // Draw a circle at the mouse position
  } else if shapeIndex === 1 {
    square(x - 25, y - 25, 50); // Draw a square at the mouse position
  } else if (shapeIndex === 2) {
    triangle(
      x, y - 25, 
      x - 25, y + 25, 
      x + 25, y + 25); // Draw a triangle at the mouse position
  }

  // BUTTON 1: Change shape of the object being drawn based on button state
  // Push button to change between triangle, square, rectangle, hexagon, octogan, star, circle
  // const shapeType = ["triangle", "square", "rectangle", "hexagon", "octagon", "star", "circle"];

  // let currentShape = 0;
  // if (buttonState == 1) {
  //   // If the button is pressed, change the shape
  //   triangle(0, -25, -25, 25, 25, 25); // Draw a triangle in the center of the screen
  //   // createShape(currentShape, 50);
  //   // text("drawn shape: " + shapeType[currentShape], 0, ((windowHeight / -2) + 120));
  // }

  // // Change text and colors based on button state. In p5, you can set colors
  // // using standard CSS color names as well as many other color formats.
  // if (buttonState === 0) {
  //   // If the button is not pressed
  //   background("darkcyan"); // Background color
  //   fill("coral"); // Fill color for the text
  //   text("not pressed", windowWidth / 2, windowHeight / 2); // Position text in center of the screen
  // } else if (buttonState === 1) {
  //   // If the button is pressed
  //   background("pink"); // Background color
  //   fill("yellow"); // Fill color for the text
  //   text("pressed!", windowWidth / 2, windowHeight / 2); // Position text in center of the screen
  // }
}

// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}
