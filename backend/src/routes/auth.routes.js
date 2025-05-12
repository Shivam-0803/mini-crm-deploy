import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Health check endpoint for Render
router.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Debug endpoint for authentication environment variables
router.get('/debug-env', (req, res) => {
  // Only show this in development or with a specific debug flag
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === 'true') {
    res.json({
      environment: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL,
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
      corsOrigin: process.env.CORS_ORIGIN
    });
  } else {
    res.status(403).json({ message: 'Debug endpoint disabled in production' });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
    session: true
  }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}?auth_success=true`);
  }
);


// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router; 