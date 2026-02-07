let handler = async (m, { conn, usedPrefix, command, text }) => {
  let juegos = ['ruleta', 'blackjack', 'tragamonedas']
  if (!text) {
    m.reply(`*🎲 ¡Bienvenido al casino! 🎲*\n\nUsa ${usedPrefix}casino <juego> para jugar.\n\nJuegos disponibles: ${juegos.join(', ')}`)
    return
  }

  let juego = text.toLowerCase()
  if (!juegos.includes(juego)) {
    m.reply(`*😔 Juego no disponible*`)
    return
  }

  if (juego === 'ruleta') {
    let resultado = Math.floor(Math.random() * 37)
    m.reply(`*🎰 Ruleta: ${resultado}*`)
  } else if (juego === 'blackjack') {
    let cartas = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    let carta1 = cartas[Math.floor(Math.random() * cartas.length)]
    let carta2 = cartas[Math.floor(Math.random() * cartas.length)]
    m.reply(`*🃏 Blackjack: ${carta1} y ${carta2}*`)
  } else if (juego === 'tragamonedas') {
    let resultados = ['🍎', '🍊', '🍇', '💰']
    let resultado1 = resultados[Math.floor(Math.random() * resultados.length)]
    let resultado2 = resultados[Math.floor(Math.random() * resultados.length)]
    let resultado3 = resultados[Math.floor(Math.random() * resultados.length)]
    m.reply(`*🎰 Tragamonedas: ${resultado1} | ${resultado2} | ${resultado3}*`)
  }
}

handler.help = ['casino <juego>']
handler.tags = ['casino', 'juegos', 'diversión']
handler.command = ['casino']

export default handler