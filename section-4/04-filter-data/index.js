const tf = require('d3-time-format')
const fs = require('fs')
const csv = require('csv-parser')

const data = []

fs.createReadStream('../data/ks-projects-201612.csv')
  .pipe(csv())
  .on('data', (row) => {
       let obj = {}
        for (let [key, value] of Object.entries(row)) { // Object.entries is a way of getting the key value pairs as an array
            if (key.length > 0) { // this is to get rid of the empty string key and value that was getting added
                let trimmed = key.trim().replace(' ', '_') // clean up the keys and replace spaces with underscores
                obj[trimmed] = value //save formatted key into new object
            }
        }  
      data.push(obj)
    //data.push(row)
  })
  .on('end', () => {
    console.log('Data loaded')
    console.log(data.length)
    // console.log(data[0])
    // console.log(data[1])
    // we want a function to parse strings as dates
    const dateParser = tf.timeParse('%Y-%m-%d %H:%M:%S') // format of time string '2013-02-26 00:20:50'
    // once we have a date, we can call various other date formatters on it
    const monthYearFormatter = tf.timeFormat('%b %Y')
    const weekOfYear = tf.timeFormat('%W')

    const filtered = data.filter( d => {
        const dateTime = dateParser(d.deadline)
        const monthYear = monthYearFormatter(dateTime)
        const week = weekOfYear(dateTime)
        if (monthYear === 'Nov 2016' && week === '47') return d
    })

    console.log(filtered.length)
    // save out the filtered data
    fs.writeFileSync('../data/ks-projects-2016novlastweek.csv', JSON.stringify(filtered, null, 4), 'utf8')
  })

