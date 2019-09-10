let rings;
let button;
let treerings = [];
let yearIndex = 0;
isPlaying = false;
let interval;

function preload() {
  rings = loadTable("../data/HemlockData.csv", "csv", "header");
}

function setup() {
  // put setup code here
  createCanvas(1200, 800);

  button = createButton('Play');
  button.position(20, 20);
  // when the button is pressed the play state is toggled
  button.mousePressed(togglePlaystate);

  // create a setInterval which calls the handlePlayback function every 100 millis
  interval = setInterval(handlePlayback, 100);

  console.log(rings.getRowCount() + " total rows in table");
  console.log(rings.getColumnCount() + " total columns in table");

  // for each row of data, draw a tree ring
  // see the TreeRing class for details on how it's drawn
  for (let i = 0; i < rings.getRowCount(); i++) {
    // we mainly care about the RawRingWidth_mm value, which we will use
    // to change the radius of the TreeRing
    // const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, 0, 10)
    // map the RawRingWidth_mm value to values between 0 and 10
    // the + sign before rings.getRow(i).get('RawRingWidth_mm') converts a string to a number
    const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, 0, 10);
    // console.log(i, timescale, growthscale)
    // a new TreeRing is instantiated with a noiseMax value, spacing, index, and total number of rings to draw
    const tr = new TreeRing(0.5, growthscale, i, rings.getRowCount());
    // add TreeRing to treerings array
    treerings.push(tr);
    // tr.display();
  }
}

function draw() {
  background(0);

  // create some text to show which year in the data we are at
  textSize(32);
  fill(255, 255, 255);
  if (yearIndex < rings.getRowCount()) text(rings.getRow(yearIndex).get('year'), 20, 100);

  // translate to the middle of the canvas to draw
  translate(width/2,height/2);
  // draw the rings up until the yearIndex we are at
  noStroke();
  for (let i = 0; i < yearIndex; i++) {
    let tr = treerings[i]
    tr.display();
  }
}

function handlePlayback() {
  if (!isPlaying) {
    // do nothing
  } else {
    // add 1 to the yearIndex each time we call the playback function in the setInterval
    yearIndex++;
    // make sure we stop the playback once we reach the end of our data
    if (yearIndex === treerings.length) {
      clearInterval(interval);
      isPlaying = false;
      handleButtonText();
    }
  }
}

function togglePlaystate() {
  // change isPlaying boolean to be the opposite of what it was (false --> true, true --> false)
  isPlaying = !isPlaying;
  console.log('isPlaying is', isPlaying);
  handleButtonText();
}

function handleButtonText() {
  // just handle updating the button text based on the isPlaying boolean
  if (isPlaying) {
    button.html('Pause');
  } else {
    button.html('Play');
  }
}