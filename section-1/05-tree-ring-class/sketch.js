let rings;

function preload() {
  rings = loadTable("../data/HemlockData.csv", "csv", "header");
}

function setup() {
  createCanvas(1200, 800);
  background(0);
  noStroke();
  // put setup code here
  console.log(rings.getRowCount() + " total rows in table");
  console.log(rings.getColumnCount() + " total columns in table");

  // translate to the middle of the canvas to draw
  translate(width/2,height/2);

  // for each row of data, draw a tree ring
  // see the TreeRing class for details on how it's drawn
  for (let i = 0; i < rings.getRowCount() - 200; i++) {
    // we mainly care about the RawRingWidth_mm value, which we will use
    // to change the radius of the TreeRing
    // const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, 0, 10)
    // map the RawRingWidth_mm value to values between 0 and 10
    // the + sign before rings.getRow(i).get('RawRingWidth_mm') converts a string to a number
    const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, 0, 10);
    // console.log(i, timescale, growthscale)
    // a new TreeRing is instantiated with a noiseMax value, spacing, index, and total number of rings to draw
    const tr = new TreeRing(0.5, growthscale, i, rings.getRowCount());
    tr.display();
  }
}

function draw() {
  
}