import axios from 'axios';

// Auto-detect API base URL at runtime
// In production: uses the same domain as the frontend
// In development: uses the env var or localhost
const getApiBaseUrl = () => {
  // If explicitly set via env var, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If in development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // In production, use current domain (since backend and frontend are on same domain)
  return window.location.origin;
};

// Get the base URL for static files (without /api suffix)
const getStaticBaseUrl = () => {
  // If explicitly set via env var, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If in development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // In production, use current domain
  return window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();
const STATIC_BASE_URL = getStaticBaseUrl();

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage for request to:', config.url);
  }
  return config;
});

// Log responses for debugging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Auth error:', { status: error.response.status, data: error.response.data });
    }
    return Promise.reject(error);
  }
);

// Helper to construct full image URLs — hardened against javascript:/data: schemes
// so user-supplied URL fields can never execute script when put in src/attributes.
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  const p = String(relativePath).trim();
  if (!p) return null;

  // Only http/https absolute URLs or same-site relative paths are allowed.
  let isValid = /^https?:\/\//i.test(p);
  if (!isValid && p.startsWith('/')) isValid = !p.startsWith('//');
  if (!isValid) return null;

  // Add cache-busting query param to ensure fresh image loads
  const cacheBuster = `?t=${Date.now()}`;
  const fullUrl = `${p.startsWith('/') ? STATIC_BASE_URL : ''}${p}${p.includes('?') ? '&' : cacheBuster}`;
  return fullUrl;
};

// Helper to construct hero image URLs served from the database
export const getHeroImageUrl = (heroId) => {
  return `${STATIC_BASE_URL}/api/heroes/${heroId}/image?t=${Date.now()}`;
};

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  verifyEmail: (data) => API.post('/auth/verify-email', data),
  resendCode: (data) => API.post('/auth/resend-code', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout')
};

// Heroes API
export const heroesAPI = {
  getAll: () => API.get('/heroes'),
  getById: (id) => API.get(`/heroes/${id}`)
};

// Items API
export const itemsAPI = {
  getAll: () => API.get('/items'),
  getByCategory: (category) => API.get(`/items/category/${category}`)
};

// Builds API
export const buildsAPI = {
  getForHero: (heroId) => API.get(`/builds/${heroId}`),
  create: (data) => API.post('/builds', data),
  getComments: (heroId) => API.get(`/builds/${heroId}/comments`),
  addComment: (heroId, data) => API.post(`/builds/comments/${heroId}`, data)
};

// Comments API
export const commentsAPI = {
  getForHero: (heroId) => API.get(`/comments/${heroId}`),
  add: (data) => API.post('/comments', data),
  like: (commentId) => API.post(`/comments/${commentId}/like`),
  reply: (commentId, data) => API.post(`/comments/${commentId}/reply`, data),
  delete: (commentId) => API.delete(`/comments/${commentId}`)
};

// Events API
export const eventsAPI = {
  getAll: () => API.get('/events'),
  create: (data) => API.post('/events', data),
  join: (eventId, data) => API.post(`/events/${eventId}/join`, data),
  delete: (eventId) => API.delete(`/events/${eventId}`)
};

// Matches API
export const matchesAPI = {
  getAll: () => API.get('/matches'),
  create: (data) => API.post('/matches', data),
  delete: (matchId) => API.delete(`/matches/${matchId}`)
};

// Current-meta API (cached snapshot refreshed from a live source)
export const metaAPI = {
  getAll: () => API.get('/meta')
};

// Users API
export const usersAPI = {
  getProfile: (userId) => API.get(`/users/${userId}`),
  updateProfile: (userId, data) => API.put(`/users/${userId}`, data),
  getLeaderboard: () => API.get('/users/leaderboard')
};

// Age verification API
export const verificationAPI = {
  submit: (data) => API.post('/verifications', data),
  getStatus: () => API.get('/verifications/status')
};

export const api = API;
