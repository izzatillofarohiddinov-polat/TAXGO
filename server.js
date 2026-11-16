
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
    console.error("BOT_TOKEN yoki CHAT_ID topilmadi!");
    process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: false
});

app.post("/order", async (req, res) => {
    console.log("TAXGO BUYURTMA KELDI:", req.body);

    const { from, to, phone, type } = req.body;

    if (!from || !to || !phone || !type) {
        return res.status(400).json({
            success: false,
            message: "Barcha maydonlarni to'ldiring!"
        });
    }

    const message = `
🚕 YANGI TAXGO BUYURTMASI

📞 Telefon: ${phone}
📍 Qayerdan: ${from}
🏁 Qayerga: ${to}
🚘 Taxi turi: ${type}
`;

    try {
        await bot.sendMessage(process.env.CHAT_ID, message);

        console.log("TELEGRAMGA BUYURTMA YUBORILDI!");

        return res.json({
            success: true,
            message: "Buyurtma yuborildi!"
        });

    } catch (error) {
        console.error("TELEGRAM XATOSI:", error);

        return res.status(500).json({
            success: false,
            message: "Telegramga yuborishda xatolik!"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`TAXGO server ishga tushdi: http://localhost:${PORT}`);
});


