const fs = require('fs')
const puppeteer = require('puppeteer')

const yelpData = JSON.parse(fs.readFileSync('../data/yelp-pizzerias.json', 'utf8'))

const baseUrl = `https://www.yelp.com`

async function run() {
  const browser = await puppeteer.launch({ headless: false }) // set headless to false if you want to see puppeteer in action
  const page = await browser.newPage()

  let idx = 0

  for (let i = idx; i < yelpData.length; i++) {
    const id = `${yelpData[i].id}`
    //let queryString = `https://www.yelp.com/menu/roccos-pizza-joint-new-york`
    const filename = `${id}.json` // id + '.json'
    console.log(idx, id)
    await getRestaurantInfo(page, id, filename)
    idx++
  }

  await browser.close()
}

async function getRestaurantInfo(page, id, filename) {
  const queryStringMenu = `https://www.yelp.com/menu/${id}`
  const queryStringBiz = `https://www.yelp.com/biz/${id}`

  // get Restaurant Info
  await page.waitFor(randomIntFromInterval(900,1200))
  await page.goto(queryStringBiz)

  //'#wrap > div.main-content-wrap.main-content-wrap--full > div > div.lemon--div__373c0__1mboc.spinner-container__373c0__N6Hff.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.u-space-t3.u-space-b6.border-color--default__373c0__2oFDT > div > div > div.lemon--div__373c0__1mboc.stickySidebar--heightContext__373c0__133M8.tableLayoutFixed__373c0__12cEm.arrange__373c0__UHqhV.u-space-b6.u-padding-b4.border--bottom__373c0__uPbXS.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.arrange-unit__373c0__1piwO.arrange-unit-grid-column--8__373c0__2yTAx.u-padding-r6.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.u-space-b3.border-color--default__373c0__2oFDT > div > div:nth-child(1) > h1'
  // const NAME_SELECTOR = `#wrap > div.biz-country-us > div > div.top-shelf > div > div.biz-page-header.clearfix > div.biz-page-header-left > div > h1`
  const NAME_SELECTOR = `#wrap > div.main-content-wrap.main-content-wrap--full > div > div.lemon--div__373c0__1mboc.spinner-container__373c0__N6Hff.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.u-space-t3.u-space-b6.border-color--default__373c0__2oFDT > div > div > div.lemon--div__373c0__1mboc.stickySidebar--heightContext__373c0__133M8.tableLayoutFixed__373c0__12cEm.arrange__373c0__UHqhV.u-space-b6.u-padding-b4.border--bottom__373c0__uPbXS.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.arrange-unit__373c0__1piwO.arrange-unit-grid-column--8__373c0__2yTAx.u-padding-r6.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.u-space-b3.border-color--default__373c0__2oFDT > div > div:nth-child(1) > h1`
  // const PHONE_SELECTOR = `#wrap > div.biz-country-us > div > div.top-shelf > div > div.biz-page-subheader > div.mapbox-container > div > div.mapbox-text > ul > li:nth-child(4) > span.biz-phone`
  const PHONE_SELECTOR = `#wrap > div.main-content-wrap.main-content-wrap--full > div > div.lemon--div__373c0__1mboc.spinner-container__373c0__N6Hff.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.u-space-t3.u-space-b6.border-color--default__373c0__2oFDT > div > div > div.lemon--div__373c0__1mboc.stickySidebar--heightContext__373c0__133M8.tableLayoutFixed__373c0__12cEm.arrange__373c0__UHqhV.u-space-b6.u-padding-b4.border--bottom__373c0__uPbXS.border-color--default__373c0__2oFDT > div.lemon--div__373c0__1mboc.stickySidebar--fullHeight__373c0__1szWY.arrange-unit__373c0__1piwO.arrange-unit-grid-column--4__373c0__3oeu6.border-color--default__373c0__2oFDT > div > div > section > div > div:nth-child(2) > div > div.lemon--div__373c0__1mboc.arrange-unit__373c0__1piwO.arrange-unit-fill__373c0__17z0h.border-color--default__373c0__2oFDT > p:nth-child(2)`

  const name = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, NAME_SELECTOR)

  const phone_number = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, PHONE_SELECTOR)

  let fileInfo = {}
  fileInfo.name = name
  fileInfo.phone = phone_number
  console.log(fileInfo)

  // get Menu Stuff - wait for a random amount of time to confuse the servers
  await page.waitFor(randomIntFromInterval(900,1200))
  // change page to menu page
  await page.goto(queryStringMenu)
  // get menu data and write it to a JSON file
  await getMenu(page, id, filename, fileInfo)
}

async function getMenu(page, id, filename, fileInfo) {
                        // '#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div > div'
  const MENU_ROW_ITEM = `#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div > div`
  //#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div:nth-child(2) > div:nth-child(1) > div
  const menuItems = await page.evaluate((sel) => {
    let items = []
    const rows = document.querySelectorAll(sel)
    
    rows.forEach( row => {
      let menuItem = {}
      if (row.querySelector('h4')) {
        menuItem.name = row.querySelector('h4').innerText
      }
      if (row.querySelector('p')) {
        menuItem.description = row.querySelector('p').innerText
      }
      if (row.querySelector('div.menu-item-prices.arrange_unit > ul > li.menu-item-price-amount')) {
        menuItem.price = row.querySelector('div.menu-item-prices.arrange_unit > ul > li.menu-item-price-amount').innerText
      }
      // lazaras has prices in this format
                            // ' > div > div.menu-item-prices.arrange_unit > ul > li'
      if (row.querySelector('div.menu-item-prices.arrange_unit > table > tbody')) {
        const prices = row.querySelectorAll('div.menu-item-prices.arrange_unit > table > tbody > tr')
        const priceArray = []
        prices.forEach( price => {
          let priceInfo = {}
          if (price.querySelector('th')) {
            priceInfo.description = price.querySelector('th').innerText
          }
          if (price.querySelector('td')) {
            priceInfo.amount = price.querySelector('td').innerText
          }
          priceArray.push(priceInfo)
        })
        menuItem.price = priceArray
      }
      items.push(menuItem)
    })
    return items
  }, MENU_ROW_ITEM)

  //console.log(menuItems)

  // if we were able to save a restaurant menu, write it to a file
  if (menuItems.length > 0) {
    fileInfo.restaurant_id = id
    fileInfo.menu = menuItems
    // make sure the file pizza-menus exists in the data folder, otherwise you'll get an error
    fs.writeFileSync(`../data/pizza-menus/${filename}`, JSON.stringify(fileInfo, null, 4), 'utf8')
    console.log(`saved menu for ${fileInfo.name}`)
  } else {
    console.log(`no menu for ${id}`)
  }
}

// this helps confuse the yelp server so you aren't requesting at the same interval, prevents you from getting shut out more easily
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

run()