// Netlify Function: send-invoice-email
// Minimal JS implementation using Nodemailer and Gmail App Password

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const {
      to_email,
      to_name,
      subject,
      message,
      from_name,
      from_email,
      invoice_number,
      invoice_type,
      pdfBase64,
    } = JSON.parse(event.body || '{}');

    if (!to_email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const user = process.env.GMAIL_USER;
    const appPassword = process.env.GMAIL_APP_PASSWORD;

    if (!user || !appPassword) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email credentials not configured' }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: appPassword,
      },
    });

    const mailOptions = {
      from: `${from_name || 'Associazione Maratonda'} <${user}>`,
      to: `${to_name ? `${to_name} ` : ''}<${to_email}>`,
      subject,
      text: message,
      html: `<pre style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; white-space: pre-wrap">${message}</pre>`,
    };

    if (pdfBase64) {
      mailOptions.attachments = [
        {
          filename: `Fattura_${invoice_number || 'documento'}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: info.messageId }),
    };
  } catch (err) {
    console.error('send-invoice-email error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message || String(err) }),
    };
  }
};