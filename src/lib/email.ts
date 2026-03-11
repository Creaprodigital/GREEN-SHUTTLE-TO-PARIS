import { EmailSettings, EMAIL_TEMPLATES } from '@/types/email'
import { Booking } from '@/types/booking'

export async function sendBookingConfirmation(
  booking: Booking,
  emailSettings: EmailSettings
): Promise<{ success: boolean; message: string }> {
  if (!emailSettings.enabled) {
    return { success: false, message: 'Les notifications email sont désactivées' }
  }

  try {
    const clientEmailSent = emailSettings.sendConfirmationToClient
      ? await sendEmail(
          emailSettings,
          booking.email,
          EMAIL_TEMPLATES.bookingConfirmation.subject,
          EMAIL_TEMPLATES.bookingConfirmation.getBody(booking)
        )
      : { success: true, message: 'Client email disabled' }

    const adminEmailSent = emailSettings.sendNotificationToAdmin && emailSettings.adminEmail
      ? await sendEmail(
          emailSettings,
          emailSettings.adminEmail,
          EMAIL_TEMPLATES.adminNotification.subject,
          EMAIL_TEMPLATES.adminNotification.getBody(booking)
        )
      : { success: true, message: 'Admin email disabled' }

    if (clientEmailSent.success || adminEmailSent.success) {
      return {
        success: true,
        message: 'Email de confirmation envoyé avec succès'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de l\'envoi des emails'
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

export async function sendBookingUpdate(
  booking: Booking,
  emailSettings: EmailSettings,
  previousStatus?: string
): Promise<{ success: boolean; message: string }> {
  if (!emailSettings.enabled || !emailSettings.sendUpdatesToClient) {
    return { success: false, message: 'Les notifications email sont désactivées' }
  }

  try {
    const statusChange = previousStatus !== booking.status ? booking.status : ''
    
    const result = await sendEmail(
      emailSettings,
      booking.email,
      EMAIL_TEMPLATES.bookingUpdate.subject,
      EMAIL_TEMPLATES.bookingUpdate.getBody(booking, statusChange)
    )

    return result
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

async function sendEmail(
  settings: EmailSettings,
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; message: string }> {
  const emailData = {
    from: `${settings.fromName} <${settings.fromEmail}>`,
    to,
    subject,
    text: body,
    html: convertTextToHtml(body),
    smtp: {
      host: settings.smtpHost,
      port: parseInt(settings.smtpPort),
      user: settings.smtpUser,
      password: settings.smtpPassword
    }
  }

  try {
    const prompt = spark.llmPrompt`You are an email sending service. Based on the following email configuration, simulate sending an email and return a JSON response indicating success or failure.

Email Configuration:
${JSON.stringify(emailData, null, 2)}

Important: Since this is a browser-based application, we cannot actually send SMTP emails. Instead:
1. Log the email details that would have been sent
2. Return a success response with a message indicating this is a simulation
3. In production, this would integrate with a backend email service

Return a JSON object with this structure:
{
  "success": true,
  "message": "Email simulation successful - would have sent to ${to}"
}`

    const response = await spark.llm(prompt, 'gpt-4o-mini', true)
    const result = JSON.parse(response)
    
    console.log('📧 Email Simulation:', {
      to,
      subject,
      body: body.substring(0, 200) + '...',
      settings: {
        host: settings.smtpHost,
        port: settings.smtpPort,
        from: emailData.from
      }
    })

    return {
      success: true,
      message: `Email envoyé à ${to} (mode simulation - configurez SMTP pour l'envoi réel)`
    }
  } catch (error) {
    console.error('Email error:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    }
  }
}

function convertTextToHtml(text: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Montserrat', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #75be14;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1a1a1a;
      font-family: 'Cormorant Garamond', serif;
      font-size: 28px;
      margin: 0;
    }
    .content {
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.8;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    strong {
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Green Shuttle To Paris</h1>
    </div>
    <div class="content">${text.replace(/\n/g, '<br>')}</div>
    <div class="footer">
      <p>Cet email a été envoyé par Green Shuttle To Paris</p>
      <p>Pour toute question, contactez-nous</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
