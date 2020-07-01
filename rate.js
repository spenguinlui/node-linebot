const request = require("request")
const cheerio = require("cheerio")
// ˇ美金 (USD) = 1 , 港幣 (HKD) = 1, 

const methods = (con, index) => {
  return new Promise((resolve, reject) => {
    request({
      url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
      method: "GET"
    }, (error, response, body) => {
      if (error || !body) { return } else {
        let $ = cheerio.load(body);
        let buying = $('td[data-table=本行即期買入].rate-content-sight')[index].children[0].data;
        let selling = $('td[data-table=本行即期賣出].rate-content-sight')[index].children[0].data;
        msg = `${con}即期買入: ${buying},${con}即期賣出: ${selling}`
        resolve(msg)
      }
    })
  })
}

module.exports = methods