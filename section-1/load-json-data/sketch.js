let treedata;

function preload() {
  // Don't use preload() function for JSON files, 
  // currently a bug in p5 where it doesn't return JSON Arrays only JSON Objects
  // populations = loadJSON('../data/simpleData_noRegions.json');
}

function setup() {
  // put setup code here
  // load static data set here
  loadJSON('../data/HemlockData.json', callback);
}

function callback(data) {
  console.log('done loading data');
  console.log(data);
  treedata = data;

  //if the data is loaded, start working with it
  if (treedata) {
    for (let i = 0; i < treedata.length; i++) {
      console.log(treedata[i]);
    
      let year = treedata[i].year;
      // amount in milimeters the tree grew that year
      let rawRingWidth = treedata[i]['RawRingWidth_mm'];
      // a normalized version that tries to account for climatic changes only, not ones specific to the individual tree
      let growthIndex = treedata[i].GrowthIndex;
          
      console.log(year, rawRingWidth, growthIndex)
    }
  }
}

function draw() {
  // put drawing code here

  if (treedata) {
    // How might you sort the data according to amount of growth?

    // How might you visually represent the tree data?
    // Try a few different ways
    // Think about shape, color, text
    // Once you feel comfortable with drawing a static representation, think about adding interactivity

  }
}