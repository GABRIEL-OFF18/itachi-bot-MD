import fs from 'fs'
import { WAMessageStubType} from '@whiskeysockets/baileys'

const newsletterJid = '120363420590235387@newsletter';
const newsletterName = '🎄 ISAGI-BOT-MD| ᴄʜᴀɴɴᴇʟ-ʙᴏᴛ ⛄';
const packname = 'isagi-BOT-MD'

const iconos = [
  'https://files.catbox.moe/sc04sk.jpg',
  'https://files.catbox.moe/0nktp8.jpg',
  'https://files.catbox.moe/2v4dhc.jpg',
  'https://files.catbox.moe/9qtuux.jpeg',
];

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

async function generarBienvenida({ conn, userId, groupMetadata, chat}) {
  const username = `@${userId.split('@')[0]}`;
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://files.catbox.moe/6orur7.jpg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric'});
  const groupSize = groupMetadata.participants.length + 1;
  const desc = groupMetadata.desc?.toString() || 'Sin descripción';

  let caption;
  if (chat.welcomeText) {
    caption = chat.welcomeText
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject)
      .replace(/@desc/g, desc);
  } else {
    const defaultWelcomeMessage = `╭─「 🎄👻 ISAGI YOICHI: BIENVENIDA 」─╮

@user ha sido convocado por las sombras festivas de navidad...
Bienvenid@ ala cancha secreto de *@subject*.

❄️ Tu llegada no es casual. no cualquiera es convocado por isagi Yoichi ☠️.

╰─「 ✨ 𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 」─╯
🧿 Miembros: ${groupSize}
📅 Fecha: ${fecha}
📜 Descripción:
${desc}`;

    caption = defaultWelcomeMessage
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  }
  return { pp, caption, mentions: [userId]};
}

async function generarDespedida({ conn, userId, groupMetadata, chat}) {
  const username = `@${userId.split('@')[0]}`;
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://files.catbox.moe/slhdnp.jpg');
  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Santo_Domingo", day: 'numeric', month: 'long', year: 'numeric'});
  const groupSize = groupMetadata.participants.length - 1;

  let caption;
  if (chat.byeText) {
    caption = chat.byeText
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  } else {
    const defaultByeMessage = `╭─「 🌌🎄 ISAGI YOICHI: *ADIOS* 」─╮

@user *ha abandonado este Grupo maravilloso isagi Yoichi te esperara*🪷.

Grupo: *@subject*

❄️ Que su memoria permanezca en silencio.
🌌 Las leyendas no olvidan, pero tampoco lloran.

╰─「 ✨ 𝐄𝐒𝐓𝐀𝐃𝐎 𝐀𝐂𝐓𝐔𝐀𝐋 」─╯
📉 Miembros: ${groupSize}
📅 Fecha: ${fecha}`;

    caption = defaultByeMessage
      .replace(/@user/g, username)
      .replace(/@subject/g, groupMetadata.subject);
  }
  return { pp, caption, mentions: [userId]};
}

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const chat = global.db.data.chats[m.chat];
  if (!chat) return !0;

  const primaryBot = chat.botPrimario;
  if (primaryBot && conn.user.jid !== primaryBot) return !0;

  const userId = m.messageStubParameters[0];

  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { pp, caption, mentions} = await generarBienvenida({ conn, userId, groupMetadata, chat});
    const contextInfo = {
      mentionedJid: mentions,
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: '🎄🌌 Isagi Yoichi 𝐭𝐞 𝐝𝐚 𝐥𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚...',
        thumbnailUrl: getRandomIcono(),
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };
    await conn.sendMessage(m.chat, { image: { url: pp}, caption, contextInfo}, { quoted: null});
  }

  if (chat.welcome && (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
    const { pp, caption, mentions} = await generarDespedida({ conn, userId, groupMetadata, chat});
    const contextInfo = {
      mentionedJid: mentions,
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: '🎄🌌 𝐋𝐚𝐬 canchas 𝐬𝐞 𝐜𝐢𝐞𝐫𝐫𝐚𝐧 𝐬𝐢𝐧 𝐫𝐞𝐦𝐨𝐫𝐬𝐨...',
        thumbnailUrl: getRandomIcono(),
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };
    await conn.sendMessage(m.chat, { image: { url: pp}, caption, contextInfo}, { quoted: null});
  }
};

export { generarBienvenida, generarDespedida};
export default handler;
