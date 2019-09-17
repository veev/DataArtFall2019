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
  console.log(rings.getColumn('RawRingWidth_mm'))
  
  // let's run some summary statistics
  const birthYear = d3.min(rings.getColumn('year'), d => +d);
  const latestYear = d3.max(rings.getColumn('year'), d => +d);
  const maxGrowth = d3.max(rings.getColumn('RawRingWidth_mm'), d => +d);
  const quants = d3.quantile(rings.getColumn('RawRingWidth_mm'), 0.25,  d => +d);
  const treeRadius = d3.sum(rings.getColumn('RawRingWidth_mm'), d => +d);
  console.log(maxGrowth);
  console.log(quants);
  console.log(treeRadius);
  console.log(birthYear);
  console.log(latestYear);

  // we need to map our rings data so it's a number we can do analysis on
  // access column data as array in order to use map function (needs an array)
  const rawValues = rings.getColumn('RawRingWidth_mm').map( ring => {
      // convert the string to a number and return it
      return +ring
  })
  console.log(d3.sum(rawValues))

  // what if we want to filter out specific years?
  // make sure to access rings as an array to be able to use filter function
  valuesTwentieth = rings.getArray().filter( ring => {
    // ring is an array of values representing the row data. 
    // year is the 0 element in the row array
    // return the values where the year starts with '19'
      return ring[0].substring(0, 2) == '19'
  })
  console.log(valuesTwentieth)

  // what if we want to bin certain years together - like decades?
    const bins = [];
    let binCount = 0;
    const interval = 10;

    //Setup Bins
    for (let i = birthYear; i < latestYear; i += interval){
        bins.push({
            binNum: binCount,
            minYear: i,
            maxYear: i + interval,
            decadeGrowth: 0
        })
        binCount++;
    }

    //Loop through data and add to bin's count
    for (let i = 0; i < rings.getArray().length; i++){
        const year = +rings.getArray()[i][0];
        for (let j = 0; j < bins.length; j++) {
            let bin = bins[j];
            if (year > bin.minYear && year <= bin.maxYear) {
                bin.decadeGrowth += +rings.getArray()[i][1];
            }
        } 
    }
    console.log(bins)
    fill(255, 255, 0, 180);
    stroke(0);
    // let's draw the bins
    const rectWidth = (width - margin - margin) / bins.length
    console.log(rectWidth)
    for (let i = 0; i < bins.length; i++) {
        const rectHeight = map(bins[i]['decadeGrowth'], 0, 19.0, height - margin, margin)
        rect(margin + (i * rectWidth), rectHeight, rectWidth, height - rectHeight)
    }


  // iterate through the TableRows and draw a circle where the axis is the year
  // and the y axis is the RawRingWidth measurement
  for (let i = 0; i < rings.getRowCount() - 1; i++) {
    // const timescale = map(+rings.getRow(i).get('year'), 1579, 2000, margin, width - margin)
    // const growthscale = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, height - margin, margin)
    // console.log(timescale, growthscale)
    const x0 = map(+rings.getRow(i).get('year'), 1579, 2000, margin, width - margin)
    const x1 = map(+rings.getRow(i + 1).get('year'), 1579, 2000, margin, width - margin)
    const y0 = map(+rings.getRow(i).get('RawRingWidth_mm'), 0, 2.1, height - margin, margin + height/2)
    const y1 = map(+rings.getRow(i + 1).get('RawRingWidth_mm'), 0, 2.1, height - margin, margin + height/2)
    fill(255);
    // noStroke();
    // ellipse(x0, y0, 10, 10)
    stroke(255);
    line(x0, y0, x1, y1);
  }
}

function draw() {
  // How can you extend this visually?
  // Should the data all be visible at once?
  // Should you see the data change over time?
  // What visual elements can the data be tied to?
}