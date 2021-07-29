const axios = require("axios");
const nhentai = require("nhentai");
const request = require("request");
const topdf = require("image-to-pdf");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const speed = require("performance-now");
const moment = require("moment-timezone");
const { Telegraf } = require("telegraf");

const bot = new Telegraf("1929357866:AAHIp1ukgjz50AFhCzXedn17JzZMModXsus"); // get token in BotFather Telegram

// Please don't delete the credit :)

function sendStart(ctx) {
  bot.telegram.sendMessage(ctx.chat.id, "NHENTAI BOT\n\nJust send me nhentai code and i send you nhentai pdf :)",
    {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Owner ♥️', url: 'http://t.me/akkun0307'
          },
            {
              text: 'Source Code 💻', url: 'https://github.com/mccnlight/nHentai-project'
            }]
        ]
      },
      parse_mode: "Markdown", reply_to_message: ctx.message_id
    })
}

function sendMessageping(ctx){
	function format(seconds){
		function pad(s){
			return (s < 10 ? `0` : ``) + s;
		}
		var hours = Math.floor(seconds / (60*60));
		var minutes = Math.floor(seconds % (60*60) / 60);
		var seconds = Math.floor(seconds % 60);
		
	return pad(hours) + ` H,` + pad(minutes) + ` M,` + pad(seconds) + ` S`;
		}
		
	var uptime = process.uptime();
	let timestamp = speed();
	let latensi = speed() - timestamp
	let tutid = moment().millisecond()
	var tmenu = `.....:𝐈𝐍𝐅𝐎 𝐁𝐎𝐓:.....\n`
	tmenu += `-----｢ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐈𝐧𝐟𝐨 ｣-----\n`
	tmenu += `➪ *Host* : _${os.hostname()}_\n`
	tmenu += `➪ *Platfrom* : _${os.platform()}_\n`
	tmenu += `➪ *CPU* : _${os.cpus()[0].model}_\n`
	tmenu += `➪ *Speed* : _${os.cpus()[0].speed} MHz_\n`
	tmenu += `➪ *Core* : _${os.cpus().length}_\n`
	tmenu += `➪ *Penggunaan RAM* : _${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require(`os`).totalmem / 1024 / 1024)}MB_\n\n`
	tmenu += ` ❒ Ping : *${tutid}MS*\n`
	tmenu += ` ❒ Runtime : *${format(uptime)}*\n`
	tmenu += ` ❒ _Speed_  *${latensi.toFixed(4)}* _Second_🚀`
	bot.telegram.sendMessage(ctx.chat.id, tmenu)
})
}

bot.start((ctx) => {
  sendStart(ctx)
})

bot.command("help", async ctx => {
  sendStart(ctx)
})

bot.command("ping", async ctx => {
	sendMessageping(ctx)
})

bot.command("ytmp3", async (ctx) => {
	try{
    let input = ctx.message.text
    let inputArray = input.split(" ")
    let message = "";
    
    if(inputArray.length == 1){
        ctx.reply("Please enter a link, an example /ytmp3 https://www.youtube.com/watch?v=U5TkJ2HhMEw&list=RDen9KJdbrZj0&index=27")
    }else{
        ctx.reply("Wait, the bot is being searched")
        inputArray.shift();
        messager = inputArray.join(" ")
        res = await axios.get("http://lolhuman.herokuapp.com/api/ytaudio?apikey=genbotkey&url=" + messager)
        data = res.data.result
        if(!data){
            ctx.reply("Music not found")
        }else{
        	capt = `Title : ${data.title}`
        capt += `By : ${data.uploader}\n`
        capt += `Duration : ${data.duration}\n`
        capt += `View : ${data.view}\n`
        capt += `Like : ${data.like}\n`
        capt += `Dislike : ${data.dislike}\n`
        capt += `Size : ${data.link.size}\n`
        ctx.replyWithPhoto({url: data.thumbnail}, {caption: capt})
        if (Number(data.link.size.split(` MB`)[0]) >= 25.00) return ctx.reply("Sorry the bot cannot send more than 25 MB!")
        ctx.reply("Wait, audio is being sent")
        // console.log(data.link[0].link)
        ctx.replyWithAudio({ url: data.link.link, filename: data.title }, { thumb: data.thumbnail, artist: data.uploader})
        } 
    }
    } catch(e) {
    	ctx.reply(String(e))
    }
})

