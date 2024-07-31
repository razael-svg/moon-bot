module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               m.react('🕒')
               let img = await conn.downloadMediaMessage(q)
               let image = await Scraper.uploader(img)
               const json = await Api.get('api/ocr', {
                  image: image.data.url
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               conn.reply(m.chat, json.data.text, m)
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            m.react('🕒')
            let img = await q.download()
            let image = await Scraper.uploader(img)
            const json = await Api.get('api/ocr', {
               image: image.data.url
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.reply(m.chat, json.data.text, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['ocr'],
   use: 'reply photo',
   tags: ['tools'],
   command: /^(ocr)$/i,
   limit: true,
}