/**
 * SMS Service - Sends SMS notifications to students
 * Supports both Twilio and Fast2SMS providers
 */

interface SMSOptions {
  phoneNumber: string
  studentName: string
  trustId: string
  provider?: "twilio" | "fast2sms"
}

/**
 * Send SMS via Twilio
 */
export async function sendSMSViaTwilio(options: SMSOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + process.env.TWILIO_ACCOUNT_SID + "/Messages.json", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER || "",
        To: options.phoneNumber,
        Body: `Welcome to PSS Trust! Your registration is complete. Your Trust ID: ${options.trustId}. Use this ID for all future communications.`,
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Twilio API error")
    }

    console.log("[v0] SMS sent via Twilio:", data.sid)
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Twilio SMS error:", error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Send SMS via Fast2SMS
 */
export async function sendSMSViaFast2SMS(options: SMSOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const message = `Welcome to PSS Trust! Registration successful. Your Trust ID: ${options.trustId}. Keep it safe.`

    const response = await fetch("https://www.fast2sms.com/dev/bulk", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables_values: options.phoneNumber,
        route: "otp",
        numbers: options.phoneNumber,
        message: message,
      }),
    })

    const data = await response.json()

    if (data.return === false) {
      throw new Error(data.message || "Fast2SMS API error")
    }

    console.log("[v0] SMS sent via Fast2SMS:", data.request_id)
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Fast2SMS error:", error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Send SMS based on configured provider
 */
export async function sendRegistrationSMS(options: SMSOptions): Promise<{ success: boolean; error?: string }> {
  // Validate phone number format
  if (!options.phoneNumber || options.phoneNumber.length < 10) {
    return { success: false, error: "Invalid phone number format" }
  }

  const provider = process.env.SMS_PROVIDER || "fast2sms"

  try {
    let result

    if (provider === "twilio") {
      result = await sendSMSViaTwilio(options)
    } else if (provider === "fast2sms") {
      result = await sendSMSViaFast2SMS(options)
    } else {
      return { success: false, error: `Unknown SMS provider: ${provider}` }
    }

    return result
  } catch (error: any) {
    console.error("[v0] SMS service error:", error.message)
    return { success: false, error: error.message }
  }
}

export default { sendRegistrationSMS, sendSMSViaTwilio, sendSMSViaFast2SMS }
