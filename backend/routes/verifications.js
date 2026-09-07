const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Strict limit: verification submissions are low-volume and human-reviewed.
//   Prevents bots from flooding the moderator queue.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many verification requests. Please try again later.' }
});

const normalizePhone = (raw) => {
  return String(raw || '').replace(/[^\d+]/g, '').trim();
};

const isValidPhone = (phone) => /^\+?\d{8,15}$/.test(phone);

const readOptionalUser = (req) => {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header) return null;
  const token = header.split(' ')[1] || header;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded && typeof decoded.id === 'number' ? decoded : null;
  } catch (err) {
    return null;
  }
};

// Submit an age verification request
router.post('/', submitLimiter, async (req, res) => {
  try {
    const { phone, ageConfirmed } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const clean = normalizePhone(phone);
    if (!isValidPhone(clean)) {
      return res.status(400).json({ error: 'Enter a valid phone number (8-15 digits)' });
    }

    if (ageConfirmed !== true) {
      return res.status(400).json({ error: 'You must confirm you are 18 years or older' });
    }

    const user = readOptionalUser(req);
    const userId = user ? user.id : null;
    const username = user ? (user.username || null) : null;

    const existing = await pool.query(
      `SELECT id, status FROM nsfw_verifications
       WHERE (user_id = $1 OR phone = $2) AND status IN ('pending', 'approved')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, clean]
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      return res.status(200).json({
        status: row.status,
        message:
          row.status === 'approved'
            ? 'You are already verified'
            : 'A verification request is already pending review'
      });
    }

    const insert = await pool.query(
      `INSERT INTO nsfw_verifications (user_id, username, phone, age_confirmed, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, status`,
      [userId, username, clean, true]
    );

    return res.status(201).json({
      status: 'pending',
      message: 'Verification request submitted. A moderator will review your request.'
    });
  } catch (err) {
    console.error('Verification submit error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Check the current user's verification status
router.get('/status', async (req, res) => {
  try {
    const user = readOptionalUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Login required to check verification status' });
    }

    const result = await pool.query(
      `SELECT id, status, created_at, reviewed_at
       FROM nsfw_verifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ status: 'none' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Verification status error:', err.message);
    return res.status(500).json({ error: 'Failed to load verification status' });
  }
});

module.exports = router;