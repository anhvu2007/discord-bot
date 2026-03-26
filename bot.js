const { Client, GatewayIntentBits, Events } = require('discord.js');
const fetch = require('node-fetch');

// Khởi tạo Bot với đầy đủ Intents đã bật trên Dashboard
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.on(Events.ClientReady, (c) => {
  console.log(`✅ Bot đã sẵn sàng: ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  // Bỏ qua tin nhắn từ Bot
  if (message.author.bot) return;

  console.log(`📩 Nhận tin: "${message.content}" từ ${message.author.username}`);

  try {
    // Gửi dữ liệu sang n8n
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: message.content, // Đây là dữ liệu n8n sẽ nhận trong "body"
        user: message.author.username,
        channelId: message.channel.id
      })
    });

    if (response.ok) {
      console.log("🚀 Đã đẩy dữ liệu sang n8n thành công!");
    } else {
      console.error("❌ n8n trả về lỗi:", response.status);
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối tới Webhook n8n:", error.message);
  }
});

client.login(TOKEN);
