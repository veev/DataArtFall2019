class TreeRing {
  // a TreeRing class constructor
  // takes a noiseMax value, a spacing value from the RawRingWidth (like a radius)
  // the index of which TreeRing it is in the total number of rings, and the total number of rings to draw
  constructor(noiseMax, spacing, index, num) {
    this.noiseMax = noiseMax;
    this.index = index;
    this.num = num;
    this.spacing = spacing;
  }
  
  display() {

    noFill();
    // join points around a circle with beginShape() and endShape(CLOSE)
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      // console.log(this.spacing);
      // map the spacing (raw ring width) to the alpha value of the ring
      // so that they are not all full opacity
      let alpha = map(this.spacing, 0.0, 10.0, 0, 200);
      // map the x-offset from the polar coordinates equation to a value between 0 and the noiseMax (no negative values)
      // map the y-offset from the polar coordinates equation to a value between 0 and the noiseMax (no negative values)
      let xoff = map(cos(a), -1, 1, 0, this.noiseMax);
      let yoff = map(sin(a), -1, 1, 0, this.noiseMax);
      // set the radius according to the what the noise function returns from the x and y offsets
      // then map this value (a number between 0 and 1) to a larger range of values (0 and 1200)
      // multiply this by the index value of the ring to draw divided by the total number of rings
      // which multiplies the range by a value starting at 0 and going all the way to 1 (to make concentric circles)
      // and then add to this regular increment per index the spacing (raw ring width) so that each ring is not an 
      // equal distance from the previous one, but depends on the growth of that year
      let r = map(noise(xoff, yoff), 0, 1, 0, 1200 * (this.index/this.num) + this.spacing);
      // if (a === 0) console.log(this.index, a, r);
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