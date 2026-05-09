# DSC-SA Community Hub

A comprehensive web platform for the DSC-SA Mobile Legends: Bang Bang community featuring hero builds, tournaments, and community discussions.

## Project Structure

```
dsc-sa-site/
├── backend/                    # Express.js backend
│   ├── config/                 # Database config
│   ├── controllers/            # Route handlers
│   ├── models/                 # Data models
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth, validation
│   ├── db/                     # Schema, seeds
│   ├── server.js              # Main server
│   ├── package.json           # Dependencies
│   └── README.md              # Backend docs
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Route pages
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client
│   │   ├── context/           # Auth state
│   │   ├── styles/            # CSS
│   │   ├── App.jsx            # Router setup
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md              # Frontend docs
│
└── README.md                   # This file
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run db:seed
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Features

✅ **Hero Database** - 12+ MLBB heroes with role, stats, descriptions
✅ **Hero Builds** - 3 official recommended builds per hero
✅ **Community Builds** - Users can create and share custom builds
✅ **Item System** - Complete MLBB item database with categories
✅ **Build Comments** - Discussion section on each hero page
✅ **User Authentication** - Secure login/register with JWT
✅ **Events Management** - Create and join tournaments
✅ **Dark Gaming Theme** - Purple/cyan aesthetic with glassmorphism

## Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (Koyeb hosted)
- JWT authentication
- Joi validation

**Frontend:**
- React 18
- Vite build tool
- React Router
- Tailwind CSS
- Axios

## Database

Hosted on **Koyeb PostgreSQL**

### Connection Details
```
Host: ep-spring-hall-al6pkdt1.c-3.eu-central-1.pg.koyeb.app
Database: koyebdb
User: koyeb-adm
```

### Main Tables
- `users` - User accounts with authentication
- `heroes` - MLBB heroes (12 initial)
- `items` - MLBB items (25+ initial)
- `recommended_builds` - Official builds (3 per hero)
- `user_builds` - Community submissions
- `build_comments` - Discussions
- `events` - Tournaments/events
- `matches` - Match results

## API Endpoints

See [backend/README.md](backend/README.md) for full API documentation

### Core Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/heroes` - List all heroes
- `GET /api/heroes/:id` - Hero with builds
- `POST /api/builds` - Create user build
- `GET /api/builds/:heroId` - Get all builds for hero
- `POST /api/comments` - Add comment

## Getting Help

- **Backend Issues** - Check `backend/README.md`
- **Frontend Issues** - Check `frontend/README.md`
- **Database Issues** - Check Koyeb dashboard

## Deployment

Both frontend and backend are deployed on **Koyeb**

### Deploy Backend
1. Push to GitHub
2. Connect Koyeb service to GitHub repo
3. Set environment variables
4. Deploy

### Deploy Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to Koyeb

## Future Features

- [ ] Live tournament brackets
- [ ] Player statistics tracking
- [ ] Leaderboards
- [ ] Video guide integration
- [ ] Mobile app
- [ ] Real-time chat

## License

MIT License - Feel free to fork and modify
