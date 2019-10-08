const puppeteer = require('puppeteer')

// all the puppeteer functions you write need to use async when you declare the function.
// after declaring the function to be async, you can call other methods with await inside
// this waits for the Promise to resolve before moving ahead (sort of like how synchronous code works)

async function scrape() {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  
  await page.goto('http://books.toscrape.com/')
  const lightInTheAtticSelector = '#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img'
  await page.click(lightInTheAtticSelector)
  await page.waitFor(1000)

  const result = await page.evaluate(() => {
    let title = document.querySelector('h1').innerText
    let price = document.querySelector('.price_color').innerText

    return {
      title,
      price
    }

  })

  browser.close()
  return result
}

scrape().then((value) => {
  console.log(value) // Success!
})