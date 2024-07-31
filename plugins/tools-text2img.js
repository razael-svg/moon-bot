module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'cat'), m)
         m.react('🕒')
         let [prompt, negative_prompt, model, ratio] = text.split` | `
         var json = await Api.post('api/text2img', {
            prompt, negative_prompt, model, ratio
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         return conn.sendFile(m.chat, json.data.images[0].url, '', json.data.negative_prompt, m)
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['text2img'],
   use: 'prompt | negative | model | ratio',
   tags: ['tools'],
   command: /^(text2img)$/i,
   premium: true,
}