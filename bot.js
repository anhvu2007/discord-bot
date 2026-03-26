const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch'); // Thêm dòng này

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.on("ready", () => {
  console.log(`Bot đã sẵn sàng: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: message.content, // Đổi thành chatInput cho khớp với n8n của bạn
        user: message.author.username,
        channelId: message.channel.id
      })
    });
  } catch (error) {
    console.error("Lỗi gửi Webhook:", error);
  }
});

client.login(TOKEN);
