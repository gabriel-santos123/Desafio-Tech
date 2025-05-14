import axios from 'axios';
require('dotenv').config({ path: './bot.env' });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nome, email, mensagem } = req.body;

        // Substitua pelas variáveis de ambiente configuradas
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN; // Token do bot
        const chatId = process.env.TELEGRAM_CHAT_ID; // ID do chat ou grupo

        // Mensagem formatada
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
            console.error('Erro ao enviar mensagem para o Telegram:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}