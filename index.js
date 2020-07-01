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
  console.log(event); //把收到訊息的 event 印出來看看
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
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, (error, response, body) => {
    if (error || !body) { return } else {
      let $ = cheerio.load(body);
      let buying = $('td[data-table=本行即期買入].rate-content-sight')[7].children[0].data;
      let selling = $('td[data-table=本行即期賣出].rate-content-sight')[7].children[0].data;
      console.log('日幣即期買入: ' + buying + ' ,日幣即期賣出:' + selling);
    }
  })
};