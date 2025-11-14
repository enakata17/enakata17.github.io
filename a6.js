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

  // Read from the serial port
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.

  // Split the string into an array using the commas
  let sensors = str.trim().split(",").map(Number);  
  
  let button1 = sensors[0]; // Button 1 (shape) state
  let button2 = sensors[1]; // Button 2 (color) state
  let potentiometer = sensors[2]; // Potentiometer (size) value
  let joystickX = sensors[3]; // Joystick X (position) value
  let joystickY = sensors[4]; // Joystick Y (position) value
  let button3 = sensors[5]; // Button 3 (place) state
  let button4 = sensors[6]; // Button 4 (clear) state



  // Move the origin to the center of the screen
  translate(windowWidth/2, windowHeight/2);

  // Set the background to cream
  background("cream");
  fill("coral");
  text("let's create!", 0, ((windowHeight / -2) + 50)); // Position text in center of the screen

  noStroke();
  fill("white");
  circle(0, 0, 200); // Draw a circle in the center of the screen

  noCursor();
  console.log(mouseX, mouseY);
  fill("white");
  circle(mouseX - windowWidth/2, mouseY - windowHeight/2, 50); // Draw a circle at the mouse position



  // BUTTON 1: Change shape of the object being drawn based on button state
  // Push button to change between triangle, square, rectangle, hexagon, octogan, star, circle
  const shapeType = ["triangle", "square", "rectangle", "hexagon", "octagon", "star", "circle"];

  let currentShape = 0;
  if (button1 == HIGH) {
    currentShape = (currentShape + 1) % shapeType.length;
    // createShape(currentShape, 50);
    text("drawn shape: " + shapeType[currentShape], 0, ((windowHeight / -2) + 120));
  }



  // // BUTTON 2: Change color of the object being drawn based on button state
  // // Push button to change between red, orange, yellow, green, blue, violet, pink, white, black
  // const colors = ["red", "orange", "yellow", "green", "blue", "violet", "pink", "white", "black"];

  // let currentColor = 0;
  // if (button2 == HIGH) {
  //   currentColor = (currentColor + 1) % colors.length;
  // }

  // noStroke();
  // fill(colors[currentColor]);

  // // Make LED color correspond to selected color
  // const ledColors = {
  //   "red": [255, 0, 0],
  //   "orange": [255, 165, 0],
  //   "yellow": [255, 255, 0],
  //   "green": [0, 255, 0],
  //   "blue": [0, 0, 255],
  //   "violet": [238, 130, 238],
  //   "pink": [255, 192, 203],
  //   "white": [255, 255, 255],
  //   "black": [0, 0, 0]
  // };

  // const rgb = ledColors[colors[currentColor]];
  // analogWrite(ledPinR, rgb[0]);
  // analogWrite(ledPinG, rgb[1]);
  // analogWrite(ledPinB, rgb[2]);




  // // POTENTIOMETER: Change size of the object being drawn based on potentiometer value
  // let shapeSize = 50;

  // // map potentiometer value (0-1023) to size (10-200)
  // shapeSize = map(potentiometer, 0, 1023, 10, 200);
  // shapeSize = constrain(shapeSize, 10, 200); // Constrain size to be between 10 and 200

  // // Draw the shape with the current size
  // if (currentShape == 0) {
  //   triangle(-shapeSize/2, shapeSize/2, 0, -shapeSize/2, shapeSize/2, shapeSize/2);
  // } else if (currentShape == 1) {
  //   square(-shapeSize/2, -shapeSize/2, shapeSize);
  // } else if (currentShape == 2) {
  //   rect(-shapeSize*0.8/2, -shapeSize/2, shapeSize*0.8, shapeSize);
  // } else if (currentShape == 3) {
  //   polygon(0, 0, shapeSize/3, 6); // Hexagon
  // } else if (currentShape == 4) {
  //   polygon(0, 0, shapeSize/3, 8); // Octagon
  // } else if (currentShape == 5) {
  //   star(0, 0, shapeSize/6, shapeSize/3, 5); // Star
  // } else if (currentShape == 6) {
  //   circle(0, 0, shapeSize); // Circle
  // }

  // // Make LED brightness correspond to potentiometer value
  // analogWrite(ledPin, potentiometer / 4); // Scale 0-1023 to 0-255


  // // Joystick: Change position of the object being drawn based on joystick values
  // // Move joystick to change position of object being drawn -- x and y positions





  // // BUTTON 3: Place objects on the screen when button is pressed
  // if (button3 == HIGH) {
  //   // Place the current shape at the current mouse position
  //   push();
  //   translate(mouseX, mouseY);
  //   noStroke();
  //   fill(colors[currentColor]);
  //   // Draw the current shape
  //   createShape(currentShape, shapeSize);
  //   pop();
  // }



  // // BUTTON 4: Clear the screen when button is pressed
  // if (button4 == HIGH) {
  //   // Clear the screen by resetting the background
  //   background("cream");
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


// Function created to create different shapes based on shape index
function createShape(currentShape, shapeSize) {
  if (currentShape == 0) {
    triangle(-25, 25, 0, -25, 25, 25);
  } else if (currentShape == 1) {
    square(-25, -25, 50);
  } else if (currentShape == 2) {
    rect(-40, -25, 80, 50);
  } else if (currentShape == 3) {
    polygon(0, 0, 30, 6); // Hexagon
  } else if (currentShape == 4) {
    polygon(0, 0, 30, 8); // Octagon
  } else if (currentShape == 5) {
    star(0, 0, 15, 30, 5); // Star
  } else if (currentShape == 6) {
    circle(0, 0, 50); // Circle
  }
}
