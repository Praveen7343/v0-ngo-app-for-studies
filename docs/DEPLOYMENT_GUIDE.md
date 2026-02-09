# PSS Trust Communication Pipeline - Deployment Guide

## Overview

This guide covers setting up and deploying the automated email and SMS notification system for student registration in the PSS Trust platform.

## Architecture

```
Student Registration → Register API → Notification Service
                                    ├→ Email Service (Nodemailer)
                                    └→ SMS Service (Twilio/Fast2SMS)
```

The notification services run **asynchronously** (non-blocking) to ensure fast API responses while notifications are processed in the background.

## Prerequisites

- Node.js 16+ 
- npm/yarn package manager
- Active Supabase account
- Email service account (Gmail or SMTP provider)
- SMS service account (Twilio or Fast2SMS)

## Step 1: Install Dependencies

```bash
npm install nodemailer
npm install twilio  # If using Twilio
```

## Step 2: Email Service Setup

### Option A: Gmail with App Password (Recommended for Development)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. Update `.env.local`:
```env
EMAIL_SERVICE=gmail
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Option B: Custom SMTP Provider (Recommended for Production)

1. Choose an SMTP provider (SendGrid, AWS SES, Mailgun, etc.)
2. Obtain your SMTP credentials

3. Update `.env.local`:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@psstrust.org
```

## Step 3: SMS Service Setup

### Option A: Twilio

1. Create a Twilio account: https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number (e.g., +1-XXX-XXX-XXXX)

4. Update `.env.local`:
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1-XXX-XXX-XXXX
```

### Option B: Fast2SMS

1. Create an account: https://www.fast2sms.com
2. Generate API key from dashboard

3. Update `.env.local`:
```env
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your-api-key-here
```

## Step 4: Deployment to Vercel

1. **Push code to GitHub** with `.env.local` excluded from git:

```bash
git add .
git commit -m "Add communication pipeline"
git push origin main
```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.example`
   - DO NOT commit `.env.local` to repository

4. **Deploy**:
   - Vercel automatically deploys on push
   - Monitor deployment in Vercel dashboard

## Step 5: Production Configuration

### Email Configuration
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-key
EMAIL_FROM=support@psstrust.org
```

### SMS Configuration
```env
SMS_PROVIDER=twilio  # or fast2sms
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## Error Handling & Monitoring

### Logs

Email and SMS logs are output to console:

```
[v0] Email sent successfully: <message-id>
[v0] SMS sent via Twilio: <sid>
[v0] Email service error: Connection refused
```

### Monitoring Best Practices

1. **Log aggregation**: Use services like:
   - Vercel Log Drains
   - LogRocket
   - Sentry

2. **Error tracking**: Monitor:
   - Failed email sends
   - SMS delivery failures
   - Invalid phone numbers

3. **Test Coverage**:
```bash
# Test email service
npm test -- email.service.test.ts

# Test SMS service
npm test -- sms.service.test.ts
```

## Troubleshooting

### Email Not Sending

**Issue**: "Invalid login credentials"
- **Solution**: Verify Gmail app password is correct (16 characters with spaces)

**Issue**: "Connection timeout"
- **Solution**: Check SMTP host and port configuration

### SMS Not Sending

**Issue**: "Invalid phone number"
- **Solution**: Ensure phone number includes country code (e.g., +91 for India)

**Issue**: "Authentication failed"
- **Solution**: Verify API keys and provider configuration

## Testing

### Manual Testing

1. **Register a student**:
   - Go to /signup
   - Fill in form and submit
   - Check email and SMS

2. **Verify notifications**:
   - Check registered email inbox (including spam folder)
   - Check SMS on registered phone number

### Automated Testing

Create test file `tests/notification.test.ts`:

```typescript
import { sendWelcomeEmail } from '@/lib/services/email.service'
import { sendRegistrationSMS } from '@/lib/services/sms.service'

describe('Notification Services', () => {
  it('should send welcome email', async () => {
    const result = await sendWelcomeEmail({
      to: 'test@example.com',
      studentName: 'John Doe',
      trustId: '240113',
      registrationTime: new Date().toISOString(),
    })
    expect(result.success).toBe(true)
  })

  it('should send registration SMS', async () => {
    const result = await sendRegistrationSMS({
      phoneNumber: '+919876543210',
      studentName: 'John Doe',
      trustId: '240113',
    })
    expect(result.success).toBe(true)
  })
})
```

## Security Checklist

- [ ] API keys stored in environment variables only
- [ ] Never commit `.env.local` to version control
- [ ] Use app-specific passwords for Gmail (not main password)
- [ ] Implement rate limiting on registration endpoint
- [ ] Validate and sanitize email and phone inputs
- [ ] Use HTTPS for all API calls
- [ ] Monitor for suspicious activity in logs
- [ ] Implement email verification for confirmation

## Performance Optimization

1. **Asynchronous Processing**: Notifications run in background (non-blocking)
2. **Connection Pooling**: Reuse transporter connections
3. **Batch Operations**: For bulk notifications, use queue services like:
   - Bull
   - RabbitMQ
   - Redis Queue

## Cost Estimation (Monthly)

| Service | Volume | Cost |
|---------|--------|------|
| SendGrid (email) | 1000 emails | Free (up to 100/day) or $19.95+ |
| Twilio (SMS) | 1000 SMS | ~$50-100 |
| Fast2SMS | 1000 SMS | ₹500-1000 (~$6-12) |

## Support & Resources

- Nodemailer: https://nodemailer.com
- Twilio: https://www.twilio.com/docs
- SendGrid: https://sendgrid.com/docs
- Vercel Deployment: https://vercel.com/docs

## Maintenance

- **Monthly**: Review notification delivery logs
- **Quarterly**: Update dependencies (`npm audit fix`)
- **Annually**: Review and optimize costs

---

**Last Updated**: February 2026
**Maintainer**: PSS Trust Development Team
