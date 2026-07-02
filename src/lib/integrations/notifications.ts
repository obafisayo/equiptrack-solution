import type { AppNotification, NotificationChannel } from '@/app/messages/_components/types'

export interface NotificationPayload {
  title: string
  body: string
  href?: string
  recipientPhone?: string  // WhatsApp
  recipientEmail?: string  // Email
  channels: NotificationChannel[]
}

const EMAIL_ENABLED    = Boolean(process.env.SMTP_HOST)
const WHATSAPP_ENABLED = Boolean(process.env.WHATSAPP_API_KEY)

export const NotificationService = {
  emailEnabled:    EMAIL_ENABLED,
  whatsappEnabled: WHATSAPP_ENABLED,

  async send(payload: NotificationPayload): Promise<{ emailSent: boolean; whatsappSent: boolean }> {
    let emailSent    = false
    let whatsappSent = false

    if (payload.channels.includes('email') && payload.recipientEmail) {
      if (EMAIL_ENABLED) {
        // TODO: Send via nodemailer / SendGrid
        // await transporter.sendMail({ to: payload.recipientEmail, subject: payload.title, text: payload.body })
        emailSent = true
      } else {
        console.info(`[Email Sim] To: ${payload.recipientEmail} | Subject: ${payload.title} | Body: ${payload.body}`)
        emailSent = true // simulate success in dev
      }
    }

    if (payload.channels.includes('whatsapp') && payload.recipientPhone) {
      if (WHATSAPP_ENABLED) {
        // TODO: Send via WhatsApp Business API
        // await fetch('https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages', {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ messaging_product: 'whatsapp', to: payload.recipientPhone, type: 'text', text: { body: `${payload.title}: ${payload.body}` } }),
        // })
        whatsappSent = true
      } else {
        console.info(`[WhatsApp Sim] To: ${payload.recipientPhone} | Message: ${payload.title}: ${payload.body}`)
        whatsappSent = true // simulate success in dev
      }
    }

    return { emailSent, whatsappSent }
  },

  // Convenience: fire-and-forget notification for SLA breaches
  async notifySLABreach(orderId: string, stage: string, elapsedHours: number, slaHours: number, recipientEmail?: string, recipientPhone?: string) {
    return this.send({
      title: 'SLA Breach',
      body: `${orderId} has been in "${stage}" for ${elapsedHours}h (SLA: ${slaHours}h). Immediate action required.`,
      href: '/dispatch',
      recipientEmail,
      recipientPhone,
      channels: ['in-app', 'email', 'whatsapp'],
    })
  },

  // Convenience: notify contractor of a new request
  async notifyContractorRequest(contractorName: string, requestId: string, items: string, recipientEmail?: string, recipientPhone?: string) {
    return this.send({
      title: 'New CCU Request',
      body: `TotalEnergies has requested: ${items}. Reference: ${requestId}.`,
      href: `/qaqc/ccu-requests/${requestId}`,
      recipientEmail,
      recipientPhone,
      channels: ['email', 'whatsapp'],
    })
  },
}
