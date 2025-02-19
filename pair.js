const express = require('express');
const fs = require('fs-extra');
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const MESSAGE = process.env.MESSAGE || `
 ◆━━❲ *Princess Olya Menu 💙✨* ❳━━◆

👋
Hello  ,


╭─「 *Princess Olya 💙✨* 」─❂
┊◆╭─❴ 𝘿𝙚𝙩𝙖𝙞𝙡𝙨 ❵─❂
┊◆┊⬤ User : Privet
┊◆┊⬤ Bot : Princess Olya 💙
┊◆┊⬤ Design: Team Wolf Mare
┊◆╰───────────❂
┊◆╭─❴ 𝙎𝙮𝙨𝙩𝙚𝙢 ❵─❂
┊◆┊🍁 Uptime : Loding..
┊◆┊🍁 Mem : 1.054 MB / 3.54MB 
┊◆╰───────────❂
╰──────────────❂ 

_*ꜱᴇꜱꜱɪᴏɴ ꜱᴜᴄꜱᴇꜱꜱꜰᴜʟʟʏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*_

> ${Scan_Id}
☝️ This is the your Session ID

*REPLY THE COMMAND*

╭─「 *PRINCESS OLYA 💙✨*」─❂
┊■╭───────────❂
┊■┊ *.Menu*
┊■┊ *.alive*
┊■┊ *.ping*
┊■╰──────────❂
╰──────────────❂ 

𝙏𝙃𝘼𝙉𝙆 𝙔𝙊𝙐 𝙁𝙊𝙍,
𝙐𝙎𝙄𝙉𝙂 𝙊𝙇𝙔𝘼 🤍.

*By Team Wolf Mare*

> PRINCESS OLYA Official
> ©️ All Rights Reserved 2k25.
`;

const uploadToPastebin = require('./Paste');  // Assuming you have a function to upload to Pastebin
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require("@whiskeysockets/baileys");

// Ensure the directory is empty when the app starts
if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync(__dirname + '/auth_info_baileys');
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function SUHAIL() {
        const { state, saveCreds } = await useMultiFileAuthState(`./auth_info_baileys`);
        try {
            let Smd = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!Smd.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Smd.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Smd.ev.on('creds.update', saveCreds);
            Smd.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    try {
                        await delay(10000);
                        if (fs.existsSync('./auth_info_baileys/creds.json'));

                        const auth_path = './auth_info_baileys/';
                        let user = Smd.user.id;

                        // Upload the creds.json to Pastebin directly
                        const credsFilePath = auth_path + 'creds.json';
                        const pastebinUrl = await uploadToPastebin(credsFilePath, 'creds.json', 'json', '1');

                        const Scan_Id = pastebinUrl;  // Use the Pastebin URL as the session ID

                        let msgsss = await Smd.sendMessage(user, { text: Scan_Id });
                        await Smd.sendMessage(user, { image: {
                            url: "https://raw.githubusercontent.com/Princessolya/Princess-Olya-Media-Files/refs/heads/main/Session%20success.jpg",
                          },
                          caption: MESSAGE, }, { quoted: msgsss });
                        await delay(1000);
                        try { await fs.emptyDirSync(__dirname + '/auth_info_baileys'); } catch (e) {}

                    } catch (e) {
                        console.log("Error during file upload or message send: ", e);
                    }

                    await delay(100);
                    await fs.emptyDirSync(__dirname + '/auth_info_baileys');
                }

                // Handle connection closures
                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        SUHAIL().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                        await delay(5000);
                        exec('pm2 restart qasim');
                    }
                }
            });

        } catch (err) {
            console.log("Error in Wolfmare function: ", err);
            exec('pm2 restart Wolfmare-pair');
            console.log("Service restarted due to error");
            SUHAIL();
            await fs.emptyDirSync(__dirname + '/auth_info_baileys');
            if (!res.headersSent) {
                await res.send({ code: "Try After Few Minutes" });
            }
        }
    }

   return await SUHAIL();
});

module.exports = router;
