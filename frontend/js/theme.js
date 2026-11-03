/**
 * Hall Khoj Finder — Enterprise Theme Controller (Dark / Light Mode)
 * Features:
 * - Immediate zero-flash theme application from localStorage or OS prefers-color-scheme
 * - Global event delegation ensuring dynamic buttons always work
 * - Cross-tab synchronization via storage events
 * - Dynamic mobile browser address bar color (<meta name="theme-color">)
 * - Custom 'themeChanged' event broadcast for 3D canvas, maps, and charts
 */

(function initTheme() {
  const STORAGE_KEY = 'hkf_theme';
  const TOGGLE_SELECTOR = '[data-action="toggle-theme"], .theme-toggle-btn, #theme-toggle, .theme-toggle, [data-theme-toggle]';

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (e) {
      // Storage unavailable (e.g. private browsing restrictions)
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default to Cinematic Midnight Navy Dark
  }

  function updateMetaThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#071426' : '#FFFFFF');
  }

  function updateToggleButtons(theme) {
    const isDark = theme === 'dark';
    const titleText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    document.querySelectorAll(TOGGLE_SELECTOR).forEach(btn => {
      btn.setAttribute('aria-label', titleText);
      btn.setAttribute('title', titleText);

      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');

      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'inline-block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'inline-block';
      } else if (!btn.children.length || btn.textContent.trim() === '☀️' || btn.textContent.trim() === '🌙') {
        btn.textContent = isDark ? '☀️' : '🌙';
      }
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    updateMetaThemeColor(theme);
    updateToggleButtons(theme);

    // Notify listeners (maps, 3D WebGL renderer, charts)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  // 1. Apply immediately to prevent FOUC (Flash of Unstyled Content)
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // 2. Global Public API
  window.HKF_Theme = {
    get: () => document.documentElement.getAttribute('data-theme') || 'dark',
    set: (theme) => {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
      applyTheme(theme);
    },
    toggle: () => {
      const current = window.HKF_Theme.get();
      const next = current === 'dark' ? 'light' : 'dark';
      window.HKF_Theme.set(next);
      return next;
    }
  };

  // 3. Global Delegated Click Listener (Works for both static & dynamically rendered buttons)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(TOGGLE_SELECTOR);
    if (btn) {
      e.preventDefault();
      window.HKF_Theme.toggle();
    }
  });

  // 4. Sync on DOM Content Loaded
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(window.HKF_Theme.get());
  });

  // 5. Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
      applyTheme(e.newValue);
    }
  });

  // 6. Listen for OS theme changes if user has no manual override
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleOSChange = (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      } catch (err) {}
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleOSChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleOSChange);
    }
  }
})();
