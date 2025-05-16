const axios = require('axios');
require('dotenv').config({ path: './bot.env' });

async function sendMessageHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, email, mensagem } = req.body;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !chatId) {
        return res.status(500).json({
            success: false,
            error: 'Configuração inválida. Verifique as variáveis de ambiente.',
        });
    }

    const text = `📩 *Novo Contato Recebido*\n\n👤 *Nome:* ${nome}\n📧 *Email:* ${email}\n💬 *Mensagem:* ${mensagem}`;

    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown',
            }
        );

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Falha ao enviar mensagem para o Telegram.',
        });
    }
}

module.exports = sendMessageHandler;