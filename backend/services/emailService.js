const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dawnspherecommunity@gmail.com',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

const sendVerificationEmail = async (email, code, username) => {
  try {
    const mailOptions = {
      from: `"DSC-SA Community" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎮 Verify Your DSC-SA Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 10px; color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 28px;">🎮 DSC-SA Community</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0;">Mobile Legends: Bang Bang</p>
          </div>

          <div style="background: rgba(15, 23, 42, 0.5); padding: 25px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h2 style="color: #06b6d4; margin-top: 0;">Welcome to DSC-SA, ${username}! 🎯</h2>
            
            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">
              Thanks for joining our community! To complete your registration, please verify your email address using the code below:
            </p>

            <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: #f1f5f9; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
              <p style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 10px 0 0 0; letter-spacing: 6px;">${code}</p>
            </div>

            <p style="color: #cbd5e1; font-size: 14px; margin: 20px 0;">
              ⏰ <strong>This code expires in 10 minutes.</strong>
            </p>

            <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #86efac; margin: 0; font-size: 14px;">
                <strong>✓ Security Tip:</strong> Never share this code with anyone. Our team will never ask for it.
              </p>
            </div>

            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © 2026 DSC-SA Community. All rights reserved.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">
              Made with ❤️ for MLBB players
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.response);
    return { success: true, message: 'Verification code sent to email' };
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    return { success: false, error: err.message };
  }
};

const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: `"DSC-SA Community" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎮 Welcome to DSC-SA Community!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 10px; color: #e2e8f0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 28px;">🎮 DSC-SA Community</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0;">Mobile Legends: Bang Bang</p>
          </div>

          <div style="background: rgba(15, 23, 42, 0.5); padding: 25px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <h2 style="color: #22c55e; margin-top: 0;">Welcome to DSC-SA, ${username}! 🎯</h2>
            
            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">
              Your account is now active! You're all set to join our amazing MLBB community. Start exploring heroes, builds, and connect with fellow players!
            </p>

            <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #86efac; margin: 0; font-size: 14px;">
                <strong>✓ Account Created Successfully!</strong> You can now login and start playing.
              </p>
            </div>

            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Have fun and thanks for joining DSC-SA! 🚀
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © 2026 DSC-SA Community. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.response);
    return { success: true };
  } catch (err) {
    console.error('❌ Error sending welcome email:', err.message);
    return { success: false };
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
