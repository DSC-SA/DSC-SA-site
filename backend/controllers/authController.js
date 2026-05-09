const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');

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

    // Create user (not verified yet)
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, verification_code, verification_code_expires, auth_method)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email`,
      [username, email, passwordHash, verificationCode, expiresAt, 'email']
    );

    // Send verification email
    await sendVerificationEmail(email, verificationCode, username);

    res.status(201).json({
      message: 'Registration initiated. Check your email for verification code.',
      userId: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email
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

    // Send welcome email
    await sendWelcomeEmail(email, user.username);

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
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

      // Send welcome email
      await sendWelcomeEmail(email, username);
    } else if (!user.google_id) {
      // Link Google to existing email account
      await pool.query(
        'UPDATE users SET google_id = $1 WHERE id = $2',
        [id, user.id]
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Store token in response
    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
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
      return res.status(400).json({ error: 'Please verify your email first' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
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
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
  const scope = 'profile email';
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(googleOAuthUrl);
};

// Google OAuth - Handle Callback
const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',
        code,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${tokenData.error}`);
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

    if (!user) {
      // Create new user
      const username = name.replace(/\s+/g, '').substring(0, 50);

      const createResult = await pool.query(
        `INSERT INTO users (username, email, google_id, avatar, verified, email_verified, auth_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email`,
        [username, email, id, picture, true, true, 'google']
      );

      user = createResult.rows[0];

      // Send welcome email
      await sendWelcomeEmail(email, username);
    } else if (!user.google_id) {
      // Link Google to existing email account
      await pool.query(
        'UPDATE users SET google_id = $1, verified = TRUE, email_verified = TRUE WHERE id = $2',
        [id, user.id]
      );
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Redirect with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&username=${user.username}&email=${user.email}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

module.exports = {
  register,
  verifyEmailCode,
  login,
  logout,
  googleCallback,
  googleAuth,
  googleAuthCallback
};
