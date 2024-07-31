const { Converter } = new (require('@moonr/func'))
const fs = require('fs')
const { exec } = require('child_process')
module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let exif = global.db.data.setting
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await conn.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) return conn.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image/.test(type)) {
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) return conn.reply(m.chat, global.status.wrong, m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) return conn.reply(m.chat, Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`), m)
               let img = await q.download()
               if (!img) return conn.reply(m.chat, global.status.wrong, m)
               return await conn.sendSticker(m.chat, img, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else conn.reply(m.chat, Func.texted('bold', `Stress ??`), m)
         }
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['sticker'],
   use: 'query / reply media',
   tags: ['converter'],
   command: /^(s|sk|stiker|sgif)$/i,
   limit: true
}