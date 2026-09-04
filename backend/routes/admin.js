const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Admin login (credentials come from ADMIN_USERNAME/ADMIN_PASSWORD env vars)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.ADMIN_USERNAME || '';
  const expectedPass = process.env.ADMIN_PASSWORD || '';

  if (!expectedUser || !expectedPass) {
    return res.status(500).json({ error: 'Admin credentials are not configured on the server' });
  }

  if (username === expectedUser && password === expectedPass) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Protect admin-only endpoints
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1] || authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired admin token' });
  }
};

// Configure multer for in-memory file uploads (we'll process with sharp)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap (DoS protection)
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
router.post('/upload-hero-image', verifyAdmin, upload.single('image'), async (req, res) => {
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
