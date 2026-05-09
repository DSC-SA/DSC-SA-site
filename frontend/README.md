# DSC-SA Community Hub - Frontend

React + Vite frontend for the DSC-SA MLBB Community platform.

## Features

- Hero browsing with role filters
- Hero build recommendations (official + community)
- Community build creation and sharing
- Discussion comments on hero pages
- User authentication
- Community events
- Gaming-focused dark theme

## Setup

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (if needed):
```bash
VITE_API_URL=http://localhost:5000/api
```

### Running

Development mode (with hot reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:5000`

## Project Structure

```
src/
├── pages/           # Route pages
├── components/      # Reusable components
├── services/        # API integration
├── context/         # Auth context
├── styles/          # Global CSS
└── App.jsx         # Main app component
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Gaming Theme** - Dark purple/cyan aesthetic

## Key Pages

- `/` - Home page with featured heroes and events
- `/heroes` - All heroes with role filters
- `/heroes/:id` - Hero detail with builds and comments
- `/events` - Community events
- `/login` - User login
- `/register` - User registration

## API Integration

All API calls go through `src/services/api.js` which handles:
- Authentication (JWT tokens)
- Request/response interceptors
- Error handling

Token is stored in localStorage and automatically added to requests.
