/**
 * Hall Khoj Finder — Accessible Modal Controller
 * Handles opening, closing, escape key, and backdrop click for all modals.
 */

window.HallKhojModals = (function () {
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first interactive element inside modal
    const focusable = modal.querySelector('input, button:not(.modal-close-btn), textarea, [tabindex="0"]');
    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    // Close button listeners
    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = btn.closest('.modal-backdrop');
        if (modal) closeModal(modal);
      });
    });

    // Backdrop click listener
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Escape key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.open');
        if (activeModal) {
          closeModal(activeModal);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    open: openModal,
    close: closeModal
  };
})();
