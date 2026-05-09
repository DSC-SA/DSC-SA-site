# DSC-SA Site - Railway.app Deployment Guide

## Single Service Setup ✓

Your app will run **one service** on Railway:
- **Backend** (Express.js) on the main process
- **Frontend** (React) built and served from `backend/public/`
- Single Node process handles everything

## What Happens on Deploy

```
Railway receives code push
  ↓
Runs: npm run build:full && npm start (from Procfile)
  ↓
  ├─ Build frontend (Vite)
  ├─ Install backend deps
  ├─ Copy frontend dist → backend/public
  └─ Start Express server
  ↓
Your app live at: https://your-app.railway.app
```

## Deploy Steps

### 1. Create Railway Account
- Go to **railway.app**
- Sign in with GitHub (easier)

### 2. Create New Project
- Click **+ New Project**
- Select **Deploy from GitHub**
- Connect your GitHub account
- Select **DSC_WEB** repository
- Select `main` branch

### 3. Configure Service
Railway auto-detects Node.js from `package.json` and `Procfile`. It should work automatically!

### 4. Set Environment Variables
Go to **Variables** tab and add:

```
DB_HOST=your_koyeb_postgres_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=8000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=https://your-app.railway.app
EMAIL_USER=dawnspherecommunity@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Deploy
- Click **Deploy** 
- Railway will build and start your app
- Once you see `✓ Server running on port 8000`, you're live!

## Getting Your Railway URL

After deployment:
1. Go to **Settings** → **Domain**
2. You'll see your public URL (e.g., `dsc-web-production.railway.app`)
3. Update `FRONTEND_URL` env var with this URL
4. Redeploy

## Free vs Paid on Railway

- **Free tier:** $5 free credits/month = ~500 hours
- **After free credits:** Pay-as-you-go (~$0.10/hour when running)
- **Database:** Included (no extra cost)

## Monitoring

- Check **Logs** for errors
- View **Metrics** for CPU/Memory usage
- Set up webhooks for deploy notifications

## Troubleshooting

**Build fails?**
- Check Node version (18.x or 20.x)
- Verify frontend builds locally: `cd frontend && npm install && npm run build`
- Check Railway logs for errors

**App crashes?**
- View logs in Railway dashboard
- Check database connection
- Verify all environment variables are set

**Frontend not showing?**
- Verify `backend/public` has files after build
- Check browser console for errors
- Ensure `FRONTEND_URL` matches your Railway domain

---

That's it! Railway handles everything. Deploy and go! 🚀

