const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsBaseDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsBaseDir)) {
  fs.mkdirSync(uploadsBaseDir, { recursive: true });
  console.log('✓ Created uploads directory:', uploadsBaseDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Try to get folder from body, field, or default to 'uploads'
    let folder = req.body?.folder || req.fields?.folder || 'uploads';
    
    console.log('Multer destination called with folder:', folder, 'req.body:', Object.keys(req.body || {}));
    
    const uploadDir = path.join(__dirname, '../uploads', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✓ Created upload subdirectory:', uploadDir);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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

// Upload endpoint
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload failed: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'uploads';
    const filePath = `/uploads/${folder}/${req.file.filename}`;
    const fullPath = req.file.path;

    console.log('✓ File uploaded successfully', {
      folder: folder,
      filename: req.file.filename,
      path: fullPath,
      filePath: filePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Verify file exists
    if (!fs.existsSync(fullPath)) {
      console.error('ERROR: File exists in multer but not found on disk:', fullPath);
      return res.status(500).json({ error: 'File upload failed - file not found after upload' });
    }

    res.json({
      message: 'File uploaded successfully',
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size,
      fullPath: fullPath
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
