const handler = async (m, { conn, text, usedPrefix }) => {
  const juegos = ['ruleta', 'blackjack', 'tragamonedas']
  if (!text) {
    return conn.reply(m.chat, `*🎲 ¡Bienvenido al casino! 🎲*\n\nUsa ${usedPrefix}casino <juego> para jugar.\n\nJuegos disponibles: ${juegos.join(', ')}`, m)
  }

  const juego = text.toLowerCase()
  if (!juegos.includes(juego)) {
    return conn.reply(m.chat, `*😔 Juego no disponible*`, m)
  }

  if (juego === 'ruleta') {
    const resultado = Math.floor(Math.random() * 37)
    return conn.reply(m.chat, `*🎰 Ruleta: ${resultado}*`, m)
  } else if (juego === 'blackjack') {
    const cartas = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const carta1 = cartas[Math.floor(Math.random() * cartas.length)]
    const carta2 = cartas[Math.floor(Math.random() * cartas.length)]
    return conn.reply(m.chat, `*🃏 Blackjack: ${carta1} y ${carta2}*`, m)
  } else if (juego === 'tragamonedas') {
    const resultados = ['🍎', '🍊', '🍇', '💰']
    const resultado1 = resultados[Math.floor(Math.random() * resultados.length)]
    const resultado2 = resultados[Math.floor(Math.random() * resultados.length)]
    const resultado3 = resultados[Math.floor(Math.random() * resultados.length)]
    return conn.reply(m.chat, `*🎰 Tragamonedas: ${resultado1} | ${resultado2} | ${resultado3}*`, m)
  }
}

handler.help = ['casino <juego>']
handler.tags = ['casino', 'juegos', 'diversión']
handler.command = ['casino', '