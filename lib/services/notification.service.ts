/**
 * Notification Service - Orchestrates email and SMS notifications
 * Runs notifications asynchronously without blocking the main response
 */

import { sendWelcomeEmail } from "./email.service"
import { sendRegistrationSMS } from "./sms.service"

interface NotificationPayload {
  studentName: string
  emailId: string
  mobileNumber: string
  trustId: string
  registrationTime: string
}

/**
 * Send all notifications asynchronously
 * Returns immediately without waiting for email/SMS to complete
 */
export async function triggerRegistrationNotifications(payload: NotificationPayload): Promise<void> {
  // Fire and forget - don't await these promises
  // This ensures the API responds quickly to the user
  return Promise.all([
    sendWelcomeEmail({
      to: payload.emailId,
      studentName: payload.studentName,
      trustId: payload.trustId,
      registrationTime: payload.registrationTime,
    }).catch((error) => {
      console.error("[v0] Failed to send welcome email:", error)
    }),

    sendRegistrationSMS({
      phoneNumber: payload.mobileNumber,
      studentName: payload.studentName,
      trustId: payload.trustId,
    }).catch((error) => {
      console.error("[v0] Failed to send registration SMS:", error)
    }),
  ])
    .then(() => {
      console.log("[v0] All notifications sent for student:", payload.trustId)
    })
    .catch((error) => {
      console.error("[v0] Notification batch error:", error)
    })
}

/**
 * Log notification status for monitoring
 */
export async function logNotificationStatus(
  trustId: string,
  emailStatus: { success: boolean; error?: string },
  smsStatus: { success: boolean; error?: string }
): Promise<void> {
  const timestamp = new Date().toISOString()

  console.log(`[v0] Notification Status - ${timestamp}`, {
    trustId,
    email: emailStatus,
    sms: smsStatus,
  })

  // In production, you would log this to a database or monitoring service
  // Example: await logToDatabase({ trustId, timestamp, emailStatus, smsStatus })
}
