const nodemailer = require('nodemailer');

// Configurazione Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // fabio.rock84@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // App Password di Gmail
  }
});

// Main handler function
const mainHandler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { 
      to, 
      subject, 
      html, 
      text, 
      attachments = [],
      from = `Associazione Maratonda <${process.env.GMAIL_USER || 'associazionemaratonda@gmail.com'}>`
    } = JSON.parse(event.body);

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields: to, subject, and html or text' 
        })
      };
    }

    // Prepare email data per nodemailer
    const emailData = {
      from,
      to,
      subject,
      html: html || text,
      text: text || undefined,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content, // base64 string
        contentType: att.type || 'application/pdf',
        encoding: 'base64'
      }))
    };

    console.log('Sending email via Gmail SMTP:', {
      to,
      subject,
      attachmentCount: attachments.length,
      from
    });

    // Send email via Gmail SMTP
    const result = await transporter.sendMail(emailData);

    console.log('Email sent successfully:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        id: result.messageId,
        message: 'Email sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};

exports.handler = mainHandler;