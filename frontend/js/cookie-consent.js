/**
 * Hall Khoj Finder — Cookie Consent & Privacy Compliance Engine (Phase 10)
 * Compliant with Indian DPDP Act, GDPR, and CCPA standards.
 * Supports:
 * - Essential (strictly necessary for authentication & state)
 * - Analytics (privacy-preserving usage statistics)
 * - Marketing (promotional preferences)
 * - Event broadcast for privacy-conscious analytics integration
 */

window.HKF_Cookies = (function () {
  const STORAGE_KEY = 'hkf_cookie_consent';

  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function saveConsent(consent) {
    const record = {
      essential: true, // Always true
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {}

    // Dispatch global event for analytics
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: record }));
    hideBanner();
    hideModal();
    return record;
  }

  function injectBannerHTML() {
    if (document.getElementById('hkf-cookie-banner')) return;

    // 1. Inject Stylesheet if not present
    if (!document.querySelector('link[href*="cookie-consent.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/cookie-consent.css';
      document.head.appendChild(link);
    }

    // 2. Banner HTML
    const banner = document.createElement('div');
    banner.id = 'hkf-cookie-banner';
    banner.className = 'hkf-cookie-banner-wrapper';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie Consent Notice');
    banner.innerHTML = `
      <div class="hkf-cookie-content-row">
        <div class="hkf-cookie-text-col">
          <div class="hkf-cookie-title">
            <span>🍪</span> We Value Your Privacy & Event Security
          </div>
          <p class="hkf-cookie-desc">
            We use essential cookies to manage venue bookings, authentication, and 3D walkthroughs. With your consent, we also use privacy-first analytics to improve venue recommendations. Read our <a href="/privacy.html">Privacy Policy</a> and <a href="/terms.html">Terms</a>.
          </p>
        </div>
        <div class="hkf-cookie-actions">
          <button class="hkf-cookie-btn hkf-cookie-btn-accept" id="hkf-cookie-accept-all">
            Accept All
          </button>
          <button class="hkf-cookie-btn hkf-cookie-btn-reject" id="hkf-cookie-reject-optional">
            Reject Optional
          </button>
          <button class="hkf-cookie-btn hkf-cookie-btn-prefs" id="hkf-cookie-open-prefs">
            Customize
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // 3. Modal Preferences HTML
    const modal = document.createElement('div');
    modal.id = 'hkf-cookie-modal';
    modal.className = 'hkf-prefs-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'hkf-prefs-title');
    modal.innerHTML = `
      <div class="hkf-prefs-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 id="hkf-prefs-title" style="font-size:1.35rem; margin:0;">Cookie & Tracking Preferences</h3>
          <button style="background:transparent; border:none; color:inherit; font-size:1.5rem; cursor:pointer;" id="hkf-close-prefs-x" aria-label="Close dialog">&times;</button>
        </div>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.5;">
          Customize which categories of cookies you permit. Essential cookies cannot be disabled as they are required for venue search, login sessions, and mandatory booking approvals.
        </p>

        <!-- Category 1: Essential -->
        <div class="hkf-category-row">
          <div>
            <strong style="display:block; font-size:0.95rem;">Essential Cookies (Strictly Necessary)</strong>
            <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-top:0.25rem;">
              Required for account authentication, 25% advance token payment security, and booking state machine.
            </span>
          </div>
          <label class="hkf-toggle-switch">
            <input type="checkbox" checked disabled>
            <span class="hkf-toggle-slider"></span>
          </label>
        </div>

        <!-- Category 2: Analytics -->
        <div class="hkf-category-row">
          <div>
            <strong style="display:block; font-size:0.95rem;">Analytics & Performance Cookies</strong>
            <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-top:0.25rem;">
              Helps us measure popular venue searches, 3D interaction performance, and page response times anonymously.
            </span>
          </div>
          <label class="hkf-toggle-switch">
            <input type="checkbox" id="hkf-pref-analytics" checked>
            <span class="hkf-toggle-slider"></span>
          </label>
        </div>

        <!-- Category 3: Marketing -->
        <div class="hkf-category-row" style="border-bottom:none;">
          <div>
            <strong style="display:block; font-size:0.95rem;">Marketing & Recommendations</strong>
            <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-top:0.25rem;">
              Enables personalized marriage hall suggestions and seasonal wedding discount alerts.
            </span>
          </div>
          <label class="hkf-toggle-switch">
            <input type="checkbox" id="hkf-pref-marketing">
            <span class="hkf-toggle-slider"></span>
          </label>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:2rem;">
          <button class="hkf-cookie-btn hkf-cookie-btn-reject" id="hkf-save-custom-prefs">
            Save Preferences
          </button>
          <button class="hkf-cookie-btn hkf-cookie-btn-accept" id="hkf-modal-accept-all">
            Accept All
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event Bindings
    document.getElementById('hkf-cookie-accept-all').addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true });
    });

    document.getElementById('hkf-cookie-reject-optional').addEventListener('click', () => {
      saveConsent({ analytics: false, marketing: false });
    });

    document.getElementById('hkf-cookie-open-prefs').addEventListener('click', () => {
      showModal();
    });

    document.getElementById('hkf-close-prefs-x').addEventListener('click', () => {
      hideModal();
    });

    document.getElementById('hkf-save-custom-prefs').addEventListener('click', () => {
      const analytics = document.getElementById('hkf-pref-analytics').checked;
      const marketing = document.getElementById('hkf-pref-marketing').checked;
      saveConsent({ analytics, marketing });
    });

    document.getElementById('hkf-modal-accept-all').addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true });
    });
  }

  function showBanner() {
    const banner = document.getElementById('hkf-cookie-banner');
    if (banner) {
      setTimeout(() => banner.classList.add('visible'), 300);
    }
  }

  function hideBanner() {
    const banner = document.getElementById('hkf-cookie-banner');
    if (banner) banner.classList.remove('visible');
  }

  function showModal() {
    const modal = document.getElementById('hkf-cookie-modal');
    if (modal) {
      const consent = getConsent();
      if (consent) {
        document.getElementById('hkf-pref-analytics').checked = Boolean(consent.analytics);
        document.getElementById('hkf-pref-marketing').checked = Boolean(consent.marketing);
      }
      modal.style.display = 'flex';
    }
  }

  function hideModal() {
    const modal = document.getElementById('hkf-cookie-modal');
    if (modal) modal.style.display = 'none';
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    injectBannerHTML();
    const existing = getConsent();
    if (!existing) {
      showBanner();
    } else {
      // Broadcast existing consent
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: existing }));
    }

    // Attach to any "Cookie Settings" links in footers
    document.querySelectorAll('[data-action="open-cookie-settings"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
      });
    });
  });

  return {
    getConsent,
    saveConsent,
    showPreferences: showModal,
    showBanner
  };
})();
