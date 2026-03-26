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

  // THÊM DÒNG NÀY: Chỉ gửi nếu là channelId mục tiêu
  // Bạn lấy ID bằng cách chuột phải vào tên kênh bên Discord -> Copy Channel ID
  if (message.channel.id !== '1486017673916710924') return; 

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: message.content,
        user: message.author.username,
        channelId: message.channel.id
      })
    });
  } catch (error) {
    console.error("Lỗi gửi Webhook:", error);
  }
});

client.login(TOKEN);
