import axios from 'axios';

// Determine the base URL based on environment
const getBaseUrl = () => {
  // If the VITE_API_URL environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use production URL with Render.com domain
  if (import.meta.env.PROD) {
    return 'https://mini-crm-backend-cb6s.onrender.com';
  }

  // Default to localhost for development
  return 'http://localhost:3001';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error);
    
    // Only redirect to login for 401 errors if we're not already on the login page
    // and not trying to check authentication status
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('login') && 
        !error.config.url.includes('/auth/me')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 