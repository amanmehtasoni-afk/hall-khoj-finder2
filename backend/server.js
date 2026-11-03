/**
 * Hall Khoj Finder — Main Express Server
 * Phase 2: Production REST API, Middleware, Auth, Validation, MongoDB & Firestore Layer.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

// Database Managers
const { connectMongoDB, getMongoStatus, isLiveMongo } = require('./config/mongodb');
const { isLiveFirebase } = require('./config/firebase');
const { syncLocalToMongoDB } = require('./services/firestore.service');

// Middleware
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const {
  securityHeaders,
  globalApiLimiter,
  sensitiveEndpointLimiter,
  sanitizeInput,
  cacheHeaders
} = require('./middleware/security.middleware');

// SEO Service
const { generateSitemapXml, generateRobotsTxt } = require('./services/seo.service');

// Routes
const authRoutes = require('./routes/auth.routes');
const hallsRoutes = require('./routes/halls.routes');
const searchRoutes = require('./routes/search.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const ownersRoutes = require('./routes/owners.routes');
const adminRoutes = require('./routes/admin.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');
const staffRoutes = require('./routes/staff.routes');
const usersRoutes = require('./routes/users.routes');
const categoriesRoutes = require('./routes/categories.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const messagesRoutes = require('./routes/messages.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const paymentsRoutes = require('./routes/payments.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '../frontend');

// 1. Enterprise Security Headers & Performance Caching (Phase 16)
app.use(securityHeaders);
app.use(cacheHeaders);

// 2. CORS & Body Parsers with Request Size Protection
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Deep Input Sanitization against XSS & Operator Injection
app.use(sanitizeInput);

// 4. Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 5. SEO Routes: robots.txt & sitemap.xml (Phase 16)
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(generateRobotsTxt());
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemapXml = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// 6. Production Health Check & Telemetry Endpoints (Phases 16 & 19)
const healthHandler = (req, res) => {
  const mongoStatus = getMongoStatus();
  res.status(200).json({
    status: 'UP',
    name: 'Hall Khoj Finder API',
    tagline: 'Apne Paas Ka Hall, Tent, Car Aur Event Services Ek Jagah Khojiye',
    version: '20.0.0',
    phase: 'Full-Stack Production Ready (MongoDB + Dual Fallback)',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: {
      activeStorage: mongoStatus.connected ? 'MongoDB' : (isLiveFirebase ? 'Firebase' : 'Transactional Local JSON (Fallback)'),
      mongodb: mongoStatus,
      firebase: { connected: isLiveFirebase }
    },
    memoryUsage: {
      rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024))
    }
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Database status & management endpoint
app.get('/api/database/status', (req, res) => {
  return res.json({
    success: true,
    data: {
      mongodb: getMongoStatus(),
      firebase: { connected: isLiveFirebase }
    }
  });
});

app.post('/api/database/sync', async (req, res) => {
  try {
    if (!isLiveMongo()) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB is not currently connected. Please configure MONGODB_URI in .env and ensure MongoDB service is active.'
      });
    }
    await syncLocalToMongoDB();
    return res.json({
      success: true,
      message: 'Local mock & verified listings synced to MongoDB successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Rate Limiting Protection (Phase 16)
// Stricter limiter on sensitive endpoints (auth, AI, payments)
app.use('/api/auth', sensitiveEndpointLimiter);
app.use('/api/payments', sensitiveEndpointLimiter);
app.use('/api/ai', sensitiveEndpointLimiter);

// General API rate limiter
app.use('/api', globalApiLimiter);

// 8. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/payments', paymentsRoutes);

// 9. Serve Static Frontend Files
app.use(express.static(FRONTEND_DIR));

// Fallback for HTML routing
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.get('/synopsis', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'synopsis.html'));
});

app.get('/synopsis.pdf', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'assets', 'Hall_Khoj_Project_Synopsis.pdf'));
});

app.get('/academic-synopsis.pdf', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'assets', 'Hall_Khoj_Academic_Project_Synopsis.pdf'));
});

// 10. 404 for unhandled API routes
app.use('/api', notFoundHandler);

// 11. Central Error Handler
app.use(errorHandler);

// 12. Connect MongoDB and Start Server
let serverInstance = null;

async function startServer() {
  // Connect to MongoDB asynchronously without blocking server boot
  connectMongoDB().then(async (conn) => {
    if (conn) {
      await syncLocalToMongoDB();
    }
  }).catch((err) => {
    console.warn('⚠️ [MongoDB Startup]', err.message);
  });

  serverInstance = app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`✨ HALL KHOJ FINDER — EXPRESS BACKEND RUNNING`);
    console.log(`🌐 Local API Base: http://localhost:${PORT}/api`);
    console.log(`📁 Serving Frontend: ${FRONTEND_DIR}`);
    console.log(`🍃 Database Mode: MongoDB (with JSON local fallback)`);
    console.log(`🚀 Instance Port: ${PORT}`);
    console.log('====================================================');
  });
}

// Backend Crash Protection: Process-level error handling
process.on('uncaughtException', (err) => {
  console.error('💥 [Uncaught Exception]:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [Unhandled Promise Rejection]:', reason);
});

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\n🛑 [Server] Received ${signal}. Starting graceful shutdown...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('✓ [Server] HTTP server closed.');
      try {
        const { mongoose } = require('./config/mongodb');
        if (mongoose.connection.readyState === 1) {
          await mongoose.disconnect();
          console.log('✓ [MongoDB] Database connection closed.');
        }
      } catch (e) {
        console.warn('⚠️ [Shutdown] Error closing database connection:', e.message);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = app;

