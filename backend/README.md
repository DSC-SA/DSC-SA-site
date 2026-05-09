# DSC-SA Community Hub - Backend

Express.js backend for the DSC-SA MLBB Community platform.

## Setup

### Prerequisites
- Node.js v14+
- PostgreSQL (Koyeb hosted)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your Koyeb database credentials

### Database Setup

Initialize the database schema:
```bash
npm run db:setup
```

Seed initial data (heroes and items):
```bash
npm run db:seed
```

### Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Heroes
- `GET /api/heroes` - Get all heroes
- `GET /api/heroes/:id` - Get hero by ID with builds

### Items
- `GET /api/items` - Get all items
- `GET /api/items/category/:category` - Get items by category

### Builds
- `GET /api/builds/:heroId` - Get all builds for hero
- `POST /api/builds` - Create new user build (auth required)
- `GET /api/builds/:heroId/comments` - Get comments for hero
- `POST /api/builds/comments/:heroId` - Add comment (auth required)

### Comments
- `GET /api/comments/:heroId` - Get all comments
- `POST /api/comments` - Add comment (auth required)
- `DELETE /api/comments/:commentId` - Delete comment (auth required)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (auth required)
- `POST /api/events/:eventId/join` - Join event (auth required)

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile (auth required)

## Database Schema

See `db/schema.js` for full schema definition.

Main tables:
- `users` - User accounts
- `heroes` - MLBB heroes
- `items` - MLBB items
- `recommended_builds` - Official hero builds (3 per hero)
- `user_builds` - Community-submitted builds
- `build_comments` - Discussions on builds
- `events` - Tournaments/events
- `matches` - Match results
