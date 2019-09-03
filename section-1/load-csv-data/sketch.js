let rings;
let margin = 40;

function preload() {
  // Use preload to have the data read in by the time you run the setup() code
  rings = loadTable("../data/HemlockData.csv", "csv", "header");
}

function setup() {
  // all sketches need a canvas instance
  createCanvas(1200, 800)
  // we're not using the draw loop so color the background and set drawing styles
  background(0)
  noStroke()
  fill(255, 180)
  // print out the Table data we've loaded
  console.log(rings.getRowCount() + " total rows in table");
  console.log(rings.getColumnCount() + " total columns in table");

  // how do we want to work with our Table Data?
  console.log(rings.getObject());

  console.log(rings.getArray());

  console.log(rings.getRows());

  // iterate through the TableRows and draw a circle where the axis is the year
  // and the y axis is the RawRingWidth measurement
  for (let i = 0; i < rings.getRowCount(); i++) {
    const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, margin, width - margin)
    const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, height - margin, margin)
    console.log(timescale, growthscale)
    ellipse(timescale, growthscale, 10, 10)
  }
}

function draw() {
  // How can you extend this visually?
  // Should the data all be visible at once?
  // Should you see the data change over time?
  // What visual elements can the data be tied to?
}