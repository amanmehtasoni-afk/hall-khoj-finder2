/**
 * Hall Khoj Finder — Core Application Runtime
 * Includes: Global Toast Notifications, 3D Card Tilt System, Sample Verified Listings Data & Utilities.
 */

// 1. Toast Notification System
window.showToast = function (message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  `;

  if (type === 'success') {
    iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `;
  } else if (type === 'error') {
    iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  }

  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.65rem;">
      ${iconSvg}
      <span>${message}</span>
    </div>
    <button style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:0 0.25rem;" aria-label="Dismiss">&times;</button>
  `;

  const dismissBtn = toast.querySelector('button');
  dismissBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
};

// 2. Interactive 3D Card Tilt & Sheen System
function init3DCardTilt() {
  // Check if reduced motion is requested
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.card-3d');

  cards.forEach(card => {
    // Add Sheen element if not present
    if (!card.querySelector('.card-sheen')) {
      const sheen = document.createElement('div');
      sheen.className = 'card-sheen';
      card.appendChild(sheen);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit max tilt rotation to 8 degrees for smooth elegance
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// 3. Sample Verified Database for Phase 1 Frontend Showcase
window.HKF_DATABASE = {
  halls: [
    {
      id: 'h-101',
      name: 'The Royal Grand Heritage Palace',
      type: 'Marriage Hall',
      city: 'Lucknow',
      area: 'Gomti Nagar',
      state: 'Uttar Pradesh',
      pin: '226010',
      distance: '2.4 km',
      startingPrice: 65000,
      capacityMin: 200,
      capacityMax: 1200,
      rating: 4.9,
      reviewCount: 148,
      verified: true,
      has3DModel: true,
      coverImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      facilities: ['Central AC', 'Lawn (25,000 sq ft)', 'Parking (150 Cars)', 'Generator Backup', 'Bridal Suite', 'In-house Decor'],
      availability: {
        '2026-10-15': 'AVAILABLE',
        '2026-10-16': 'PENDING',
        '2026-10-17': 'BOOKED',
        '2026-10-18': 'BLOCKED',
        '2026-10-19': 'AVAILABLE',
        '2026-10-20': 'AVAILABLE'
      }
    },
    {
      id: 'h-102',
      name: 'Mayur Emerald Banquet & Lawn',
      type: 'Banquet Hall',
      city: 'Patna',
      area: 'Bailey Road',
      state: 'Bihar',
      pin: '800014',
      distance: '4.1 km',
      startingPrice: 45000,
      capacityMin: 100,
      capacityMax: 750,
      rating: 4.8,
      reviewCount: 96,
      verified: true,
      has3DModel: true,
      coverImg: 'https://images.unsplash.com/photo-1544830254-20b1274f881b?auto=format&fit=crop&w=800&q=80',
      facilities: ['Air Conditioned', 'Open Stage', 'Valet Parking', 'Power Backup', 'Catering Kitchen'],
      availability: {
        '2026-10-15': 'AVAILABLE',
        '2026-10-16': 'AVAILABLE',
        '2026-10-17': 'BOOKED',
        '2026-10-18': 'AVAILABLE'
      }
    },
    {
      id: 'h-103',
      name: 'Sanskriti Luxury Resort & Poolside Lawn',
      type: 'Resort',
      city: 'Delhi NCR',
      area: 'Gurugram Sector 48',
      state: 'Haryana',
      pin: '122018',
      distance: '8.7 km',
      startingPrice: 120000,
      capacityMin: 300,
      capacityMax: 2000,
      rating: 4.95,
      reviewCount: 230,
      verified: true,
      has3DModel: true,
      coverImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      facilities: ['Poolside Lawn', '15 AC Rooms', 'Valet (300 Cars)', 'Full Power Backup', 'Helipad', 'CCTV & Security'],
      availability: {
        '2026-10-15': 'BOOKED',
        '2026-10-16': 'AVAILABLE',
        '2026-10-17': 'BOOKED',
        '2026-10-18': 'PENDING'
      }
    }
  ],
  cars: [
    {
      id: 'c-201',
      name: 'Mercedes-Benz E-Class Luxury Wedding Car',
      type: 'Car',
      brand: 'Mercedes',
      color: 'Pearl White',
      city: 'Lucknow',
      seating: 4,
      driverIncluded: true,
      startingPrice: 15000,
      priceUnit: 'per event',
      rating: 4.9,
      coverImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      verified: true
    }
  ],
  tentHouses: [
    {
      id: 't-301',
      name: 'Shree Krishna Royal Tent & Shamiana Works',
      type: 'Tent House',
      city: 'Varanasi',
      area: 'Bhelupur',
      services: ['German Hanger', 'Waterproof Shamiana', 'Sofa & Banquet Chairs', 'Haldi & Mehndi Setup'],
      startingPrice: 25000,
      rating: 4.8,
      coverImg: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      verified: true
    }
  ]
};

// 4. Favorites Manager
function initFavorites() {
  document.querySelectorAll('.listing-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');

      const isFav = btn.classList.contains('active');
      const cardTitle = btn.closest('.listing-card')?.querySelector('.listing-title')?.textContent || 'Listing';

      if (isFav) {
        window.showToast(`Added "${cardTitle}" to your favorites.`, 'success');
      } else {
        window.showToast(`Removed from favorites.`, 'info');
      }
    });
  });
}

// 5. App Startup
document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilt();
  initFavorites();

  // Print friendly debug banner
  console.log('%c✨ HALL KHOJ FINDER ✨', 'color:#f59e0b; font-size:16px; font-weight:bold;');
  console.log('%cApne Paas Ka Hall, Tent, Car Aur Event Services Ek Jagah Khojiye', 'color:#818cf8; font-size:12px;');
});
