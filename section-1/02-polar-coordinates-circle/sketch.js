
// let slider;

function setup() {
  // put setup code here
  createCanvas(900, 600);
  // slider = createSlider(0, 10, 5, 0.1);
}

function draw() {
  // put drawing code here
  background(0);
  translate(width/2, height/2);

  noFill();
  
  // let noiseMax = slider.value() //0.5
  // let's make 20 of these polar perlin noise loops
    
    beginShape();
    // let the default radius be 100
    let r = 100;
    // step around the angles in a circle
    for (let a = 0; a < TWO_PI; a += 0.1) {

      // convert the polar coordinates to cartesian x,y coordinates to draw
      // x is the radius * the cosine of the angle
      // y is the radius * the sine of the angle
      let x = r * cos(a);
      let y = r * sin(a);
      // draw the vertices, which are connected by endShape(CLOSE)
      stroke(255);
      strokeWeight(0.8);
      curveVertex(x, y);
    }
    endShape(CLOSE);
}