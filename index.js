const linebot = require('linebot')
const request = require("request")
const cheerio = require("cheerio")
const express = require('express');

var bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.ChannelSecret,
  channelAccessToken: process.env.ChannelAccessToken
});

bot.on('message', function(event) {
  if (
    event.message.text.indexOf("匯率") >= 0 ||
    event.message.text.indexOf("rate") >= 0 
  ) {
    event.reply(jp()).then(() => { console.log("回覆成功") }).catch(() => { console.log("回覆失敗") })
  } else {
    event.reply("本汪聽不懂你在說什麼捏").then(() => { console.log("回覆成功") }).catch(() => { console.log("回覆失敗") })
  }
  // console.log(event) //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// ˇ美金 (USD) = 1 , 港幣 (HKD) = 1, 
let jp = () => {
  let msg = ""
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, (error, response, body) => {
    if (error || !body) { return } else {
      let $ = cheerio.load(body);
      let buying = $('td[data-table=本行即期買入].rate-content-sight')[7].children[0].data;
      let selling = $('td[data-table=本行即期賣出].rate-content-sight')[7].children[0].data;
      // console.log('日幣即期買入: ' + buying + ' ,日幣即期賣出:' + selling)
      msg = '日幣即期買入: ' + buying + ' ,日幣即期賣出:' + selling
    }
  })
  return msg
};