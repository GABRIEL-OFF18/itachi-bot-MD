import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, '🍬 Por favor, ingresa un término de búsqueda.', m);
  }

  try {
    await m.react('⏳');
    conn.reply(m.chat, '🍭 Descargando su imagen, espere un momento...', m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: 'Búsqueda de Imagen',
          body: text,
          previewType: 0,
          thumbnail: 'https:                                                  
          sourceUrl: 'https://example.com' // Reemplaza con tu enlace
        }
      }
    });

    const res = await googleImage(text);
    const images = await Promise.all([
      res.getRandom(),
      res.getRandom(),
      res.getRandom(),
      res.getRandom()
    ]);

    const messages = images.map((image, index) => [
      `Imagen ${index + 1}`,
      text,
      image,
      [],
      [],
      [],
      []
    ]);

    await conn.sendCarousel(m.chat, `🍬 Resultado de ${text}`, '✰ Imagen - Búsqueda ✰', null, messages, m);
  } catch (e) {
    conn.reply(m.chat, `❌ Error: ${e.message}`, m);
  }
};

handler.help = ['imagen'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = ['image', 'imagen'];
handler.register = true;

export default handler;
