import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ກວດ JWT_SECRET ກ່ອນເລີ່ມ server
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long');
}

// ປິດ header ທີ່ບອກວ່າໃຊ້ Express
app.disable('x-powered-by');

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

// ຈຳກັດຂະໜາດ JSON body
app.use(express.json({ limit: '100kb' }));

// Log request
app.use(morgan('dev'));

// Rate limit ສຳລັບ auth/login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 ນາທີ
  max: 20, // ສູງສຸດ 20 requests ຕໍ່ 15 ນາທີ
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Please try again later.'
  }
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Unitel Smart Connect API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'ຂໍ້ມູນຊ້ຳກັນ'
    });
  }

  res.status(status).json({
    message: isProd && status >= 500
      ? 'Server error'
      : err.message || 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});