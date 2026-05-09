# DSC-SA Site - Koyeb Deployment Guide

## Single Service Setup ✓

Your app will run **one service** on Koyeb:
- **Backend** (Express.js) on the main process
- **Frontend** (React) built and served from `backend/public/`
- Single Node process handles everything

## What Happens on Deploy

```
Koyeb receives code push
  ↓
Runs: npm run build:full && npm start
  ↓
  ├─ Build frontend (Vite)
  ├─ Install backend deps
  ├─ Copy frontend dist → backend/public
  └─ Start Express server
  ↓
Your app live at: https://your-app.koyeb.app
```

## Environment Variables for Koyeb

Go to your Koyeb service → **Environment** and set:

```
DB_HOST=your_koyeb_postgres_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=8000
NODE_ENV=production
JWT_SECRET=your_secure_random_key
FRONTEND_URL=https://your-app.koyeb.app
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

## Deploy Steps

1. **Push to GitHub** - Ensure this repo is on GitHub
2. **Connect Koyeb** - Koyeb Dashboard → New Service → GitHub → Select this repo
3. **Set Environment** - Add all vars above
4. **Deploy** - Click Deploy, watch logs
5. **Done** - App live when you see `✓ Server running on port 8000`

## Local Testing

Before deploying, test locally with production setup:

```bash
npm run build:full
npm start
# Visit: http://localhost:8000
```

## Project Structure

```
/ (root)
├── Procfile           ← Koyeb build command
├── package.json       ← Root scripts
├── scripts/
│   └── copy-frontend.js ← Copies dist to backend/public
├── backend/
│   ├── public/        ← Frontend files go here
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── dist/          ← Built here, copied to backend/public
    ├── src/
    └── package.json
```

## Troubleshooting

**Build fails?**
- Check Node version (18.x or 20.x)
- Verify frontend builds locally: `cd frontend && npm install && npm run build`

**Frontend not showing?**
- Check browser console for errors
- Verify `backend/public` has files after build
- Check server.js log for SPA fallback

**API calls failing?**
- Verify database credentials in env vars
- Check `FRONTEND_URL` matches your Koyeb domain
- Look at server logs for database errors

**Upload errors?**
- Koyeb instances restart, so `/uploads` won't persist
- Use external storage (AWS S3) for production uploads

---

That's it! One slot, one service, everything together. 🚀
