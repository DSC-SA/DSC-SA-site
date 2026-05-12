const express = require('express');
const router = express.Router();
const { getProfile, getProfileAvatar, updateProfile, getLeaderboard } = require('../controllers/usersController');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');

// Use memory storage - don't save to disk
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow only images
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/leaderboard', getLeaderboard);
router.get('/:userId/avatar', getProfileAvatar);
router.get('/:userId', getProfile);
router.put('/:userId', verifyToken, upload.single('avatar'), updateProfile);

module.exports = router;
