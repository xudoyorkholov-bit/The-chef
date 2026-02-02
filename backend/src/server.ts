import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import menuRoutes from './routes/menuRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
// CORS configuration - allow both development and production origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://10.54.8.99:3000',
  'http://10.54.8.99:3001',
  'https://xudoyorkholov-bit.github.io',
  process.env.CORS_ORIGIN
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins from local network
    if (process.env.NODE_ENV === 'development') {
      // Allow localhost and local network IPs
      if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+/)) {
        return callback(null, true);
      }
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'The Chef API is running' });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - GET  /api/menu`);
  console.log(`   - GET  /api/reservations`);
  console.log(`   - POST /api/reservations`);
  console.log(`   - GET  /api/messages`);
  console.log(`   - POST /api/messages`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/gallery`);
  console.log(`   - GET  /api/orders`);
  console.log(`   - POST /api/orders`);
});

export default app;
