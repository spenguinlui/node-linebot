const linebot = require('linebot')
const express = require('express');
const rate = require('./rate.js');

// 初始化 bot 元件
var bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.ChannelSecret,
  channelAccessToken: process.env.ChannelAccessToken
});

// 驗證數位簽章並解析 JSON
const linebotParser = bot.parser();
const app = express();
app.post('/', linebotParser);

// express 預設 port 3000 改成 heroku 8080 port
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// 監聽收到訊息
bot.on('message', function(event) {
  if (event.message.text.indexOf("匯率") >= 0 || event.message.text.indexOf("rate") >= 0 ) {
    rate(event.message.text).then((res)=> {
      event.reply(res).then(() => { console.log("回覆成功") }).catch(() => { console.log("回覆失敗") })
    }).catch(() => {
      event.reply("抓不到匯率辣").then(() => { console.log("回覆成功") }).catch(() => { console.log("回覆失敗") })
    })
  } else if (/[^\u0800-\u4e00]/.test(event.message.text)) {
    event.reply('アホ？')
  } else {
    event.reply("本汪聽不懂你在說什麼捏").then(() => { console.log("回覆成功") }).catch(() => { console.log("回覆失敗") })
  }
});