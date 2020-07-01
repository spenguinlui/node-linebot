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
  console.log(event)
  if (event.message.text) {
    let isRate = confirmCon(event.message.text)
    if (isRate[0] >= 0){
      rate(isRate[1], isRate[0]).then((res)=> {
        event.reply(res)
      }).catch(() => {
        event.reply("抓不到匯率辣")
      })
    } else {
      if (isJapanese(event.message.text)) {
        event.reply('アホ？')
      } else {
        event.reply("本汪聽不懂你在說什麼捏")
      }
    }
  }
});

function confirmCon (con) {
  if (con.indexOf("美金") >= 0 || con.indexOf("美元") >= 0 || con.indexOf("USD") >= 0) {
    return [0, '美金']
  } else if (con.indexOf("港幣") >= 0 || con.indexOf("HKD") >= 0) {
    return [1, '港幣']
  } else if (con.indexOf("日圓") >= 0 || con.indexOf("日幣") >= 0 || con.indexOf("JPY") >= 0) {
    return [7, '日幣']
  } else if (con.indexOf("人民幣") >= 0 || con.indexOf("CNY") >= 0) {
    return [18, '人民幣']
  } else {
    return [- 1]
  }
}

function isJapanese(temp) { 
	var re = /[\u0800-\u4e00]/; 
	if(re.test(temp)) return true; 
	return false; 
}
