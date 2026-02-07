let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, 'Por favor, ingresa tu fecha de cumpleaños (DD/MM/AAAA)', { quoted: m })
  let fecha = text.split('/')
  if (fecha.length !== 3) return conn.sendMessage(m.chat, 'Formato incorrecto. Por favor, usa DD/MM/AAAA', { quoted: m })
  let dia = parseInt(fecha[0])
  let mes = parseInt(fecha[1])
  let anio = parseInt(fecha[2])
  if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return conn.sendMessage(m.chat, 'Formato incorrecto. Por favor, usa DD/MM/AAAA', { quoted: m })
  let fechaCumple = new Date(anio, mes - 1, dia)
  if (fechaCumple.toString() === 'Invalid Date') return conn.sendMessage(m.chat, 'Fecha inválida', { quoted: m })
  conn.sendMessage(m.chat, `Tu fecha de cumpleaños es: ${dia}/${mes}/${anio}`, { quoted: m })
}

handler.help = ['cumple']
handler.tags = ['info']
handler.command = ['cumple']

export default handler