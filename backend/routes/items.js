const express = require('express');
const router = express.Router();
const { getAllItems, getItemsByCategory, uploadItemImage, getItemImage } = require('../controllers/itemsController');
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');

// Use memory storage - don't save to disk, send directly to database
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

router.get('/', getAllItems);
router.get('/category/:category', getItemsByCategory);
router.post('/:id/image', upload.single('image'), uploadItemImage);
router.get('/:id/image', getItemImage);

module.exports = router;
