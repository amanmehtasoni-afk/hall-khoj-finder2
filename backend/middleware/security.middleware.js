/**
 * Hall Khoj Finder — Enterprise Security & Performance Middleware (Phase 16)
 * Provides Helmet-grade headers, CSP, Rate Limiting, Input Sanitization & Static Caching.
 */

// 1. In-Memory Sliding Window Rate Limiter Store
class MemoryRateLimiter {
  constructor(windowMs = 60000, maxRequests = 100, message = 'Too many requests, please try again later.') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map(); // ip -> { count, resetAt }

    // Periodically evict expired IP windows every 60s
    this.cleanupTimer = setInterval(() => this.cleanup(), 60000);
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.hits.entries()) {
      if (now > record.resetAt) {
        this.hits.delete(ip);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // Allow health, docs, and test bypass
      if (req.path === '/api/health' || req.path === '/health' || req.path === '/robots.txt' || req.path === '/sitemap.xml' || req.headers['x-test-bypass'] === 'true') {
        return next();
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const now = Date.now();
      let record = this.hits.get(ip);

      if (!record || now > record.resetAt) {
        record = { count: 1, resetAt: now + this.windowMs };
        this.hits.set(ip, record);
      } else {
        record.count++;
      }

      const remaining = Math.max(0, this.maxRequests - record.count);
      const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetSeconds);

      if (record.count > this.maxRequests) {
        res.setHeader('Retry-After', resetSeconds);
        return res.status(429).json({
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message: this.message,
          retryAfterSeconds: resetSeconds
        });
      }

      next();
    };
  }
}

// Global API limiter: 300 requests per minute
const globalApiLimiter = new MemoryRateLimiter(
  60000,
  300,
  'Too many API requests from this IP. Please wait a minute before retrying.'
).middleware();

// Sensitive endpoint limiter (Auth, AI, Payments): 100 requests per minute
const sensitiveEndpointLimiter = new MemoryRateLimiter(
  60000,
  100,
  'Too many requests to this sensitive operation. Please wait a minute.'
).middleware();

// 2. Helmet-grade HTTP Security Headers Middleware & HTTPS Enforcement
function forceHttps(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps && req.headers.host && !req.headers.host.includes('localhost') && !req.headers.host.includes('127.0.0.1')) {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  }
  next();
}

function securityHeaders(req, res, next) {
  // Content Security Policy (allows necessary CDNs for Leaflet, Three.js, fonts)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'self';"
  );

  // Standard Defense Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');

  next();
}

// 3. Deep Input Sanitization against XSS & Operator Injection
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/javascript:/gi, '') // Strip javascript: protocol
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '');
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Prevent NoSQL operator injection (disallow keys starting with '$')
    const safeKey = key.startsWith('$') ? key.substring(1) : key;
    if (typeof value === 'string') {
      clean[safeKey] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[safeKey] = sanitizeObject(value);
    } else {
      clean[safeKey] = value;
    }
  }
  return clean;
}

function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}

// 4. Performance: Cache-Control Management
function cacheHeaders(req, res, next) {
  if (req.path.startsWith('/api')) {
    // API responses must never be cached statically
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else if (/\.(css|js|woff2|png|jpg|jpeg|webp|svg|ico)$/i.test(req.path)) {
    // Static assets can be cached for 24 hours with stale-while-revalidate
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  }
  next();
}

module.exports = {
  forceHttps,
  securityHeaders,
  globalApiLimiter,
  sensitiveEndpointLimiter,
  sanitizeInput,
  cacheHeaders,
  MemoryRateLimiter
};
