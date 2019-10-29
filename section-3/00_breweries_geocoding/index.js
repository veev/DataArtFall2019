const fs = require('fs') // this lets us read and write files
const axios = require('axios') // this let's us make API calls with async/await

//Mapbox Geocoder API stuff
const BASE_URL = 'https://api.tiles.mapbox.com/v4/geocode/'
const ACCESS_TOKEN = '' //'YOUR MAPBOX PUBLIC TOKEN'
const dataset = 'mapbox.places' // temporary geocoder

// use axios to call the Mapbox Geocoder API asynchronously and return the response.data
async function getGeocodedData (url) {
    try {
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.log(error)
    }
}

// what format do we want our data in order to put it on a map?
// GeoJSON! What kind of geojson is it?
// Point - each coordinate is a point feature (instead of Line, Polygon or MultiPolygon)

// Basic Format of Point feature in GeoJSON
/*
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [ lon, lat] // for NYC [-73.984931, 40.755603]
  },
  "properties": {
    "brewery_name": "Valley Brewing Co.",
    "type": "Brewpub",
    "address": "PO Box 4653, Stockton, California, 95204",
    "website": "http://www.valleybrew.com/",
    "state": "california",
    "state_breweries": 284
  }
}
*/

// we need to create an async function to be able to call await inside
async function main() {
    // read in the csv file with fs
    // by default, it reads the entire file as one long string
    const string = fs.readFileSync('../data/breweries_us.csv', 'utf-8')
    // console.log(string.length)
    // console.log(string[0])

    // split on the newline character to get an array of the csv rows
    const csv = string.split('\n')
    console.log(csv[0])
    console.log(csv[1])
    console.log('the csv has', csv.length, 'rows')

    // iterate through the rows in order to geocode the address (get lat/lon coordinates)
    // we are using Mapbox's geocoding API because it is cheaper than Google's
    // create an empty array called features so we can save the csv and lat/lon info as geojson instead of csv

    const features = []

    async function translateRow() {
        //get the csv row
        const row = csv[i]
        // split the row by comma to get all the fields
        // const fields = row.split(',') // this doesn't work as there are commas within the address field
        // this is a regex lookahead pattern that I found on stackoverflow to solve for this issue
        // https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
        const fields = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) 
        // console.log(fields)
        // we need to format the address for an API query - white space gets replaced by %20 characters
        // # and / sign breaks the call, replace with nothing
        const address = fields[2].replace(/ /g,"%20").replace(/#/g, "").replace("/", "").replace(/"/g,"")
        console.log(address)

        // store the geometry into a new object following a GeoJSON feature standard
        const feature = {}

        // Call our function to geocode from an address to coordinates
        // create the url to pass to our geocoding async function
        const url = BASE_URL + dataset + '/' + address + '.json?access_token=' + ACCESS_TOKEN
        console.log(url)

        // if we don't call await in front of getGeocodedData then data is undefined
        const data = await getGeocodedData(url)
        // console.log(data)

        // add all the csv fields to the new geojson feature
        feature.geometry = data.features[0].geometry
        feature.properties = {}
        feature.properties.brewery_name = fields[0]
        feature.properties.type = fields[1]
        feature.properties.address = fields[2].replace(/"/g,"")
        feature.properties.website = fields[3]
        feature.properties.state = fields[4]
        feature.properties.state_breweries = fields[5]

        // add the feature to the features array
        features.push(feature) 
    }

    // Mapbox geocoder api rate limit is 600 requests per minute
    // We need a way to iterate through our csv data and geocode the address, but wait a few miliseconds
    // in between api calls so we don't exceed our rate limit
    // there is no easy delay() function in JavaScript to call at the end of a for loop
    // so we need to use recursion!
    let i = 1
    function myLoop () {            //  create a loop function
        setTimeout(function () {    //  call a 3s setTimeout when the loop is called
           translateRow()           //  your code here
           i++                      //  increment the counter
           if (i < csv.length) {    //  if the counter < csv.length, call the loop function
              myLoop();             //  ..  again which will trigger another 
           }                        //  ..  setTimeout()
        }, 300)

        // now create a GeoJSON formatted collection of features to save out
        const fc = {}
        fc.type = 'FeatureCollection'
        fc.features = features

        fs.writeFileSync('../data/breweries_us.geojson', JSON.stringify(fc, null, 4), 'utf-8')
    }
     
    myLoop()
}

main()