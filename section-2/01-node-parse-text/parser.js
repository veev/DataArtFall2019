const fs = require('fs');
const fsText = fs.readFileSync('cafe_traceroutes.txt', 'utf-8');

// console.log(fsText);
// console.log(fsText.length);
let ipLines = fsText.split("\n");
// console.log(ipLines.length);

let ipAddresses = [];

for (let i= 0; i< ipLines.length; i++){
    let ipObj = {};

    let ipArray = ipLines[i].split("(");
    // console.log(ipArray);
    // console.log(" ");

    if(ipArray.length >1){
        ipObj.Address = ipArray[1].split(")")[0];
        
        let msArray = ipArray[1].split(')')[1].trim().split("  ");
        ipObj.Ms = msArray;
        
        console.log(ipObj);
        ipAddresses.push(ipObj);
    }
    
}

fs.writeFileSync("cafe_traceroute.json", JSON.stringify(ipAddresses),'utf-8');