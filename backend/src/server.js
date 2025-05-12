import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import segmentRoutes from './routes/segment.routes.js';
import deliveryReceiptRoutes from './routes/delivery-receipt.routes.js';
import aiRoutes from './routes/ai.routes.js';

// Import passport configuration
import './config/passport.js';

// Import seed function
import { seedCustomers } from './utils/seed-customers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS based on environment
const allowedOrigins = [
  'http://localhost:5173', // Development frontend
  'http://localhost:5174', // Additional development frontend port
  'https://mini-crm-frontend-yt2n.onrender.com', // Production frontend
];

// Simplified CORS configuration
app.use(cors({
  origin: ['https://mini-crm-frontend-yt2n.onrender.com', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // time period in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none',
    path: '/'
  },
  name: 'bolt.sid' // Custom session cookie name
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware (only in development)
if (process.env.NODE_ENV === 'development') {
app.use((req, res, next) => {
  console.log('=== Debug Info ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Cookies:', req.cookies);
  console.log('================');
  next();
});
}

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/delivery-receipts', deliveryReceiptRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  // ssl: false,
  // tls: false
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Seed customers data if needed
    seedCustomers().catch(err => {
      console.error('Error seeding customers:', err);
    });
    
    // Start server
    const PORT = process.env.PORT || 3001;
    console.log(`Starting server on port ${PORT}...`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
}); 