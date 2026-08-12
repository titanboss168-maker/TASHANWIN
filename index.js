const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// =========================================================
// 🔧 SETTINGS
// =========================================================

const token = '8613958348:AAFpu3ircb8T91UU2ZWE82b_BWmAPqGlu2E';

const ADMIN_CHAT_ID = '1966787250';

if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
  console.error('❌ Token daalna zaroori hai.');
  process.exit(1);
}

if (!ADMIN_CHAT_ID || ADMIN_CHAT_ID === 'YOUR_ADMIN_CHAT_ID_HERE') {
  console.error('❌ Admin Chat ID daalna zaroori hai.');
  process.exit(1);
}

// =========================================================
// 🤖 BOT
// =========================================================

const bot = new TelegramBot(token, {
  polling: {
    params: {
      allowed_updates: ['message', 'chat_member']
    }
  }
});

console.log('✅ Bot started. Waiting for channel joins...');

// =========================================================
// ⏳ DELAY
// =========================================================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =========================================================
// 💾 USERS STORAGE
// =========================================================

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return new Set(JSON.parse(data));
    }
  } catch (err) {
    console.error(
      'Users file load karne mein error:',
      err.message
    );
  }

  return new Set();
}

function saveUsers(usersSet) {
  try {
    fs.writeFileSync(
      USERS_FILE,
      JSON.stringify([...usersSet], null, 2)
    );
  } catch (err) {
    console.error(
      'Users file save karne mein error:',
      err.message
    );
  }
}

const knownUsers = loadUsers();

// =========================================================
// 📩 NEW CHANNEL MEMBER
// =========================================================

bot.on('chat_member', async (update) => {

  const oldStatus = update.old_chat_member.status;
  const newStatus = update.new_chat_member.status;

  const becameMember =
    oldStatus !== 'member' &&
    newStatus === 'member';

  if (!becameMember) return;

  const userId = update.new_chat_member.user.id;

  const userName =
    update.new_chat_member.user.first_name || 'there';

  console.log(
    `Naya channel member: ${userId} (${userName})`
  );

  // User ko broadcast list me save karo
  knownUsers.add(userId);
  saveUsers(knownUsers);

  try {

    // =================================================
    // 🔄 WELCOME MESSAGE
    // =================================================

    await bot.sendMessage(
      userId,
`🔄 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗧𝗘𝗔𝗠 𝗠𝗥𝗕𝗘𝗔𝗡 🔄

✅ 𝗦𝗧𝗘𝗣 ➊ ➜ 𝗥𝗘𝗚𝗜𝗦𝗧𝗘𝗥 𝗔𝗖𝗖𝗢𝗨𝗡𝗧

💰 𝗦𝗧𝗘𝗣 ➋ ➜ 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𝗔𝗡𝗬 𝗔𝗠𝗢𝗨𝗡𝗧

✅ 𝗦𝗧𝗘𝗣 ➌ ➜ 𝗦𝗘𝗡𝗗 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧

👇 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗧𝗛𝗘 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗩𝗜𝗣 𝗣𝗔𝗡𝗘𝗟 𝗕𝗘𝗟𝗢𝗪 👇`
    );

    await delay(1000);

    // =================================================
    // 📱 VIP PANEL APK
    // =================================================

    await bot.sendDocument(
      userId,
      path.join(__dirname, 'ITHESH VIP PANEL (1).apk'),
      {
        caption: '👑 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗩𝗜𝗣 𝗣𝗔𝗡𝗘𝗟 👑',

        reply_markup: {
          inline_keyboard: [

            [
              {
                text: '🎯 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟 𝗟𝗢𝗦𝗦 𝗥𝗘𝗖𝗢𝗩𝗘𝗥𝗬',
                url: 'https://t.me/m/4ullGvyNODA1'
              }
            ],

            [
              {
                text: '🎁 𝗚𝗜𝗙𝗧𝗖𝗢𝗗𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟',
                url: 'https://t.me/+0cMikEPZ5Z44NTZl'
              }
            ],

            [
              {
                text: '😂 𝗥𝗘𝗚𝗜𝗦𝗧𝗘𝗥 𝗟𝗜𝗡𝗞',
                url: 'https://www.tswinbb.cc/#/register?invitationCode=324515976095'
              }
            ],

            [
              {
                text: '🚀 𝗦𝗨𝗥𝗘𝗦𝗛𝗢𝗧 𝗖𝗛𝗔𝗡𝗡𝗘𝗟',
                url: 'https://t.me/m/4ullGvyNODA1'
              }
            ]

          ]
        }
      }
    );

    console.log(
      `✅ Welcome message + APK sent to ${userId}`
    );

  } catch (err) {

    console.error(
      `❌ Welcome msg FAILED for ${userId}: ${err.message}`
    );

    if (err.response && err.response.body) {
      console.error(
        'Telegram response:',
        JSON.stringify(err.response.body)
      );
    }
  }
});

// =========================================================
// 📢 BROADCAST
// Usage:
// /broadcast Your message here
// =========================================================

bot.onText(
  /\/broadcast(?:\s+([\s\S]+))?/,
  async (msg, match) => {

    const chatId = msg.chat.id;

    // Sirf admin broadcast kar sakta hai
    if (String(chatId) !== String(ADMIN_CHAT_ID)) {
      return;
    }

    const broadcastText = match[1];

    if (!broadcastText) {
      await bot.sendMessage(
        chatId,
        'Usage: /broadcast Aapka message yaha likho'
      );

      return;
    }

    const userList = [...knownUsers];

    if (userList.length === 0) {

      await bot.sendMessage(
        chatId,
        'Abhi tak koi user list mein nahi hai.'
      );

      return;
    }

    await bot.sendMessage(
      chatId,
      `📢 Broadcast shuru ho raha hai...\n\n👥 Users: ${userList.length}`
    );

    let successCount = 0;
    let failCount = 0;

    for (const userId of userList) {

      try {

        await bot.sendMessage(
          userId,
          broadcastText
        );

        successCount++;

      } catch (err) {

        failCount++;

        console.error(
          `Broadcast FAILED for ${userId}: ${err.message}`
        );
      }

      // Telegram flood limit se bachne ke liye
      await delay(150);
    }

    await bot.sendMessage(
      chatId,
`✅ 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘

✅ Success: ${successCount}
❌ Failed: ${failCount}
👥 Total: ${userList.length}`
    );
  }
);

// =========================================================
// ⚠️ POLLING ERROR
// =========================================================

bot.on('polling_error', (err) => {

  console.error(
    'Polling error:',
    err.message
  );

});

// =========================================================
// 🛑 GRACEFUL SHUTDOWN
// =========================================================

let isShuttingDown = false;

async function shutdown(signal) {

  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(
    `${signal} mila, bot ko gracefully band kar rahe hain...`
  );

  try {

    await bot.stopPolling();

    console.log(
      '✅ Polling successfully stop ho gayi.'
    );

  } catch (err) {

    console.error(
      'Polling stop karte waqt error:',
      err.message
    );

  } finally {

    process.exit(0);
  }
}

process.on(
  'SIGTERM',
  () => shutdown('SIGTERM')
);

process.on(
  'SIGINT',
  () => shutdown('SIGINT')
);
