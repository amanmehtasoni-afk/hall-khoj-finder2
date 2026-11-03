/**
 * Hall Khoj Finder — Navigation Controller
 * Handles sticky navbar transitions, mobile off-canvas drawer, and mobile bottom bar.
 */

(function initNav() {
  const header = document.querySelector('.site-header');
  const drawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const openDrawerBtn = document.getElementById('open-drawer-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  // Sticky header background on scroll
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile Drawer Toggle
  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeDrawer();
    }
  });

  // Highlight active mobile bottom navigation icon based on current path
  const currentPath = window.location.pathname;
  const bottomNavItems = document.querySelectorAll('.mobile-nav-item');

  bottomNavItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath === href || (href !== '/' && currentPath.endsWith(href)))) {
      item.classList.add('active');
    }
  });
})();
