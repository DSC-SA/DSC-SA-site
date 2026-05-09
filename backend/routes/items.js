const express = require('express');
const router = express.Router();
const { getAllItems, getItemsByCategory, uploadItemImage } = require('../controllers/itemsController');
const multer = require('multer');
const path = require('path');

// Multer config for item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/items'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', getAllItems);
router.get('/category/:category', getItemsByCategory);
router.post('/:id/image', upload.single('image'), uploadItemImage);

module.exports = router;
