let fs = require('fs')
let fetch = require('node-fetch')
let handler = m => m

handler.all = async function (m, { isBlocked }) {

    if (isBlocked) return
    if (m.isBaileys) return
    if (m.chat.endsWith('broadcast')) return
    let setting = db.data.settings[this.user.jid]
    let { isBanned } = db.data.chats[m.chat]
    let { banned } = db.data.users[m.sender]

    // ketika ditag
    try {
        if (m.mentionedJid.includes(this.user.jid) && m.isGroup) {
            await this.send2Button(m.chat,
                isBanned ? `${namabot} tidak aktif` : banned ? 'kamu dibanned' : `Haori di sini, Btw ngapain manggil kangen ya bg?`,
                footer,
                isBanned ? 'Unban' : banned ? '๐ Owner' : '๐งพ Menu',
                isBanned ? '.unban' : banned ? '.owner' : '.?',
                m.isGroup ? '๐ญ Ban' : isBanned ? '๐พ Unban' : '๐ Donasi',
                m.isGroup ? '.ban' : isBanned ? '.unban' : '.donasi', m)
        }
    } catch (e) {
        return
    }

    // ketika ada yang invite/kirim link grup di chat pribadi
    if ((m.mtype === 'groupInviteMessage' || m.text.startsWith('https://chat') || m.text.startsWith('Buka tautan ini')) && !m.isBaileys && !m.isGroup && !m.fromMe && !m.isOwner) {
        this.send2ButtonLoc(m.chat, await (await fetch(fla + 'sewa bot')).buffer(), `โ โใ Beli Bot ใ โ
โ โฅ *1 Bulan* :      *Rp 10000*
โ โฅ *Permanen* : *Rp 15000*
โ โฅ *Premium* :   *Rp 15000*
โ โฅ *Sc Bot* :        *Masih Beta*
โ
โ โใ PEMBAYARAN ใ โ
โ โฅ Gopay, Dana, Dan Pulsa
โ
โ โ Tertarik Untuk Beli Bot Ini?
โ โฅKetuk Tombol Di Bawah Ya
โ
โ โ ยฉ2021 Rpg wabot-aq
โ โ Scrip original by Nurutomo
โ โใ ${namabot} ใ โ`.trim(), footer, 'Dana', '#viadana', 'GoPay', '#viagopay', m)
}

    // salam
    let reg = /(ass?alam|ุงููุณูููุงููู ุนููููููููู|ุงูุณูุงู ุนููฺฉู)/i
    let isSalam = reg.exec(m.text)
    if (isSalam && !m.fromMe) {
        m.reply(`ููุนููููููููู ุงูุณูููุงููู ููุฑูุญูููุฉู ุงูููู ููุจูุฑูููุงุชููู\n_wa\'alaikumussalam wr.wb._`)
    }

    // backup db
    if (setting.backup) {
        if (new Date() * 1 - setting.backupDB > 1000 * 60 * 60) {
            let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            await global.db.write()
            this.reply(global.owner[0] + '@s.whatsapp.net', `Database: ${date}`, null)
            this.sendFile(global.owner[0] + '@s.whatsapp.net', fs.readFileSync('./database.json'), 'database.json', '', 0, 0, { mimetype: 'application/json' })
            setting.backupDB = new Date() * 1
        }
    }

    // update status
    if (new Date() * 1 - setting.status > 1000) {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        await this.setStatus(`Im Haoribotz ๐พ || โฐ Aktif Selama ${uptime} ||๐ก Mode: ${global.opts['self'] ? 'Private' : setting.groupOnly ? 'Hanya Grup' : 'Publik'} || ๐จ Create By Zivfurr`).catch(_ => _)
        setting.status = new Date() * 1
    }

}

module.exports = handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
