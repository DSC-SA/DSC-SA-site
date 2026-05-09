const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createTables } = require('./db/schema');
const pool = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files and uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/heroes', require('./routes/heroes'));
app.use('/api/items', require('./routes/items'));
app.use('/api/builds', require('./routes/builds'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/events', require('./routes/events'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// SPA fallback: serve index.html for all non-API routes (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Connected to Koyeb PostgreSQL');

    // Create tables
    await createTables();
    console.log('✓ Database schema initialized');

    // Run migrations
    const { migrateItemsImage } = require('./db/migrate-items-image');
    await migrateItemsImage();

    // Seed all items from 2026 equipment list
    const { seedAllItems } = require('./db/seed-all-items-2026');
    await seedAllItems();

    // Seed verified MLBB data (heroes only)
    const { seedVerifiedData } = require('./db/seed-verified-export');
    await seedVerifiedData();
    console.log('✓ Database seeded with verified MLBB heroes and items');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Frontend should be at http://localhost:3000`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