bot.on('text', async lintod => {
  let body = lintod.update.message.text || ''
  let id = body
  const userName = lintod.message.from.username

  // log
  console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ TELEBOT ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.keyword("yellow")(userName))

  if (body && body.match(/^[0-9]/)) {
    let count = 0
    let ResultPdf = [];
    try {
      lintod.reply("Please wait, data is being processed");
      const get_result = new nhentai.API()
      const doujin = await get_result.fetchDoujin(id);
      const array_page = doujin.pages
      const title = doujin.titles.pretty
      
      res = await axios.get("http://lolhuman.herokuapp.com/api/nhentai/" + id + "?apikey=genbotkey")
      data = res.data.result
      caption = `${data.title_romaji}\n\n`
      caption += `${data.title_native}\n\n`
      caption += `Parodies : ${data.info.parodies}\n\n`
      caption += `Character : ${data.info.characters.join(", ")}\n\n`
      caption += `Tags : ${data.info.tags.join(", ")}\n\n`
      caption += `Artists : ${data.info.artists}\n\n`
      caption += `Groups : ${data.info.groups}\n\n`
      caption += `Languages : ${data.info.languages}\n\n`
      caption += `Categories : ${data.info.categories}\n\n`
      caption += `Pages : ${data.info.pages}\n\n`
      caption += `Uploaded : ${data.info.uploaded}\n`
      await lintod.replyWithPhoto({ url: data.image[0] }, { caption: caption, parse_mode: "Markdown" })

      for (let index = 0; index < array_page.length; index++) {
        const image_name = "nhentai/" + title + index + ".jpg"
        await new Promise((resolve) => request(array_page[index]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
        console.log(array_page[index].url);

        ResultPdf.push(image_name);
        count++
      }

      await new Promise((resolve) =>
        topdf(ResultPdf, 'A4')
        .pipe(fs.createWriteStream('nhentai/' + title + '.pdf'))
        .on('finish', resolve)
      )

      for (let index = 0; index < array_page.length; index++) {
        fs.unlink("nhentai/" + title + index + ".jpg", (err) => {
          if (err) throw err
        })
      }

      const size = await fs.statSync(`nhentai/${title}.pdf`).size
      if (size < 45000000) {
        lintod.reply("Uploading document...");
        await lintod.replyWithDocument({
          source: `nhentai/${title}.pdf`, filename: `${title}.pdf`
        })
        .then((result) => {
          fs.unlink(`nhentai/${title}.pdf`, (err) => {
            if (err) throw err
          })
        })
        .catch((erro) => {
          console.error("Error when sending: ",
            erro);
          lintod.reply("Error");
        })
      } else {
        lintod.reply("Uploading to anonfiles because file size to large for Telegram");
        const options = {
          method: "POST",
          url: "https://api.anonfiles.com/upload",
          formData: {
            file: fs.createReadStream(`nhentai/${title}.pdf`),
          },
        }

        request(options, function (err, res, body) {
          if (err) console.log(err);
          fs.unlink(`nhentai/${title}.pdf`, (err) => {
            if (err) throw err
          })
          lintod.reply("Link download to file : " + JSON.parse(body).data.file.url.full);
        })
      }
    } catch (error) {
      lintod.reply(String(error));
      console.log("No Dōjinshi found");
      console.log(error);
    }
  } else if (body && !body.match(/^[0-9]/)) {
  	simih = await axios.get("https://zenzapi.xyz/api/simih?text=" + encodeURI(body) + "&apikey=Nyarlathotep")
  await lintod.reply(simih.data.result.message);
  }
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
