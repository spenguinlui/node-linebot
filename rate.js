const request = require("request")
const cheerio = require("cheerio")
// ˇ美金 (USD) = 1 , 港幣 (HKD) = 1, 

const methods = (con) => {
  return new Promise((resolve, reject) => {
    request({
      url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
      method: "GET"
    }, (error, response, body) => {
      if (error || !body) { return } else {
        let $ = cheerio.load(body);
        contryIndex = confirmCon(con)
        let buying = $('td[data-table=本行即期買入].rate-content-sight')[contryIndex].children[0].data;
        let selling = $('td[data-table=本行即期賣出].rate-content-sight')[contryIndex].children[0].data;
        msg = '日幣即期買入: ' + buying + ' ,日幣即期賣出:' + selling
        resolve(msg)
      }
    })
  })
}

module.exports = methods