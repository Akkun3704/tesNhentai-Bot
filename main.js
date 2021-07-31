const axios = require("axios");
const nhentai = require("nhentai");
const request = require("request");
const topdf = require("image-to-pdf");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const speed = require("performance-now");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const { Telegraf } = require("telegraf");

const bot = new Telegraf("1929357866:AAHIp1ukgjz50AFhCzXedn17JzZMModXsus"); // get token in BotFather Telegram

// Please don't delete the credit :)

function sendStart(ctx) {
  bot.telegram.sendMessage(ctx.chat.id, "NHENTAI BOT\n\nJust send me nhentai code and i send you nhentai pdf :)\nalso i have some download features",
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

function sendMenu(ctx){
	let name = ctx.message.from.username
	let ucapWaktu = moment.tz("Asia/Jakarta").format("a")
	let tanggal = moment.tz("Asia/Jakarta").format("LLLL")
	let menu = `Selamat ${ucapWaktu} ${name}\n`
	menu += `${tanggal}\n\n`
	menu += `Menu Bot\n`
	menu += `• /ytmp4\n`
	menu += `• /ytmp3\n`
	menu += `• /play\n\n`
	menu += `Made with ❤️ by @akkun0307`
	bot.telegram.sendMessage(ctx.chat.id, menu)
}

function sendMessageping(ctx){
	function format(seconds){
		function pad(s){
			return (s < 10 ? `0` : ``) + s;
		}
	var hours = Math.floor(seconds / (60*60));
	var minutes = Math.floor(seconds % (60*60) / 60);
	var seconds = Math.floor(seconds % 60);
	return pad(hours) + ` Jam, ` + pad(minutes) + ` Menit, ` + pad(seconds) + ` Detik`;
	}
	var uptime = process.uptime();
	let timestamp = speed();
	let latensi = speed() - timestamp
	let tutid = moment().millisecond()
	var tmenu = `─────｢ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐈𝐧𝐟𝐨 ｣─────\n\n`
	tmenu += `➪ Host: ${os.hostname()}\n`
	tmenu += `➪ Platfrom: ${os.platform()}\n`
	tmenu += `➪ CPU: ${os.cpus()[0].model}\n`
	tmenu += `➪ Speed: ${os.cpus()[0].speed} MHz\n`
	tmenu += `➪ Core: ${os.cpus().length}\n`
	tmenu += `➪ RAM Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(require(`os`).totalmem / 1024 / 1024)} MB\n\n`
	tmenu += `❒ Ping: ${tutid} MS\n`
	tmenu += `❒ Runtime: ${format(uptime)}\n`
	tmenu += `❒ Speed: ${latensi.toFixed(4)} Second`
	bot.telegram.sendMessage(ctx.chat.id, tmenu)
}

async function getArgs(ctx) {
	try {
		args = ctx.message.text
		args = args.split(" ")
		args.shift()
		return args
	} catch { return [] }
}

bot.start((ctx) => {
	sendStart(ctx)
})

bot.command(/^(help|menu)$/i, async ctx => {
	sendMenu(ctx)
})

bot.command(/^(p|ping)$/i, async ctx => {
	sendMessageping(ctx)
})

bot.command("ytmp3", async (ctx) => {
	try{
	let args = await getArgs(ctx)
	if(args.length < 1){
		ctx.reply("Please enter a link, an example /ytmp3 https://www.youtube.com/watch?v=U5TkJ2HhMEw&list=RDen9KJdbrZj0&index=27")
	}else{
		ctx.reply("Wait, the bot is being searched")
		res = await axios.get("https://api.zeks.xyz/api/ytmp3/2?apikey=Nyarlathotep&url=" + args[0])
		data = res.data.result
	if(!data){
		ctx.reply("Music not found")
	}else{
		capt = `「 YOUTUBE MP3 」\n\n`
		capt += `Title: ${data.title}\n`
		capt += `Size: ${data.size}\n`
		capt += `Link: ${data.link}`
		ctx.replyWithPhoto({ url: data.thumb }, { caption: capt, parse_mode: "Markdown" })
		if (Number(data.size.split(` MB`)[0]) >= 25.00) return ctx.reply("Sorry the bot cannot send more than 25 MB!")
		ctx.reply("Wait, audio is being sent")
		ctx.replyWithAudio({ url: data.link, filename: data.title }, { thumb: data.thumb })
		}
	}
	} catch(e) {
		ctx.reply(String(e))
	}
})

bot.command("ytmp4", async (ctx) => {
	try{
	let args = await getArgs(ctx)
	if(args.length < 1){
		ctx.reply("Please enter a link, an example /ytmp4 https://www.youtube.com/watch?v=U5TkJ2HhMEw&list=RDen9KJdbrZj0&index=27")
	}else{
		ctx.reply("Wait, the bot is being searched")
		res = await axios.get("https://api.zeks.xyz/api/ytmp4/2?apikey=Nyarlathotep&url=" + args[0])
		data = res.data.result
	if(!data){
		ctx.reply("Video not found")
	}else{
		capt = `「 YOUTUBE MP4 」\n\n`
		capt += `Title: ${data.title}\n`
		capt += `Size: ${data.size}\n`
		capt += `Link: ${data.link}`
		ctx.replyWithPhoto({ url: data.thumb }, { caption: capt, parse_mode: "Markdown" })
		if (Number(data.size.split(` MB`)[0]) >= 25.00) return ctx.reply("Sorry the bot cannot send more than 25 MB!")
		ctx.reply("Wait, video is being sent")
		ctx.replyWithVideo({ url: data.link })
		}
	}
	} catch(e) {
		ctx.reply(String(e))
	}
})

bot.command("play", async (ctx) => {
	try{
	let args = await getArgs(ctx)
	if(args.length < 1){
		ctx.reply("Please enter a query, an example /play faded")
	}else{
		ctx.reply("Wait, the bot is being searched")
		res = await axios.get("https://fzn-guys.herokuapp.com/api/ytplay2?apikey=gege&judul=" + args.join(" "))
		data = res.data
	if(!data){
		ctx.reply("Music not found")
	}else{
		capt = `「 YOUTUBE PLAY 」\n\n`
		capt += `Title: ${data.title}\n`
		capt += `Size: ${data.size}\n`
		capt += `Duration: ${data.duration}\n`
		capt += `Link: ${data.result}`
		ctx.replyWithPhoto({ url: data.image }, { caption: capt, parse_mode: "Markdown" })
		if (Number(data.size.split(` MB`)[0]) >= 25.00) return ctx.reply("Sorry the bot cannot send more than 25 MB!")
		ctx.reply("Wait, audio is being sent")
		ctx.replyWithAudio({ url: data.result, filename: data.title }, { thumb: data.image })
		}
	}
	} catch(e) {
		ctx.reply(String(e))
	}
})

bot.command("exec", async (ctx) => {
	let args = await getArgs(ctx)
    let query = args.join(" ")
    let cp = require('child_process')
	let exec = require('util').promisify(cp.exec).bind(cp)
		let o
	try {
		o = await exec(query)
	} catch (e) {
		o = e
	} finally {
		let { stdout, stderr } = o
		if (stdout) ctx.reply(stdout)
		if (stderr) ctx.reply(stderr)
	}
})

bot.command("eval", async (msg) => {
	let args = await getArgs(msg)
	let query = args.join(" ")
	try{
		msg.reply(require('util').format(eval(`;(async () => { ${query} })()`)))
	} catch (e) {
		msg.reply(require('util').format(e))
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
      caption += `Parodies: ${data.info.parodies}\n\n`
      //caption += `Character: ${data.info.characters.join(", ")}\n\n`
      caption += `Tags: ${data.info.tags.join(", ")}\n\n`
      caption += `Artists: ${data.info.artists}\n\n`
      caption += `Groups: ${data.info.groups}\n\n`
      caption += `Languages: ${data.info.languages}\n\n`
      caption += `Categories: ${data.info.categories}\n\n`
      caption += `Pages: ${data.info.pages}\n\n`
      caption += `Uploaded: ${data.info.uploaded}\n`
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
          lintod.reply(String(erro));
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
          lintod.reply("Link download to file: " + JSON.parse(body).data.file.url.full);
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