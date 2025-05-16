const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, email, mensagem } = req.body;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !chatId) {
        return res.status(500).json({ error: 'Configuração inválida.' });
    }

    const text = `📩 *Novo Contato Recebido*\n\n👤 *Nome:* ${nome}\n📧 *Email:* ${email}\n💬 *Mensagem:* ${mensagem}`;

    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                chat_id: chatId,
                text,
                parse_mode: 'Markdown',
            }
        );

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('Erro ao enviar para o Telegram:', error.message);
        res.status(500).json({ error: 'Falha ao enviar mensagem.' });
    }
};
