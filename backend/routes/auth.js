const express = require('express');
const router = express.Router();
const { googleAuth, googleAuthCallback } = require('../controllers/authController');

// Authentication is handled exclusively through Google OAuth.
// There is no email/password account system.

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

module.exports = router;
