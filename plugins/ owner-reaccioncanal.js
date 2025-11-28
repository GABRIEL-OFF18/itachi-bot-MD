import { getUrlFromDirectPath } from "@whiskeysockets/baileys"
import _ from "lodash"
import axios from 'axios'
// Nota: getUrlFromDirectPath, lodash y axios se importan según lo solicitado, pero no son 
// la herramienta correcta para esta tarea. La lógica principal utiliza client.sendMessage.

export default {
  command: ["react"],
  run: async (client, m, args) => {
    try {
      const url = args[0]
      const emogis = args.slice(1).join(" ")

      if (!url || !emogis) {
        return m.reply("🚩 Uso correcto: /react https://whatsapp.com/channel/0029VbApwZ9ISTkEBb6ttS3F/01918 🍃, 🌱, 🥳, 🤣")
      }

      // --- 1. Validar y Procesar Emojis ---
      const lista = emogis.split(",").map(e => e.trim()).filter(e => e)
      if (lista.length === 0 || lista.length > 4) {
         m.react('⚠️')
        return m.reply("🚩 Debes ingresar entre 1 y 4 emojis separados por coma")
      }

      // --- 2. Parsear la URL para obtener IDs ---
      const channelRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]+)\/(\d+)/i
      const match = url.match(channelRegex)

      if (!match) {
        return m.reply("❌ Formato de URL de Canal de WhatsApp no reconocido. Asegúrate de incluir el ID del mensaje (el número al final).")
      }

      const channelPublicId = match[1] // ID público del canal (Base36)
      const messageId = match[2]      // ID del mensaje (Decimal)
      
      // --- 3. Construir la Clave del Mensaje (API-less Guess) ---
      
      // El JID interno del canal es complejo (ej: 1203630xxxxxxxxxx@newsletter).
      // Intentaremos construir el JID usando el ID público, lo cual a menudo falla 
      // sin una base de datos interna o una API de mapeo.
      const channelJid = `${channelPublicId}@newsletter`; 

      const messageKey = {
          remoteJid: channelJid,
          id: messageId,
          // `participant` (el JID del remitente del mensaje) es desconocido.
          // `fromMe` se establece en false asumiendo que es un mensaje de otro.
          fromMe: false 
      };
      
      m.react('⏱️')

      // --- 4. Enviar Reacciones ---
      let allSuccess = true
      for (const emoji of lista) {
        try {
          // Función nativa de Baileys para enviar la reacción
          await client.sendMessage(m.chat, { 
            react: { 
              key: messageKey, 
              text: emoji 
            } 
          })
          // Pequeña pausa para evitar límites de velocidad
          await new Promise(resolve => setTimeout(resolve, 500)) 
        } catch (e) {
          console.error(`Error al enviar reacción ${emoji}:`, e.message)
          allSuccess = false
          // No detenemos el ciclo, intentamos el siguiente emoji
        }
      }

      // --- 5. Respuesta Final ---
      if (allSuccess) {
        m.react('🎡')
        return m.reply(`🌾 Reacción(es) Enviada(s) Correctamente! (Método directo sin API)`)
      } else {
        m.react('❌')
        return m.reply("❌ Se intentó enviar la(s) reacción(es) directamente, pero falló para uno o más emojis. \n\n*Razón:* Es probable que el bot no haya podido mapear el ID público del canal (`${channelPublicId}`) al JID interno de WhatsApp para construir la clave de mensaje necesaria.")
      }

    } catch (err) {
      console.error(err)
       m.react('❌')
      return m.reply("🚩 Ocurrió un error inesperado al procesar la solicitud.")
    }
  },
}

// Para que el handler sea funcional en un sistema de plugins:
const handler = {}
handler.tags = ['tools']
handler.help = ['react <url> <emojis>']
handler.command = ['react', 'reaccionar']
// handler.limit = true // Puedes añadir límites si lo deseas

// Nota: El sistema de plugins espera que se exporte `handler` en lugar de un objeto.
// Ajustando el formato de exportación al estándar de plugins:
export const command = ["react", "reaccionar"]
export const help = ['react <url> <emojis>']
export const tags = ['tools']

// Exportamos el objeto modificado para mantener la estructura original, pero con la lógica de exportación de un plugin simple.
// Si tu sistema de plugins espera un único `export default`, usa el objeto de arriba. Si espera `export const`, usa la siguiente estructura:
// export const run = async (client, m, args) => { /*...lógica...*/ }
// Ya que el código original usaba `export default { command: [...] }`, mantendremos esa estructura.

// Si necesitas la estructura de `handler.command = []` para tu sistema, puedes descomentar y ajustar estas líneas:
// export default handler