/**
 * Hall Khoj Finder — Theme Controller (Dark / Light Mode)
 * Supports:
 * - Immediate zero-flash theme application from localStorage or OS prefers-color-scheme
 * - Persistent switching across all pages
 * - Dynamic SVG icon updates on all theme toggle buttons
 */

(function initTheme() {
  const STORAGE_KEY = 'hkf_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default to Cinematic Midnight Navy Dark
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    // Update toggle icons
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
        }
      }
    });
  }

  // Apply immediately before DOM render to eliminate flash
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Expose global controller
  window.HKF_Theme = {
    get: () => document.documentElement.getAttribute('data-theme') || 'dark',
    set: (theme) => {
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    },
    toggle: () => {
      const current = window.HKF_Theme.get();
      const next = current === 'dark' ? 'light' : 'dark';
      window.HKF_Theme.set(next);
      return next;
    }
  };

  // Wire up toggles on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(window.HKF_Theme.get());
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.HKF_Theme.toggle();
      });
    });
  });
})();
