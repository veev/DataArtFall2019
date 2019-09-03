const fs = require('fs');

// read in CSV using FileSystem Node Package (included in OS)
const data = fs.readFileSync('HemlockData.csv', 'utf8');
// split each line on the newline character \n
const dataArray = data.split(/\r?\n/);
console.log(dataArray[0]);
console.log(dataArray[1]);
console.log(dataArray.length);

// iterate through the lines and create objects for each line
// by splitting at the commas for the various key/value pairs

// create empty data structures to put data as we iterate
let keys;
let treeData = [];
for (let i = 0; i < dataArray.length; i++) {
	if (i === 0) {
		// for the first row, save the comma separated values as keys to use for all values
		keys = dataArray[i].split(',');
	} else {
		values = dataArray[i].split(',');
		const obj = {};
		// iterate through key/value pairs separated by commas on each line
		for (j = 0; j < values.length; j++) {
			// create key/value pair at j and insert into object
			obj[keys[j]] = values[j];
		}
		// add tree data object to the treedata array
		treeData.push(obj);
	}
	
}

console.log(treeData[0]);
console.log(treeData[1]);
console.log(treeData.length);

fs.writeFileSync('HemlockData.json', JSON.stringify(treeData, null, 4), 'utf8');