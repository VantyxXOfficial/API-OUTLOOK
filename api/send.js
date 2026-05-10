import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { target, subject, message, email, pass } = req.query;

    if (!target || !message || !email || !pass) {
        return res.status(400).json({
            status: 'failed',
            error: 'Parameter incomplete. Required: target, message, email, pass'
        });
    }

    // Deteksi provider berdasarkan domain email
    const domain = (email.split('@')[1] || '').toLowerCase();

    let smtpConfig;
    if (['outlook.com', 'hotmail.com', 'live.com', 'live.co.id', 'msn.com'].includes(domain)) {
        smtpConfig = {
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false, minVersion: 'TLSv1' }
        };
    } else if (['yahoo.com', 'yahoo.co.id', 'ymail.com'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.mail.yahoo.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else if (['zoho.com', 'zohomail.com'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.zoho.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else if (['yandex.com', 'yandex.ru', 'ya.ru'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.yandex.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else if (['icloud.com', 'me.com', 'mac.com'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.mail.me.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else if (['gmx.com', 'gmx.net', 'gmx.de'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.gmx.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else if (['mail.com', 'email.com'].includes(domain)) {
        smtpConfig = {
            host: 'smtp.mail.com',
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    } else {
        // Generic fallback untuk custom domain
        smtpConfig = {
            host: `smtp.${domain}`,
            port: 587,
            secure: false,
            auth: { user: email, pass },
            tls: { rejectUnauthorized: false }
        };
    }

    try {
        const transporter = nodemailer.createTransport(smtpConfig);

        await transporter.sendMail({
            from: email,
            to: 'support@support.whatsapp.com',
            subject: subject || 'Banding Akun',
            text: message
        });

        transporter.close();

        return res.status(200).json({
            status: 'success',
            data: {
                target: target,
                sender: email,
                provider: domain,
                server: smtpConfig.host,
                method: 'API OUTLOOK'
            },
            msg: 'APPEAL SENT SUCCESSFULLY'
        });

    } catch (error) {
        // Coba fallback port 465 jika 587 gagal karena koneksi
        const errMsg = error.message || '';
        const isAuthError = /535|534|530|invalid.login|authentication|username.and.password|bad.credentials/i.test(errMsg);

        if (!isAuthError) {
            try {
                const smtpConfig465 = { ...smtpConfig, port: 465, secure: true };
                const transporter2 = nodemailer.createTransport(smtpConfig465);
                await transporter2.sendMail({
                    from: email,
                    to: 'support@support.whatsapp.com',
                    subject: subject || 'Banding Akun',
                    text: message
                });
                transporter2.close();
                return res.status(200).json({
                    status: 'success',
                    data: {
                        target: target,
                        sender: email,
                        provider: domain,
                        server: smtpConfig.host + ':465',
                        method: 'API OUTLOOK (SSL)'
                    },
                    msg: 'APPEAL SENT SUCCESSFULLY (PORT 465)'
                });
            } catch (err2) {
                return res.status(500).json({
                    status: 'error',
                    provider: domain,
                    error: err2.message
                });
            }
        }

        return res.status(500).json({
            status: 'error',
            provider: domain,
            error: errMsg
        });
    }
}
