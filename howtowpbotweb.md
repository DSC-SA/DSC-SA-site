# WhatsApp Bot Integration with DSC-SA Website

## Overview
This document explains how to integrate your WhatsApp bot with the DSC-SA website to handle user registration verification codes.

## How It Works

### Flow Diagram
```
User Registration (Website)
         ↓
Generate 6-digit Code
         ↓
Send POST Request to Your Bot
         ↓
Your Bot Receives Data
         ↓
Your Bot Sends WhatsApp Message to User
         ↓
User Receives Code on WhatsApp
         ↓
User Enters Code on Website
         ↓
Account Created ✓
```

---

## What Your Bot Will Receive

### Endpoint
Your bot needs to expose an HTTP endpoint that accepts POST requests.

**Deployed URL (on Koyeb):**
```
https://dsc-sa-website.koyeb.app/api/auth/register-whatsapp
```

The website will POST to this endpoint on YOUR bot's URL, which you'll configure via environment variable.

### Request Format

The website will send a POST request with this JSON payload:

```json
{
  "whatsappNumber": "+27821234567",
  "code": "123456",
  "username": "PlayerName"
}
```

**Field Descriptions:**
- `whatsappNumber` (string): The user's WhatsApp number with country code (e.g., +27, +1, +44)
- `code` (string): A 6-digit verification code (randomly generated)
- `username` (string): The user's chosen gamertag/username

### Expected Response

Your bot endpoint should respond with:

**Success Response (200):**
```json
{
  "success": true,
  "message": "Code sent to WhatsApp"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Failed to send WhatsApp message"
}
```

---

## What Your Bot Should Do

### Step 1: Receive the POST Request
Create an endpoint (e.g., `/api/send-code`) that listens for POST requests.

### Step 2: Extract Data
Parse the incoming JSON to get:
- `whatsappNumber` → Target phone number
- `code` → The verification code to send
- `username` → The user's new username

### Step 3: Send WhatsApp Message
Send a WhatsApp message to the `whatsappNumber` with the verification code.

**Suggested Message Template:**
```
🎮 Welcome to DSC-SA!

Your verification code is: 123456

This code will expire in 10 minutes. Do not share it with anyone.

If you didn't request this code, please ignore this message.
```

### Step 4: Return Success/Error
Respond with appropriate JSON (see Expected Response above).

---

## Implementation Example (Node.js)

If your bot is built with Node.js, here's a basic implementation:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Endpoint to receive verification codes from the website
app.post('/api/send-code', async (req, res) => {
  try {
    const { whatsappNumber, code, username } = req.body;

    // Validate inputs
    if (!whatsappNumber || !code || !username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Your WhatsApp bot logic here (using Twilio, WhatsApp Business API, etc.)
    const message = `🎮 Welcome to DSC-SA!\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.`;
    
    // Example with Twilio
    // await client.messages.create({
    //   body: message,
    //   from: 'whatsapp:+14155552671', // Your WhatsApp business number
    //   to: `whatsapp:${whatsappNumber}`
    // });

    // Return success
    res.json({ 
      success: true, 
      message: 'Code sent to WhatsApp' 
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(3001, () => {
  console.log('Bot listening on port 3001');
});
```

---

## Configuration

### Website Side (Already Done)

The website backend expects an environment variable:

```bash
WHATSAPP_BOT_URL=https://your-bot-url.com/api/send-code
```

When deployed on Koyeb, it will be something like:
```bash
WHATSAPP_BOT_URL=https://your-bot-koyeb-url.koyeb.app/api/send-code
```

### Bot Side (What You Need to Do)

Your bot endpoint must be:
1. **Publicly accessible** (not localhost)
2. **Accept POST requests**
3. **Validate the incoming data**
4. **Send WhatsApp message**
5. **Return proper JSON response**

---

## Testing Locally

### Before Deployment

1. **Start your bot locally:**
   ```bash
   node bot.js
   ```

2. **Set environment variable in website backend:**
   ```bash
   WHATSAPP_BOT_URL=http://localhost:3001/api/send-code
   ```

3. **Test the registration flow:**
   - Go to http://localhost:3000/register
   - Fill in username and phone number
   - Click "Send Verification Code"
   - Check your bot console for the POST request
   - Verify the message was sent to WhatsApp

### After Deployment

1. **Get your Koyeb bot URL:**
   - Deploy your bot on Koyeb
   - Copy the deployed URL

2. **Update website environment variable:**
   ```bash
   WHATSAPP_BOT_URL=https://your-bot-koyeb-url.koyeb.app/api/send-code
   ```

3. **Deploy website with new .env**

4. **Test registration:**
   - Go to https://dsc-sa-website.koyeb.app/register
   - Complete registration flow
   - You should receive WhatsApp message

---

## Security Considerations

1. **Validate Phone Numbers**: Check that the phone number format is correct before processing
   ```javascript
   const validPhoneRegex = /^\+[1-9]\d{1,14}$/;
   if (!validPhoneRegex.test(whatsappNumber)) {
     return res.status(400).json({ error: 'Invalid phone number' });
   }
   ```

2. **Rate Limiting**: Limit requests per IP to prevent abuse
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // 5 requests per IP
   });
   app.post('/api/send-code', limiter, ...);
   ```

3. **Verify Bot Origin**: In production, verify requests come from your website domain

4. **Use HTTPS**: Always use HTTPS for the bot endpoint (Koyeb provides this by default)

---

## Troubleshooting

### Issue: "Registration failed"
- **Check**: Is your bot endpoint public and accessible?
- **Check**: Is the `WHATSAPP_BOT_URL` environment variable set correctly?
- **Check**: Can you curl the endpoint from terminal?

### Issue: "Code not received on WhatsApp"
- **Check**: Is your bot's WhatsApp integration working independently?
- **Check**: Is the phone number in the correct format?
- **Check**: Is your WhatsApp Business account active?

### Issue: Timeout errors
- **Check**: Is your bot slow to respond? Try to optimize
- **Check**: Network connectivity between website and bot

---

## File Structure Reference

**Website** (already set up):
- Backend: [backend/controllers/authController.js](backend/controllers/authController.js)
  - Function: `registerWithWhatsApp()`
  - Sends POST to `WHATSAPP_BOT_URL`
- Frontend: [frontend/src/pages/Register.jsx](frontend/src/pages/Register.jsx)
  - Registration form with WhatsApp option

**Your Bot** (what you need to create):
- Endpoint: `/api/send-code` (or your preferred path)
- Method: `POST`
- Receives: `{ whatsappNumber, code, username }`
- Does: Send WhatsApp message
- Returns: `{ success: boolean, message/error: string }`

---

## Additional Notes

- The verification code is **only valid for 10 minutes** on the website backend
- The user must enter the code within this time window
- If code expires, they need to restart registration
- No code resend functionality yet (can be added later)

---

## Support

If you have questions about:
- **Website integration**: Check the authController.js file
- **WhatsApp API integration**: Refer to your WhatsApp provider's docs (Twilio, Meta, etc.)
- **Koyeb deployment**: Refer to Koyeb documentation

---

**Last Updated**: May 9, 2026
**Status**: Ready for integration ✅
