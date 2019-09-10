// Code modified from Dan Shiffman's Polar Perlin Noise Loops
// https://www.youtube.com/watch?v=ZI1dmHv3MeM
let slider;

function setup() {
  // put setup code here
  createCanvas(900, 600);
  // create slider with min, max, default and increment (step)
  slider = createSlider(0, 5, 0.5, 0.1);
}

function draw() {
  // put drawing code here
  background(0);
  // translate to the middle of the canvas
  translate(width/2, height/2);
  noFill();
  // get slider value for the maximum noise value
  let noiseMax = slider.value();

  // let's make 20 of these polar perlin noise loops
  for (let i = 0; i < 20; i++) {
    
    beginShape();

    for (let a = 0; a < TWO_PI; a += 0.1) {
      // let's make the alpha channel different depending on which ring we're drawing
      let alpha = map(i, 0, 20, 255, 100);
      // we have a variable noiseMax from our slider that makes sure 
      // we are capping the amount of noise
      let xoff = map(cos(a), -1, 1, 0, noiseMax);
      let yoff = map(sin(a), -1, 1, 0, noiseMax);
      // make the radius of the loop based on the mapping the noise value of the xoff and yoff
      // increasing the radius with the more loops that are drawn
      let r = map(noise(xoff, yoff), 0, 1, 0, 600 * (i/20));
      // convert the polar coordinates to cartesian x,y coordinates to draw
      let x = r * cos(a);
      let y = r * sin(a);
      // draw the vertices, which are connected by endShape(CLOSE)
      stroke(255, alpha);
      strokeWeight(0.8);
      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
}