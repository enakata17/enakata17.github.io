const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables

let shapeIndex = 0;
let lastShapeButton = 0;

let colorIndex = 0;
let lastColorButton = 0;

let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
let colorsRGB = [
  [255, 0, 0],      // red   
  [255, 127, 0],    // orange
  [255, 255, 0],    // yellow
  [0, 255, 0],      // green
  [0, 0, 255],      // blue
  [125, 0, 255],    // purple
];

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

  // SET UP CANVAS
  // Move the origin to the center of the screen
  translate(windowWidth/2, windowHeight/2);

  // Set the background to cream
  background("pink");
  fill("coral");
  text("let's create!", 0, ((windowHeight / -2) + 50)); // Position text in center of the screen


  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  
  
  if (portIsOpen) {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length > 0) {
  
      const parts = str.trim().split(",");
      if (parts.length >= 2) {
  
          const shapeButton = Number(parts[0]);
          const colorButton = Number(parts[1]);

          // BUTTON 1: Change shape of the object being drawn based on button state
          if (shapeButton === 1 && lastShapeButton === 0) {
            shapeIndex = (shapeIndex + 1) % 3; // Toggle between 0 and 1
          }

          lastShapeButton = shapeButton;


          // BUTTON 2: Change color of the object being drawn based on button state
          if (colorButton === 1 && lastColorButton === 0) {
            colorIndex = (colorIndex + 1) % colors.length; // Cycle through colors
          
            const rgb = colorsRGB[colorIndex];
            const rgbMsg = r + "," + g + "," + b + "\n";
            port.write(rgbMsg); // Send RGB values to Arduino
          }

          lastColorButton = colorButton;

      } 
    }
  }

  noCursor();
  console.log(mouseX, mouseY);

  noStroke();
  fill(colors[colorIndex]);

  const x = mouseX - windowWidth/2;
  const y = mouseY - windowHeight/2;

  if (shapeIndex === 0) {
    circle(x, y, 50); // Draw a circle at the mouse position
  } else if (shapeIndex === 1) {
    square(x - 25, y - 25, 50); // Draw a square at the mouse position
  } else if (shapeIndex === 2) {
    triangle(
      x, y - 25, 
      x - 25, y + 25, 
      x + 25, y + 25); // Draw a triangle at the mouse position
  }



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
