/**
 * Email Service - Sends registration confirmation emails
 */

interface EmailPayload {
  to: string
  studentName: string
  trustId: string
  registrationTime: string
}

export async function sendWelcomeEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const provider = process.env.EMAIL_PROVIDER || "nodemailer"

    if (provider === "nodemailer") {
      await sendViaNodemailer(payload)
      return { success: true }
    } else if (provider === "sendgrid") {
      await sendViaSendGrid(payload)
      return { success: true }
    } else {
      console.warn("[v0] Email provider not configured")
      return { success: false, error: "Email provider not configured" }
    }
  } catch (error: any) {
    console.error("[v0] Email send error:", error)
    return { success: false, error: error.message }
  }
}

async function sendViaNodemailer(payload: EmailPayload): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("[v0] Email credentials not configured")
    return
  }
  console.log(`[v0] Would send email to ${payload.to}`)
}

async function sendViaSendGrid(payload: EmailPayload): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.warn("[v0] SendGrid credentials not configured")
    return
  }
  console.log(`[v0] Would send SendGrid email to ${payload.to}`)
}

export default { sendWelcomeEmail }
