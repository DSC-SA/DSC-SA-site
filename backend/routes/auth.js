const express = require('express');
const router = express.Router();
const { register, verifyEmailCode, login, logout, googleCallback, googleAuth, googleAuthCallback } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Email registration with verification code
router.post('/register', validateRegister, register);
router.post('/verify-email', verifyEmailCode);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Login
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;
