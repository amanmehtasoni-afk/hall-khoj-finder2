/**
 * Hall Khoj Finder — Client-Side Error Monitoring & Crash Reporter (Phase 21)
 * Captures unhandled exceptions and unhandled promise rejections with safe sanitized context.
 */

(function initErrorMonitoring() {
  const SENTRY_DSN = window.SENTRY_DSN || ''; // Placeholder for production Sentry DSN

  function logError(type, payload) {
    const errorRecord = {
      type,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...payload
    };

    // Print readable diagnostic in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn(`🛡️ [Error Monitor] ${type}:`, payload.message || payload);
    }

    // In production with Sentry:
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(payload.error || new Error(payload.message));
    }
  }

  // 1. Global JS Runtime Errors
  window.addEventListener('error', (event) => {
    logError('runtime_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack ? event.error.stack.slice(0, 500) : null
    });
  });

  // 2. Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError('unhandled_rejection', {
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack ? event.reason.stack.slice(0, 500) : null
    });
  });
})();
