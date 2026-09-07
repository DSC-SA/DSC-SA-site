const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { createTables } = require('./db/schema');
const pool = require('./config/database');

const app = express();

app.disable('x-powered-by');

// Trust exactly one proxy hop (Railway's edge) so req.protocol/req.secure and
// rate-limit IPs reflect reality without being spoofable permissively.
app.set('trust proxy', 1);

// ---- Force HTTPS: redirect any plain-http request to the https:// URL so the
//      address bar never shows an insecure connection. ----
app.use((req, res, next) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  if (proto !== 'https') {
    const host = req.headers.host || req.get('host');
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  next();
});

// ---- Security headers (sanitized XSS / clickjacking / MIME sniffing) ----
// CSP: script-src is 'self' only — the Vite bundle ships as external hashed files
// with no inline scripts, so any injected <script> (even if it slipped past the
// sanitizers) is blocked by the browser. Styles allow inline attributes (Tailwind
// + React style props); images/media may come from user-supplied https URLs.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        mediaSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })
);

// ---- CORS: the SPA is served by this backend, so same-origin browser
//      requests must be accepted on ANY domain it is live at (custom domains,
//      *.up.railway.app, localhost). Also allow explicitly configured
//      FRONTEND_URL origins and local development. Truly foreign cross-origin
//      requests are rejected (no blanket allow-all). ----
const localDevOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const explicitOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
  .concat(localDevOrigins);

const corsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use((req, res, next) => {
  cors({
    ...corsOptions,
    origin(origin, callback) {
      // Non-browser requests (curl, health checks, server-to-server) pass.
      if (!origin || origin === 'null') return callback(null, true);
      if (explicitOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV === 'development') return callback(null, true);
      // Same-origin check: the SPA is hosted behind the request Host, so any
      // origin that matches the request host is our own frontend.
      const originHost = origin.replace(/^https?:\/\//i, '');
      if (originHost === (req.headers.host || '')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
  })(req, res, next);
});

// ---- Body size caps: reject oversized payloads (DoS protection) ----
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ---- Rate limiting: protect the whole API from abuse/bots ----
// Generous per-IP limit: the gallery/pages issue many read requests, and mobile
// CGNAT networks share public IPs across many users (300 was too tight and
// produced false 429s that broke heroes/events/matches for legit users).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1500, // max 1500 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again later.' }
});

// Auth is Google OAuth only (Google itself handles brute-force protection), so
// the per-IP limit mainly deters scripts hammering the callback endpoint.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60, // 60 auth attempts per 15 min per IP
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
      if (filePath.endsWith('index.html') || filePath.endsWith('robots.txt') || filePath.endsWith('sitemap.xml')) {
        // Index, robots.txt and sitemap.xml must be revalidated every visit so
        // content/optimization changes propagate promptly (no immutable cache).
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
app.use('/api/verifications', require('./routes/verifications'));
app.use('/api/meta', require('./routes/meta'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// SPA fallback: serve index.html for browser routes (React Router).
// Missing hashed assets (/assets/*) and unmatched API endpoints must return
// a real 404 instead of index.html: serving HTML where a JS/CSS file is
// expected lets caching layers poison a visitor's cache for the lifetime of
// that URL (the hashed assets are served immutable for one year).
const indexFile = path.join(__dirname, 'public', 'index.html');
app.get('*', (req, res) => {
  const { path: reqPath } = req;
  if (reqPath.startsWith('/assets/')) {
    return res.status(404).type('text/plain').send('Not found');
  }
  if (reqPath.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexFile);
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Ensure upload directories exist (gitignored, so missing after each deploy)
    fs.mkdirSync(path.join(__dirname, 'uploads', 'heroes'), { recursive: true });

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

    // Add hero image columns to existing heroes table (if not present)
    const { migrateHeroImages } = require('./db/migrate-hero-images');
    await migrateHeroImages();

    // Seed all items from 2026 equipment list
    const { seedAllItems } = require('./db/seed-items-official');
    await seedAllItems();

    // Seed verified MLBB data (heroes only)
    const { seedVerifiedData } = require('./db/seed-verified-export');
    await seedVerifiedData();
    console.log('✓ Database seeded with verified MLBB heroes and items');

    // Refresh the current-meta snapshot (live source with bundled fallback)
    const { refreshMeta, REFRESH_INTERVAL_MS } = require('./services/metaService');
    await refreshMeta();
    setInterval(refreshMeta, REFRESH_INTERVAL_MS);

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
