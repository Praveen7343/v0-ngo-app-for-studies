# Notification System Architecture

## System Overview

The PSS Trust notification system is designed for:
- **Reliability**: Multiple providers supported
- **Scalability**: Asynchronous processing
- **Maintainability**: Modular service layer
- **Observability**: Comprehensive logging

## Folder Structure

```
lib/
├── services/
│   ├── email.service.ts        # Email sending logic
│   ├── sms.service.ts          # SMS sending logic
│   └── notification.service.ts # Orchestration layer
│
app/
├── api/
│   └── auth/
│       └── register/
│           └── route.ts         # Triggers notifications on registration
│
docs/
├── DEPLOYMENT_GUIDE.md          # Setup instructions
└── NOTIFICATION_ARCHITECTURE.md # This file
```

## Service Layer Design

### 1. Email Service (`email.service.ts`)

**Purpose**: Send personalized HTML emails to students

**Functions**:
- `sendWelcomeEmail()`: Send registration confirmation
- `sendVerificationEmail()`: Send email verification link

**Configuration**:
- Gmail with App Password (development)
- Custom SMTP (production)

**Error Handling**:
```typescript
{
  success: boolean,
  error?: string  // Error message if failed
}
```

### 2. SMS Service (`sms.service.ts`)

**Purpose**: Send SMS notifications to students

**Functions**:
- `sendRegistrationSMS()`: Send registration acknowledgment
- `sendSMSViaTwilio()`: Twilio provider
- `sendSMSViaFast2SMS()`: Fast2SMS provider

**Configuration**:
- Environment-based provider selection
- Provider-specific API integration

### 3. Notification Orchestrator (`notification.service.ts`)

**Purpose**: Coordinate email and SMS notifications

**Functions**:
- `triggerRegistrationNotifications()`: Send all notifications for a registration
- `logNotificationStatus()`: Log delivery status

**Flow**:
```
trigger()
├─ Validate input
├─ Fire email (async)
├─ Fire SMS (async)
└─ Return immediately (no wait)
```

## Data Flow

```
User Registration
       ↓
   validate input
       ↓
   create student
       ↓
   trigger notifications
   (non-blocking)
       ↓
   return response
       ↓
   [background]
   ├─ send email
   └─ send SMS
```

## API Integration

### Email Providers

**Gmail (SMTP)**:
```
auth: OAuth2/App Password
host: smtp.gmail.com
port: 465
```

**SendGrid (SMTP)**:
```
auth: API key
host: smtp.sendgrid.net
port: 587
```

### SMS Providers

**Twilio**:
```
POST /2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json
auth: Basic (Account SID:Auth Token)
payload: { From, To, Body }
```

**Fast2SMS**:
```
POST /dev/bulk
header: authorization (API key)
payload: { variables_values, route, numbers, message }
```

## Error Handling Strategy

### Graceful Degradation

```typescript
// Registration succeeds even if notifications fail
try {
  await createStudent()
  triggerNotifications() // Fire and forget
  return { success: true }
} catch (error) {
  return { success: false, error }
}
```

### Logging & Monitoring

```typescript
console.log("[v0] Email sent:", messageId)      // Success
console.error("[v0] SMS failed:", error.msg)    // Error
console.log("[v0] Notification status:", {...}) // Monitoring
```

## Security Considerations

1. **Environment Variables**:
   - Never commit API keys to git
   - Use `.env.local` for development
   - Use Vercel environment secrets for production

2. **Input Validation**:
   - Sanitize email addresses
   - Validate phone number format
   - Rate limit registration endpoint

3. **Email Security**:
   - Use sender verification
   - Implement SPF/DKIM/DMARC
   - Avoid sensitive info in plain text

4. **SMS Security**:
   - Use country-specific formatting
   - Validate numbers before sending
   - Implement rate limiting

## Scalability

### Current Architecture (Good for <100 registrations/day)

```
Request → API → Notification Service → Email + SMS
```

### Recommended for Production (>1000 registrations/day)

```
Request → API → Message Queue → Workers → Email + SMS
                    (Bull/RabbitMQ)
```

Implementation:
```typescript
import Bull from 'bull'

const emailQueue = new Bull('email')
const smsQueue = new Bull('sms')

// Add to queue
emailQueue.add(emailData)
smsQueue.add(smsData)

// Process asynchronously
emailQueue.process(sendWelcomeEmail)
smsQueue.process(sendRegistrationSMS)
```

## Testing Strategy

### Unit Tests

```typescript
describe('Email Service', () => {
  it('should format email template correctly', () => {
    const html = generateEmailTemplate({...})
    expect(html).toContain('Trust ID')
  })

  it('should handle missing email gracefully', () => {
    const result = await sendWelcomeEmail({
      to: '',
      ...
    })
    expect(result.success).toBe(false)
  })
})
```

### Integration Tests

```typescript
describe('Registration with Notifications', () => {
  it('should send email and SMS on registration', async () => {
    const response = await register({...})
    expect(response.success).toBe(true)
    
    await delay(2000) // Wait for async processing
    
    // Verify email sent to inbox
    // Verify SMS sent to phone
  })
})
```

## Deployment Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set in `.env.local`
- [ ] Email provider configured and tested
- [ ] SMS provider configured and tested
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Error handling verified
- [ ] Deployed to Vercel
- [ ] Production environment variables set
- [ ] Monitoring/alerting configured

## Monitoring & Observability

### Key Metrics

1. **Email Delivery Rate**: (Sent - Failed) / Total × 100%
2. **SMS Delivery Rate**: (Sent - Failed) / Total × 100%
3. **Notification Latency**: Time from registration to sending
4. **Error Rate**: Failed notifications / Total × 100%

### Log Analysis

```bash
# Count successful emails
grep "[v0] Email sent" logs/*.log | wc -l

# Find failures
grep "[v0] Email.*error" logs/*.log

# Monitor latency
grep "[v0] Notification" logs/*.log | tail -20
```

## Future Enhancements

1. **Template Management**: Database-driven email templates
2. **Personalization**: Dynamic content based on student data
3. **Scheduling**: Send notifications at optimal times
4. **Preferences**: Let students choose notification channels
5. **Webhook Logging**: Track delivery events from providers
6. **Multi-language**: Support for regional languages

---

**Architecture Version**: 1.0
**Last Updated**: February 2026
