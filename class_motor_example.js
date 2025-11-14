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

//   const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
//   if (!portIsOpen) return; // If the port is not open, exit the draw loop

//   let str = port.readUntil("\n"); // Read from the port until the newline
//   if (str.length == 0) return; // If we didn't read anything, return.

//   // trim the whitespace (the newline) and convert the string to a number
//   const buttonState = Number(str.trim());


    // Step 1: Make GUI that rotates with mouse input
    angleMode(DEGREES);
    translate(windowWidth / 2, windowHeight / 2);

    background("pink");
    let rot = map(mouseX, 0, windowWidth, -90, 90);
    rotate(rot);
    triangle(
        -100, 
        0,
        +100, 
        0,
        0, 
        -150);

    fill("white");
    noStroke();
    circle( 0, 0, 200);
    let angleToWrite = int (rot + 90); // map to 0-180 range
    port.write(angleToWrite);


    // Step 2: Send that data to Arduino

    

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
