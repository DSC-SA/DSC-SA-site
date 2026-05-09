const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getLeaderboard } = require('../controllers/usersController');
const { verifyToken } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/:userId', getProfile);
router.put('/:userId', verifyToken, updateProfile);

module.exports = router;
