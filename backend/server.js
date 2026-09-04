const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { createTables } = require('./db/schema');
const pool = require('./config/database');

const app = express();

app.disable('x-powered-by');

// ---- Security headers (sanitized XSS / clickjacking / MIME sniffing) ----
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // SPA + inline React; CSP handled at CDN if needed
  })
);

// ---- Tight CORS: only allow the known frontend origins. Requests from bots
//      or unknown origins are rejected (no blanket allow-all). ----
const allowedOrigins = (process.env.FRONTEND_URL || 'https://dsc-sa-site-production.up.railway.app')
  .split(',')
  .map((o) => o.trim())
  .concat(['http://localhost:3000', 'http://localhost:3001']);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (curl, health checks, server-to-server) and
    // known frontend origins. Reject everything else.
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ---- Body size caps: reject oversized payloads (DoS protection) ----
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ---- Rate limiting: protect the whole API from abuse/bots ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300, // max 300 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again later.' }
});

// Stricter limiter for auth endpoints (brute-force / credential stuffing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // 20 auth attempts per 15 min per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' }
});

app.use('/api', apiLimiter);

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
app.use('/api/auth', authLimiter, require('./routes/auth'));
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
