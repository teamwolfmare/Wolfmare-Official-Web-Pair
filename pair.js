const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
const { upload } = require("./mega");

function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
  let num = req.query.number;
  async function WolfmarePair() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    try {
      let WolfmarePairWeb = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" })
          ),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: Browsers.macOS("Safari"),
      });

      if (!WolfmarePairWeb.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, "");
        const code = await WolfmarePairWeb.requestPairingCode(num);
        if (!res.headersSent) {
          await res.send({ code });
        }
      }

      WolfmarePairWeb.ev.on("creds.update", saveCreds);
      WolfmarePairWeb.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          try {
            await delay(10000);
            const sessionPrabath = fs.readFileSync("./session/creds.json");

            const auth_path = "./session/";
            const user_jid = jidNormalizedUser(WolfmarePairWeb.user.id);

            function randomMegaId(length = 6, numberLength = 4) {
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              for (let i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * characters.length)
                );
              }
              const number = Math.floor(
                Math.random() * Math.pow(10, numberLength)
              );
              return `${result}${number}`;
            }

            const mega_url = await upload(
              fs.createReadStream(auth_path + "creds.json"),
              `${randomMegaId()}.json`
            );

            const string_session = mega_url.replace(
              "https://mega.nz/file/",
              ""
            );

            const sid = `◆━━❲ Princess Olya 💙✨ ❳━━◆\n\nWolfmare හි දත්ත පද්ධතිය තුළ ලියාපදිංචි කොට ඔබගේ session හැඳුනුම් අංකය සාර්ථකව නිකුත් කරන ලදී...✅\n\n\n╭─「 Princess Olya 💙✨ 」─❂\n┊◆╭─❴ පද්ධතිය ❵─❂\n┊◆┊📂ගබඩාව : meganz\n┊◆┊🖇️පරීක්ෂාව : teamwolfmare\n┊◆╰───────────❂\n┊◆╭─❴ විස්තර ❵─❂\n┊◆┊👑 නම : Princess Olya\n┊◆┊🌐 කාණ්ඩය : 1.0.1\n┊◆┊🛠️ නිර්මාණය : Team Wolf Mare\n┊◆╰───────────❂\n┊◆╭─❴ යාවත්කාලීනය ❵─❂\n┊◆┊📅 අවසන් යාවත්කාලීනය :\n┊◆┊ 2025 පෙබරවාරි 17\n┊◆╰───────────❂ \n┊◆╭─❴ උඩුගත තොරතුරු ❵─❂\n┊◆┊📚 ගබඩාව : Baileys\n┊◆┊🎨 පිටපත : Wolf Mare\n┊◆┊📡 ධාවනය : Github\n┊◆╰───────────❂\n╰──────────────❂\n\nඔබගේ session හැඳුනුම් අංකය නම්,\n> ${string_session} \nවේ.\n\n\nඔබට පද්ධතිය ස්ථාපනය කිරීමෙන් අනතුරුව සම්පූර්ණ විධාන ලැයිස්තුව ලබා ගැනීමට .menu ලෙස පද්ධතිය ස්ථාපනය කළ whatsapp අංකයට යොමු කරන්න.\n\n\n\n╭─「 තවත් විධාන💙✨」─❂\n┊■╭───────────❂\n┊■┊ .Menu\n┊■┊ .alive\n┊■┊ .ping\n┊■╰──────────❂\n╰──────────────❂\n\n\n\nPrincess Olya භාවිතා කළ ඔබට\nwolfmare අපේ ස්තූතිය.\n\n> ©️All right's reserved 2025 By Team Wolfmare.`;
            const mg = `☝️ *මෙලෙස ඉහළින් දැක්වෙන්නේ ඔබගේ session හැඳුනුම් අංකයයි.*\n\n🚫 *Do not share your session id to anyone*\n🚫 *මෙම session හැඳුනුම් අංකය භාහිර අයෙකු සමඟ හුවමාරු කරගැනීමෙන් වළකින්න.*\n\n⚒️ *නවතම යාවත්කාලීන සඳහා wolfmare සමඟ සම්භන්ධ වී සිටින්න*\n\n📍 *නිර්මාණය*\n\n╭─「 *Wolfmare*」─❂\n┊📍╭───────────❂\n┊📍┊ *Hansaka Franando*\n┊📍┊ *Malindu Heshan*\n┊📍┊ *Hasindu Lalanka*\n┊📍╰──────────❂\n╰──────────────❂ \n\n⛔ *වැදගත් දැන්වීම.*\n\n* *නව යාවත්කාලීන සඳහා ඔබ අපගේ wolfmare කණ්ඩායමේ සහය සමූහය හා සම්භන්ධ වීම අනිවාර්යය වේ.*\n* *එම සමූහයට පහත සබැඳිය ඔස්සේ සම්භන්ධ විය හැක.*\n* https://chat.whatsapp.com/BagwKoTMIffFpa8KjpCmEn\n\n❌ *ඔබ මෙම සමූහය හා සම්භන්ධ නොවුණහොත් පද්ධතිය ස්ථාපනය කිරීමෙන් අනතුරුව ස්වයංක්‍රීයවම එම සමූහයට ඇතුළත් වනු ඇත.*\n\n\n> All rights reserved by 2025 wolfmare`;
            const dt = await WolfmarePairWeb.sendMessage(user_jid, {
              image: {
                url: "https://raw.githubusercontent.com/Princessolya/Princess-Olya-Media-Files/refs/heads/main/Session%20success.jpg",
              },
              caption: sid,
            });
            const msg = await WolfmarePairWeb.sendMessage(user_jid, {
              text: string_session,
            });
            const msg1 = await WolfmarePairWeb.sendMessage(user_jid, { text: mg });
          } catch (e) {
            exec("pm2 restart Wolfmare");
          }

          await delay(100);
          return await removeFile("./session");
          process.exit(0);
        } else if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode !== 401
        ) {
          await delay(10000);
          WolfmarePair();
        }
      });
    } catch (err) {
      exec("pm2 restart Wolfmare-md");
      console.log("service restarted");
      WolfmarePair();
      await removeFile("./session");
      if (!res.headersSent) {
        await res.send({ code: "Service Unavailable" });
      }
    }
  }
  return await WolfmarePair();
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  exec("pm2 restart Wolfmare");
});

module.exports = router;
