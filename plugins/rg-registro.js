let handler = async (m, { conn, text, usedPrefix, command}) => {
    let user = global.db.data.users[m.sender];

    if (command === 'reg' || command === 'registrar' || command === 'register') {
        if (user.registered === true) throw `Ya estás registrado, ¿quieres anular tu registro?\nUsa: ${usedPrefix}unreg`;

        if (!text) throw `*Falta tu nombre y edad.*\nUsa: ${usedPrefix + command} Nombre.Edad\n*Ejemplo:* ${usedPrefix + command} Isagi.22`;

        let parts = text.split('.');
        if (parts.length < 2) throw `*Formato incorrecto.*\nDebe ser: ${usedPrefix + command} Nombre.Edad\n*Ejemplo:* ${usedPrefix + command} Isagi.22`;

        let name = parts[0].trim();
        let age = parseInt(parts[1].trim());

        if (!name || name.length < 3) throw 'El nombre debe tener al menos 3 caracteres.';
        if (isNaN(age) || age < 10 || age> 99) throw 'La edad debe ser un número entre 10 y 99 años.';

        user.name = name;
        user.age = age;
        user.regTime = Date.now();
        user.registered = true;

        let successMessage = `
✅ *¡REGISTRO COMPLETADO!*

*Usuario:* ${name}
*Edad:* ${age} años
`.trim();

        await conn.sendMessage(m.chat, {
            text: successMessage,
            footer: 'Selecciona una opción abajo',
            buttons: [
                { buttonId: `${usedPrefix}reg Isagi.17`, buttonText: { displayText: 'Registrarse'}, type: 1},
                { buttonId: `${usedPrefix}unreg`, buttonText: { displayText: 'Eliminar Registro'}, type: 1}
            ],
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: 'Isagi registro',
                    body: `¡Bienvenido, ${name}!`,
                    thumbnailUrl: 'https://files.catbox.moe/6orur7.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
},
                mentionedJid: [m.sender]
}
}, { quoted: m});

} else if (command === 'unreg' || command === 'anular') {
        if (!user.registered) throw `❌ No estás registrado.\nUsa: ${usedPrefix}reg Nombre.Edad`;

        user.name = '';
        user.age = 0;
        user.regTime = 0;
        user.registered = false;

        await conn.sendMessage(m.chat, {
            text: `✅ *Registro anulado correctamente.`,
            contextInfo: {
                externalAdReply: {
                    title: 'Registro eliminado',
                    body: 'Tu perfil ha sido borrado del sistema',
                    thumbnailUrl: 'https://files.catbox.moe/6orur7.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
},
                mentionedJid: [m.sender]
}
}, { quoted: m});
}
};

handler.help = ['reg <nombre.edad>', 'unreg'];
handler.tags = ['xp'];
handler.command = ['reg', 'registrar', 'register', 'unreg'];

export default handler;
