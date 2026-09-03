const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createTables } = require('./db/schema');
const pool = require('./config/database');

const app = express();

// Middleware
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000', 'http://localhost:3001'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      callback(null, true);
    } else {
      callback(null, true); // Allow for now, can be more restrictive later
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files and uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Content-hashed build assets (JS/CSS under /assets/*) are immutable: cache long,
// so returning users never re-download old bundles. index.html is served by the
// SPA fallback below with no-cache so the browser always fetches the newest shell
// (whose hashed asset references always exist on the server).
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '365d',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        // Index must be revalidated every visit to avoid stale-hash blank pages.
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  })
);

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

// SPA fallback: serve index.html for all non-API routes (React Router).
// Memoized to avoid re-reading from disk on each request.
const indexFile = path.join(__dirname, 'public', 'index.html');
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexFile);
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

    const { migrateItemsImageData } = require('./db/migrate-items-image-data');
    await migrateItemsImageData();

    const { migrateHeroesStats } = require('./db/migrate-heroes-stats');
    await migrateHeroesStats();

    const { addAvatarDataToUsers } = require('./db/migrate-add-avatar-data');
    await addAvatarDataToUsers();

    // Seed all items from 2026 equipment list
    const { seedAllItems } = require('./db/seed-items-official');
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
