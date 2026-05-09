const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const pool = require('../config/database');

const router = express.Router();

// Configure multer for in-memory file uploads (we'll process with sharp)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    // Accept common image formats only
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/x-icon'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Accepted formats: JPG, PNG, WebP, GIF, SVG, BMP, ICO. You uploaded: ${file.mimetype}`));
    }
  }
});

// Upload hero image with automatic resizing
router.post('/upload-hero-image', upload.single('image'), async (req, res) => {
  try {
    console.log('=== UPLOAD REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? { filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : 'No file');
    
    const { heroId } = req.body;

    if (!heroId || !req.file) {
      console.log('❌ Missing heroId or file');
      return res.status(400).json({ message: 'Hero ID and image are required' });
    }

    // Process image with sharp: resize to fit card aspect ratio (1/1.2 = 400x480px)
    const ext = '.webp'; // Convert all to WebP for optimization
    const filename = `hero-${heroId}${ext}`;
    const filepath = path.join(__dirname, '../uploads/heroes', filename);

    try {
      // Resize and crop image to perfectly fit hero card (400x480px, aspect ratio 1:1.2)
      await sharp(req.file.buffer)
        .resize(400, 480, {
          fit: 'cover', // Center crop if needed
          position: 'center'
        })
        .webp({ quality: 85 }) // Optimize to WebP format
        .toFile(filepath);
      
      console.log('✅ Image processed:', filename);
    } catch (sharpError) {
      console.error('❌ Image processing error:', sharpError);
      return res.status(400).json({ message: 'Failed to process image: ' + sharpError.message });
    }

    // Construct the image URL/path
    const imageUrl = `/uploads/heroes/${filename}`;
    console.log('Image URL:', imageUrl);

    // Update hero with image URL
    console.log('Updating hero ID:', heroId, 'with URL:', imageUrl);
    const result = await pool.query(
      'UPDATE heroes SET icon_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, heroId]
    );

    console.log('Update result rows:', result.rows.length);
    if (result.rows.length === 0) {
      console.log('❌ Hero not found with ID:', heroId);
      return res.status(404).json({ message: 'Hero not found' });
    }

    console.log('✅ Success! Updated hero:', result.rows[0].name);
    res.json({
      message: 'Image uploaded successfully',
      hero: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
});

// Get all heroes (for the select dropdown)
router.get('/heroes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, role, difficulty FROM heroes ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    res.status(500).json({ message: 'Error fetching heroes' });
  }
});

module.exports = router;
