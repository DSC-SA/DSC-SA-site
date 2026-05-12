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

// Simple upload to temp location first, then move to proper folder based on FormData
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: tempStorage,
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

// Upload endpoint - handles FormData with file and folder fields
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload failed: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get folder from form data
    const folder = req.body?.folder || 'uploads';
    const targetDir = path.join(__dirname, '../uploads', folder);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log('✓ Created target upload directory:', targetDir);
    }

    // Move file from temp to target folder
    const targetPath = path.join(targetDir, req.file.filename);
    const tempPath = req.file.path;

    fs.renameSync(tempPath, targetPath);
    
    const filePath = `/uploads/${folder}/${req.file.filename}`;

    console.log('✓ File uploaded successfully', {
      folder: folder,
      filename: req.file.filename,
      path: targetPath,
      filePath: filePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.json({
      message: 'File uploaded successfully',
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
