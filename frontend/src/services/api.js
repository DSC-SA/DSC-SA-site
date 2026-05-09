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

const API_BASE_URL = getApiBaseUrl();

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to construct full image URLs
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
};

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  verifyEmail: (data) => API.post('/auth/verify-email', data),
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

// Users API
export const usersAPI = {
  getProfile: (userId) => API.get(`/users/${userId}`),
  updateProfile: (userId, data) => API.put(`/users/${userId}`, data),
  getLeaderboard: () => API.get('/users/leaderboard')
};

export const api = API;
