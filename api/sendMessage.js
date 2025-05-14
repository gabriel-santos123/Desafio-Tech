import axios from 'axios';
require('dotenv').config({ path: './bot.env' });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nome, email, mensagem } = req.body;

        // Verificar se as variáveis de ambiente estão configuradas
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!telegramBotToken || !chatId) {
            console.error('Erro: Variáveis de ambiente não configuradas corretamente.');
            return res.status(500).json({
                success: false,
                error: 'Configuração inválida. Verifique as variáveis de ambiente.',
            });
        }

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
            console.error('Erro ao enviar mensagem para o Telegram:', {
                message: error.message,
                response: error.response?.data,
            });
            res.status(500).json({
                success: false,
                error: 'Falha ao enviar mensagem para o Telegram. Verifique os logs.',
            });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}