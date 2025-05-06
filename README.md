# Ecommerce Website Template - Environment Configuration Guide

This document provides a guide on how to set up the necessary environment variables for the Ecommerce Website Template.

## Required Environment Variables

### Telegram Configuration
- `BOT_TOKEN`: Create a bot with [@BotFather](https://t.me/botfather) on Telegram and get your token
- `CHAT_ID`: The ID of the Telegram chat where notifications will be sent (use [@userinfobot](https://t.me/userinfobot))

### MongoDB Configuration
- `MONGODB_URI`: Your MongoDB connection string (create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- `MONGODB_COLLECTION`: Name of the collection to store data in MongoDB

### Email Configuration
- `SMTP_HOST`: SMTP server host (e.g., smtp.gmail.com for Gmail)
- `SMTP_PORT`: SMTP server port (typically 587 for TLS)
- `SMTP_USER`: Email address used for sending emails
- `SMTP_PASS`: App password for your email account (for Gmail, create at Google Account > Security > App passwords)
- `EMAIL_FROM`: The sender email address displayed to recipients
- `SMTP_FEEDBACK_TO`: Email address where feedback will be sent

### Security
- `WEBHOOK_SECRET`: A long random string used to secure webhooks (generate using a secure random generator)

### API Configuration
- `UNLIMCLOUD_URL`: The URL for your file upload API endpoint

### Payment Processing (Cashfree)
- `CASHFREE_ENVIRONMENT`: Set to 'sandbox' for testing, 'production' for live transactions
- `PAYMENT_APP_ID`: Your Cashfree App ID (get from [Cashfree Dashboard](https://merchant.cashfree.com))
- `PAYMENT_SECRET`: Your Cashfree secret key

### Application Settings
- `NODE_ENV`: Set to 'development' for local development, 'production' for live deployment
- `COMPRESS`: Set to 'true' to enable response compression
- `SESSION_TIMEOUT_MS`: Session timeout in milliseconds (86400000 = 24 hours), optional

## Example .env File

```
BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/database
MONGODB_COLLECTION=mystore
CHAT_ID=-1001234567890
NODE_ENV=development
COMPRESS=true
SESSION_TIMEOUT_MS=86400000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mystore@example.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=mystore@example.com
SMTP_FEEDBACK_TO=feedback@example.com
WEBHOOK_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
UNLIMCLOUD_URL=http://localhost:3001/api/v1/files/upload
CASHFREE_ENVIRONMENT=sandbox
PAYMENT_APP_ID=TEST12345678901234567890123456789012345
PAYMENT_SECRET=cfsk_ma_test_abcdefghijklmnopqrstuvwxyz123456_abcdefgh
```

## How to Set Up

1. Create a `.env` file in your project root
2. Copy the variables above with your own values
3. Make sure to never commit this file to public repositories
4. For deployment, set these as environment variables in your hosting platform