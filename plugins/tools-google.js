module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'Cow'))
      m.react('🕐')
      try {
         if (command == 'google') {
            let json = await Api.get('api/google', {
               q: text
            })
            let teks = `乂  *G O O G L E*\n\n`
            json.data.map((v, i) => {
               teks += `*` + (i + 1) + `.* ` + v.title + `\n`;
               teks += `  ∘  *Snippet* : ` + v.snippet + `\n`;
               teks += `  ∘  *Link* : ` + v.url + `\n\n`;
            })
            m.reply(teks)
         }
         if (command == 'gimage') {
            let json = await Api.get('api/googleimage', {
               q: text
            })
            for (let i = 0; i < 5; i++) {
               let random = Math.floor(json.data.length * Math.random())
               let caption = `乂  *G O O G L E - I M A G E*\n\n`
               caption += `  ◦  *Title* : ${json.data[random].origin.title}\n`
               caption += `  ◦  *Dimensions* : ${json.data[random].width} × ${json.data[random].height}\n\n`
               caption += global.footer
               conn.sendFile(m.chat, json.data[random].url, 'google.jpg', caption, m)
               await Func.delay(2500)
            }
         }
      } catch (e) {
         console.log(e)
      }
   },
   help: ['google', 'gimage'],
   use: 'query',
   tags: ['tools'],
   command: /^(google|gimage)$/i,
   limit: true,
}