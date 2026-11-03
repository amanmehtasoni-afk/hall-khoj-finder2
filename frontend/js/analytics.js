/**
 * Hall Khoj Finder — Privacy-Conscious Web Analytics (Phase 11)
 * Tracks engagement, conversions, device category & CTA interactions.
 * Strictly respects user cookie preferences (Phase 10 integration).
 */

window.HKF_Analytics = (function () {
  const GA_ID = window.GA_MEASUREMENT_ID || 'G-HKF2026VENUE'; // Placeholder for live GA4 ID
  let hasConsent = false;
  const eventQueue = [];

  // Determine Device Category
  function getDeviceCategory() {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Check consent from Cookie Consent Engine
  function checkConsent() {
    if (window.HKF_Cookies) {
      const consent = window.HKF_Cookies.getConsent();
      hasConsent = Boolean(consent && consent.analytics);
    }
    return hasConsent;
  }

  // Initialize or flush queue
  function init() {
    checkConsent();

    // Listen for consent updates
    window.addEventListener('cookieConsentUpdated', (e) => {
      hasConsent = Boolean(e.detail && e.detail.analytics);
      if (hasConsent) {
        flushQueue();
      }
    });

    // Track initial page view
    trackPageView();

    // Track CTA clicks automatically via event delegation
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const isCta = target.classList.contains('btn-primary') ||
                    target.classList.contains('btn-gold') ||
                    target.getAttribute('data-cta') ||
                    (target.getAttribute('href') && (
                      target.getAttribute('href').includes('booking') ||
                      target.getAttribute('href').includes('tel:') ||
                      target.getAttribute('href').includes('wa.me')
                    ));

      if (isCta) {
        trackEvent('cta_click', {
          ctaText: target.textContent.trim().slice(0, 50),
          ctaHref: target.getAttribute('href') || 'button_action',
          location: window.location.pathname
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formId = form.id || form.getAttribute('name') || 'unnamed_form';
      trackEvent('form_submission', {
        formId,
        page: window.location.pathname
      });
    });
  }

  function trackEvent(eventName, params = {}) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      device: getDeviceCategory(),
      referrer: document.referrer || 'direct',
      ...params
    };

    if (!hasConsent) {
      // If user hasn't accepted yet, queue only non-PII events temporarily
      if (eventQueue.length < 20) eventQueue.push(payload);
      return;
    }

    // In production with GA4:
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }

    // Internal telemetry log
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`📊 [Analytics] ${eventName}:`, payload);
    }
  }

  function trackPageView(pageTitle = document.title) {
    trackEvent('page_view', {
      title: pageTitle,
      url: window.location.href
    });
  }

  function flushQueue() {
    while (eventQueue.length > 0) {
      const item = eventQueue.shift();
      if (typeof window.gtag === 'function') {
        window.gtag('event', item.event, item);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    trackEvent,
    trackPageView,
    hasConsent: () => hasConsent
  };
})();
