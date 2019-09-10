let rings;

function preload() {
  rings = loadTable("../data/HemlockData.csv", "csv", "header");
}

function setup() {
  createCanvas(1200, 800)
  background(0)
  noStroke()
  fill(255, 180)
  // put setup code here
  console.log(rings.getRowCount() + " total rows in table");
  console.log(rings.getColumnCount() + " total columns in table");

  // translate to the middle of the canvas to draw
  translate(width/2,height/2)

  // for each row of data, draw a tree ring
  // using the perlin noise / polar coordinate approach from the perlin noise loop example
  // iterate through each row of data
  for (let i = 0; i < rings.getRowCount() - 200; i++) {
    // we mainly care about the RawRingWidth_mm value, which we will use
    // to change the radius of the ring
    // const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, 0, 10)
    // map the RawRingWidth_mm value to values between 0 and 10
    // the + sign before rings.getRow(i).get('RawRingWidth_mm') converts a string to a number
    const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, 0, 10);
    const noiseMax = 0.5;
    // console.log(i, timescale, growthscale)
    // a new TreeRing is instantiated with a noiseMax value, spacing, index, and total number of rings to draw
    noFill();
    // join points around a circle with beginShape() and endShape(CLOSE)
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      // console.log(this.spacing);
      // map the spacing (raw ring width) to the alpha value of the ring
      // so that they are not all full opacity
      let alpha = map(growthscale, 0.0, 10.0, 0, 200);
      // map the x-offset from the polar coordinates equation to a value between 0 and the noiseMax (no negative values)
      // map the y-offset from the polar coordinates equation to a value between 0 and the noiseMax (no negative values)
      let xoff = map(cos(a), -1, 1, 0, noiseMax);
      let yoff = map(sin(a), -1, 1, 0, noiseMax);
      // set the radius according to the what the noise function returns from the x and y offsets
      // then map this value (a number between 0 and 1) to a larger range of values (0 and 1200)
      // multiply this by the index value of the ring to draw divided by the total number of rings
      // which multiplies the range by a value starting at 0 and going all the way to 1 (to make concentric circles)
      // and then add to this regular increment per index the spacing (raw ring width) so that each ring is not an 
      // equal distance from the previous one, but depends on the growth of that year
      let r = map(noise(xoff, yoff), 0, 1, 0, 1200 * (i/rings.getRowCount()) + growthscale);

      // translate the polar to cartesian coordinates
      let x = r * cos(a);
      let y = r * sin(a);
      // set stroke parameters
      stroke(255, alpha);
      strokeWeight(0.8);
      // draw point
      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
}

function draw() {
  
}