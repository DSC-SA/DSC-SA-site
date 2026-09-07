const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');

// Resolve the canonical frontend origin. Railway auto-provides the current
// public domain (RAILWAY_STATIC_URL), so redirects/links always point at the
// live domain even when it changes — never a stale hardcoded host.
const getFrontendBaseUrl = () => {
  const publicUrl = process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN;
  if (publicUrl) return /^https?:\/\//i.test(publicUrl) ? publicUrl : `https://${publicUrl}`;
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  return 'http://localhost:3000';
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email + Password Registration
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user as UNVERIFIED — the account only becomes active once the
    // emailed code is confirmed via /api/auth/verify-email.
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, verification_code, verification_code_expires, auth_method, verified, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, username, email`,
      [username, email, passwordHash, verificationCode, expiresAt, 'email', false, false]
    );

    // Send the 6-digit code so the account can be activated
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Verification code for ${email}: ${verificationCode}`);
    }
    const mailResult = await sendVerificationEmail(email, verificationCode, username);
    if (!mailResult.success) {
      // Roll back the row so the user isn't left trapped in an unverifiable state
      await pool.query('DELETE FROM users WHERE id = $1', [result.rows[0].id]);
      console.error('Failed to send verification email:', mailResult.error || mailResult.message);
      return res.status(500).json({ error: 'Failed to send the verification email. Please try again in a moment.' });
    }

    res.status(201).json({
      message: 'A 6-digit verification code was sent to your email. Enter it below to activate your account.',
      needsVerification: true,
      email,
      username
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify Email Code
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND verified = FALSE',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found or already verified' });
    }

    const user = userResult.rows[0];

    // Check code
    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.verification_code_expires)) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    // Mark as verified
    await pool.query(
      'UPDATE users SET verified = TRUE, email_verified = TRUE, verification_code = NULL, verification_code_expires = NULL WHERE id = $1',
      [user.id]
    );

    // Send welcome email in the background
    sendWelcomeEmail(email, user.username).catch(err => {
      console.error('Failed to send welcome email:', err.message);
    });

    // Generate JWT — the verified user is logged in immediately
    const newToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Email verified successfully',
      token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        rank: user.rank,
        bio: user.bio,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resend the email verification code for a still-unverified account
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND verified = FALSE',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'No pending account found for that email' });
    }

    const user = userResult.rows[0];
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      'UPDATE users SET verification_code = $1, verification_code_expires = $2 WHERE id = $3',
      [code, expiresAt, user.id]
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Resent verification code for ${email}: ${code}`);
    }
    const mailResult = await sendVerificationEmail(email, code, user.username);
    if (!mailResult.success) {
      return res.status(500).json({ error: 'Failed to send the code. Please try again in a moment.' });
    }

    res.json({ message: 'A new verification code was sent to your email. It expires in 10 minutes.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Google OAuth Callback
const googleCallback = async (req, res) => {
  try {
    const { id, email, displayName, photos } = req.user;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [id, email]
    );

    let user = userResult.rows[0];

    if (!user) {
      // Create new user
      const username = displayName.replace(/\s+/g, '').substring(0, 50);
      const avatar = photos && photos[0] ? photos[0].value : null;

      const createResult = await pool.query(
        `INSERT INTO users (username, email, google_id, avatar, verified, email_verified, auth_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email`,
        [username, email, id, avatar, true, true, 'google']
      );

      user = createResult.rows[0];

      // Send welcome email in the background
      sendWelcomeEmail(email, username).catch(err => {
        console.error('Failed to send welcome email:', err.message);
      });
    } else if (!user.google_id) {
      // Link Google to existing email account
      await pool.query(
        'UPDATE users SET google_id = $1 WHERE id = $2',
        [id, user.id]
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Store token in response
    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        rank: user.rank,
        bio: user.bio,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Regular Email Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if verified
    if (!user.verified) {
      return res.status(400).json({ error: 'Please verify your email first', needsVerification: true, email });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        rank: user.rank,
        bio: user.bio,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Google OAuth - Redirect to Google
const googleAuth = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  // Construct redirect URI dynamically based on environment
  let redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!redirectUri) {
    // Build from request headers for production support
    // Always use HTTPS in production
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : (req.protocol || 'http');
    const host = req.get('host');
    redirectUri = `${protocol}://${host}/api/auth/google/callback`;
  }
  
  const scope = 'profile email';
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(googleOAuthUrl);
};

// Google OAuth - Handle Callback
const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${getFrontendBaseUrl()}/login?error=no_code`);
  }

  try {
    // Construct redirect URI dynamically (must match the one sent to Google)
    let redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!redirectUri) {
      // Always use HTTPS in production
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : (req.protocol || 'http');
      const host = req.get('host');
      redirectUri = `${protocol}://${host}/api/auth/google/callback`;
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      console.error('Google token error:', tokenData.error);
      return res.redirect(`${getFrontendBaseUrl()}/login?error=${tokenData.error}`);
    }

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userInfo = await userInfoResponse.json();
    const { id, email, name, picture } = userInfo;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [id, email]
    );

    let user = userResult.rows[0];
    let isNewUser = false;

    if (!user) {
      // Create new user with temporary username
      const tempUsername = `user_${Date.now()}`;

      const createResult = await pool.query(
        `INSERT INTO users (username, email, google_id, avatar, verified, email_verified, auth_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email`,
        [tempUsername, email, id, picture, true, true, 'google']
      );

      user = createResult.rows[0];
      isNewUser = true;

      // Send welcome email in the background
      sendWelcomeEmail(email, name).catch(err => {
        console.error('Failed to send welcome email:', err.message);
      });
    } else if (!user.google_id) {
      // Link Google to existing email account
      await pool.query(
        'UPDATE users SET google_id = $1, verified = TRUE, email_verified = TRUE WHERE id = $2',
        [id, user.id]
      );
    }

    // Determine if user has a custom uploaded avatar (avatar_data) - this takes priority
    const avatarCheck = await pool.query('SELECT avatar_data FROM users WHERE id = $1', [user.id]);
    const hasAvatar = !!(avatarCheck.rows[0] && avatarCheck.rows[0].avatar_data);
    // Only keep Google's avatar URL if the user has NO custom uploaded avatar
    const avatarToShow = hasAvatar ? '' : (user.avatar || '');

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Redirect with token and user data
    const frontendUrl = getFrontendBaseUrl();
    const newUserParam = isNewUser ? '&newUser=true' : '';
    const userData = `&id=${user.id}&username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(avatarToShow)}&hasAvatar=${hasAvatar}&rank=${encodeURIComponent(user.rank || '')}&bio=${encodeURIComponent(user.bio || '')}&points=${user.points || 0}`;
    res.redirect(`${frontendUrl}/auth/success?token=${token}${userData}${newUserParam}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    const frontendUrl = getFrontendBaseUrl();
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

// Update username
const updateUsername = async (req, res) => {
  const { username } = req.body;
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: 'Username must be 3-50 characters' });
    }

    // Check if username already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Update username
    const result = await pool.query(
      'UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, avatar, rank, bio, points',
      [username, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Username updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  verifyEmailCode,
  resendVerificationCode,
  login,
  logout,
  googleCallback,
  googleAuth,
  googleAuthCallback,
  updateUsername
};
