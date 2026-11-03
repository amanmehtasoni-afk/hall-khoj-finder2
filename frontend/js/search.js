/**
 * Hall Khoj Finder — Unified Search Engine, Leaflet Map & Filters
 * Supports: All 19 categories, Text matching, Interactive Leaflet Map, Geolocation Near Me,
 * Voice Search (Web Speech API), AI Natural Language Queries & Multi-Attribute Filters.
 */

window.HallKhojSearch = (function () {
  // State variables
  let userLocation = null;
  let activeRadius = 10; // km
  let speechRecognizer = null;
  let mapInstance = null;
  let mapMarkers = [];
  let userLocationMarker = null;
  let userRadiusCircle = null;
  let currentViewMode = 'grid'; // 'grid' | 'split' | 'map'
  let currentListings = [];
  let searchDebounceTimer = null;
  let autocompleteTimer = null;

  // Category Colors and Icons for Map Markers
  const CATEGORY_META = {
    'marriage-hall': { icon: '🏛️', class: 'pin-hall', label: 'Marriage Hall' },
    'banquet-hall': { icon: '👑', class: 'pin-hall', label: 'Banquet Hall' },
    'party-hall': { icon: '🎉', class: 'pin-hall', label: 'Party Hall' },
    'wedding-venue': { icon: '🏰', class: 'pin-hall', label: 'Wedding Venue' },
    'resort': { icon: '🌴', class: 'pin-hall', label: 'Resort' },
    'community-hall': { icon: '🏢', class: 'pin-hall', label: 'Community Hall' },
    'tent-house': { icon: '⛺', class: 'pin-tent', label: 'Tent House' },
    'wedding-car': { icon: '🚗', class: 'pin-car', label: 'Wedding Car' },
    'catering': { icon: '🍲', class: 'pin-service', label: 'Catering' },
    'photography': { icon: '📸', class: 'pin-service', label: 'Photography' },
    'videography': { icon: '🎥', class: 'pin-service', label: 'Videography' },
    'dj': { icon: '🎧', class: 'pin-service', label: 'DJ' },
    'sound-system': { icon: '🔊', class: 'pin-service', label: 'Sound System' },
    'lighting': { icon: '💡', class: 'pin-service', label: 'Lighting' },
    'flower-decoration': { icon: '💐', class: 'pin-service', label: 'Flower Decor' },
    'decoration': { icon: '✨', class: 'pin-service', label: 'Decoration' },
    'furniture': { icon: '🪑', class: 'pin-service', label: 'Furniture' },
    'event-staff': { icon: '👥', class: 'pin-service', label: 'Event Staff' },
    'other-services': { icon: '🎺', class: 'pin-service', label: 'Event Services' }
  };

  function getCategoryMeta(catName) {
    if (!catName) return { icon: '📍', class: 'pin-hall', label: 'Venue' };
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (const key in CATEGORY_META) {
      if (slug.includes(key) || key.includes(slug)) {
        return CATEGORY_META[key];
      }
    }
    return { icon: '📍', class: 'pin-hall', label: catName };
  }

  // 1. Initialize Interactive Leaflet Map
  function initMap() {
    const mapContainer = document.getElementById('search-map');
    if (!mapContainer || !window.L) return;

    if (mapInstance) {
      mapInstance.invalidateSize();
      return;
    }

    // Default center on Central-North India (Lucknow/Patna region)
    mapInstance = L.map('search-map', {
      center: [26.8467, 80.9462],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // CartoDB Dark Matter tiles (Dark, high-contrast theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);

    // Initial resize trigger
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 300);
  }

  // 2. Render Markers on Map
  function renderMapMarkers(items) {
    if (!mapInstance || !window.L) return;

    // Clear existing venue markers
    mapMarkers.forEach(m => mapInstance.removeLayer(m));
    mapMarkers = [];

    const bounds = [];

    items.forEach((item, index) => {
      if (item.latitude && item.longitude) {
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);
        bounds.push([lat, lng]);

        const meta = getCategoryMeta(item.category || item.type);
        const distanceStr = item.distance || (item.distanceKm ? `${item.distanceKm} km away` : '');

        // Custom HTML Marker
        const customIcon = L.divIcon({
          className: 'custom-leaflet-div',
          html: `
            <div class="custom-map-pin ${meta.class}" id="map-pin-${item.id}">
              <div class="custom-map-pin-inner">${meta.icon}</div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance);

        // Rich Popup Window
        const popupContent = `
          <div class="map-popup-card">
            <img src="${item.coverImg || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}" class="map-popup-img" alt="${item.name}">
            <div class="map-popup-body">
              <div class="map-popup-title">${item.name}</div>
              <div class="map-popup-meta">
                <span>${meta.label}</span>
                <span style="color:#fbbf24; font-weight:700;">★ ${item.rating || 4.8}</span>
              </div>
              <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:0.35rem;">
                📍 ${item.area ? item.area + ', ' : ''}${item.city || 'India'} ${distanceStr ? `• <strong style="color:#10b981;">${distanceStr}</strong>` : ''}
              </div>
              <div class="map-popup-price">
                ₹${(item.startingPrice || 50000).toLocaleString('en-IN')} <span style="font-size:0.75rem; color:#94a3b8; font-weight:normal;">${item.priceUnit || 'Starting'}</span>
              </div>
              <div class="map-popup-actions">
                <a href="/hall-details.html?id=${item.id}" class="btn btn-secondary btn-sm" style="flex:1; padding:0.3rem; font-size:0.75rem; text-align:center;">Inspect 3D</a>
                <a href="/booking.html?serviceId=${item.id}" class="btn btn-primary btn-sm" style="flex:1; padding:0.3rem; font-size:0.75rem; text-align:center;">Book</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="padding:0.3rem 0.5rem; font-size:0.75rem;" title="Directions in Google Maps">🧭</a>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280 });
        marker.listingId = item.id;
        mapMarkers.push(marker);
      }
    });

    // Add user location to bounds if present
    if (userLocation) {
      bounds.push([userLocation.lat, userLocation.lng]);
    }

    // Fit view to visible pins
    if (bounds.length > 0) {
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }

  // 3. User Geolocation Pin and Radius Circle on Map
  function updateUserLocationOnMap() {
    if (!mapInstance || !window.L || !userLocation) return;

    if (userLocationMarker) mapInstance.removeLayer(userLocationMarker);
    if (userRadiusCircle) mapInstance.removeLayer(userRadiusCircle);

    // Animated blue pulse icon
    const pulseIcon = L.divIcon({
      className: 'user-pulse-container',
      html: '<div class="user-pulse-pin" title="Aap Yahan Hain (Your Location)"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    userLocationMarker = L.marker([userLocation.lat, userLocation.lng], { icon: pulseIcon }).addTo(mapInstance);
    userLocationMarker.bindPopup('<div style="padding:8px 12px; font-weight:700; color:#3b82f6;">📍 Aap Yahan Hain (Your Location)</div>');

    // Draw radius boundary circle
    userRadiusCircle = L.circle([userLocation.lat, userLocation.lng], {
      radius: activeRadius * 1000,
      color: '#fbbf24',
      fillColor: '#fbbf24',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '5, 5'
    }).addTo(mapInstance);

    mapInstance.setView([userLocation.lat, userLocation.lng], activeRadius <= 10 ? 12 : 10);
  }

  // 4. View Mode Switcher ('grid' | 'split' | 'map')
  function setViewMode(mode) {
    currentViewMode = mode;
    const gridBtn = document.getElementById('view-grid-btn');
    const splitBtn = document.getElementById('view-split-btn');
    const mapBtn = document.getElementById('view-map-btn');

    [gridBtn, splitBtn, mapBtn].forEach(btn => btn && btn.classList.remove('active'));

    const searchLayout = document.getElementById('search-main-layout');
    const mapWrapper = document.getElementById('search-map-wrapper');
    const listingsContainer = document.getElementById('search-listings-container');

    if (mode === 'grid') {
      if (gridBtn) gridBtn.classList.add('active');
      if (mapWrapper) mapWrapper.style.display = 'none';
      if (searchLayout) searchLayout.className = 'search-layout-grid';
      if (listingsContainer) listingsContainer.style.display = 'grid';
    } else if (mode === 'split') {
      if (splitBtn) splitBtn.classList.add('active');
      if (mapWrapper) {
        mapWrapper.style.display = 'block';
        mapWrapper.className = 'split-view-map-sticky';
      }
      if (searchLayout) searchLayout.className = 'split-view-container';
      if (listingsContainer) listingsContainer.style.display = 'grid';
      initMap();
      renderMapMarkers(currentListings);
    } else if (mode === 'map') {
      if (mapBtn) mapBtn.classList.add('active');
      if (mapWrapper) {
        mapWrapper.style.display = 'block';
        mapWrapper.className = '';
      }
      if (searchLayout) searchLayout.className = 'search-layout-grid';
      if (listingsContainer) listingsContainer.style.display = 'none';
      initMap();
      renderMapMarkers(currentListings);
    }

    if (mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 200);
    }
  }

  // 5. Card Rendering
  function renderListings(items, totalCount) {
    const container = document.getElementById('search-listings-container');
    const countEl = document.getElementById('results-count');
    const emptyBox = document.getElementById('empty-state-box');

    currentListings = items || [];

    if (countEl) countEl.textContent = totalCount !== undefined ? totalCount : currentListings.length;

    if (!container) return;
    container.innerHTML = '';

    if (!currentListings || currentListings.length === 0) {
      if (emptyBox) emptyBox.style.display = 'block';
      renderMapMarkers([]);
      return;
    }

    if (emptyBox) emptyBox.style.display = 'none';

    currentListings.forEach(item => {
      const card = document.createElement('article');
      card.className = 'listing-card card-3d';
      card.setAttribute('data-id', item.id);

      const meta = getCategoryMeta(item.category || item.type);
      const distanceStr = item.distance || (item.distanceKm ? `${item.distanceKm} km away` : '');

      card.innerHTML = `
        <div class="listing-media">
          <img src="${item.coverImg || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}" alt="${item.name}" class="listing-img" loading="lazy">
          <div class="listing-badges">
            <span class="badge badge-verified">✓ Verified</span>
            ${item.has3DModel ? '<span class="badge badge-indigo">3D Ready</span>' : ''}
            <span class="badge" style="background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.2);">${meta.icon} ${meta.label}</span>
          </div>
          <button class="listing-fav-btn" data-fav-id="${item.id}" aria-label="Add to Favorites">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div class="listing-body">
          <div class="listing-header-row">
            <h3 class="listing-title">${item.name}</h3>
            <div class="listing-rating">★ ${item.rating || 4.8} <span style="color:var(--text-muted); font-size:0.75rem;">(${item.reviewCount || 34})</span></div>
          </div>
          <div class="listing-location-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${item.area ? item.area + ', ' : ''}${item.city || 'India'} ${distanceStr ? `• <strong style="color:#10b981;">📍 ${distanceStr}</strong>` : ''}</span>
          </div>
          <div class="listing-amenities-row">
            ${item.capacityMax ? `<span class="amenity-chip">Capacity: ${item.capacityMin || 100}–${item.capacityMax}</span>` : ''}
            ${(item.facilities || []).slice(0, 2).map(f => `<span class="amenity-chip">${f}</span>`).join('')}
          </div>
          <div class="listing-footer-row">
            <div class="listing-price-box">
              <span class="listing-price-label">Starting From</span>
              <span class="listing-price-val">₹${(item.startingPrice || 50000).toLocaleString('en-IN')}</span>
              ${item.priceUnit ? `<span style="font-size:0.72rem; color:var(--text-muted); font-weight:normal;">${item.priceUnit}</span>` : ''}
            </div>
            <div class="listing-actions-row">
              <a href="/hall-details.html?id=${item.id}" class="btn btn-secondary btn-sm">Inspect 3D</a>
              <a href="/booking.html?serviceId=${item.id}" class="btn btn-primary btn-sm">Book</a>
            </div>
          </div>
        </div>
      `;

      // Hover card highlights map marker
      card.addEventListener('mouseenter', () => {
        if (!mapInstance) return;
        const targetMarker = mapMarkers.find(m => m.listingId === item.id);
        if (targetMarker) {
          const pinEl = document.getElementById(`map-pin-${item.id}`);
          if (pinEl) pinEl.style.transform = 'rotate(-45deg) scale(1.3)';
        }
      });

      card.addEventListener('mouseleave', () => {
        const pinEl = document.getElementById(`map-pin-${item.id}`);
        if (pinEl) pinEl.style.transform = 'rotate(-45deg)';
      });

      // Click card opens marker popup and pans map
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        if (!mapInstance) return;
        const targetMarker = mapMarkers.find(m => m.listingId === item.id);
        if (targetMarker) {
          mapInstance.flyTo(targetMarker.getLatLng(), 15, { duration: 1 });
          targetMarker.openPopup();
        }
      });

      container.appendChild(card);
    });

    if (window.init3DCardTilt) window.init3DCardTilt();
    renderMapMarkers(currentListings);
  }

  // 6. Live API Search Execution
  async function executeSearch() {
    const keywordInput = document.getElementById('live-filter-keyword');
    const catSelect = document.getElementById('filter-category');
    const sortSelect = document.getElementById('filter-sort');
    const priceSlider = document.getElementById('price-slider');
    const capSlider = document.getElementById('capacity-slider');
    const cityInput = document.getElementById('filter-city');
    const dateInput = document.getElementById('filter-date');
    const verifiedCheckbox = document.getElementById('filter-verified');
    const ratingRadios = document.querySelector('input[name="rating-filter"]:checked');

    // Collect facilities checkboxes
    const checkedFacilities = [];
    document.querySelectorAll('.fac-filter:checked').forEach(cb => {
      checkedFacilities.push(cb.value);
    });

    const params = {
      q: keywordInput?.value || '',
      category: catSelect?.value || '',
      city: cityInput?.value || '',
      maxPrice: priceSlider?.value || 250000,
      capacity: capSlider?.value || 50,
      sortBy: sortSelect?.value || 'nearest',
      facilities: checkedFacilities.join(','),
      date: dateInput?.value || '',
      verifiedOnly: verifiedCheckbox?.checked ? 'true' : 'false',
      minRating: ratingRadios?.value || ''
    };

    if (userLocation) {
      params.lat = userLocation.lat;
      params.lng = userLocation.lng;
      params.nearMe = 'true';
      params.radius = activeRadius;
    }

    try {
      if (window.HKF_API?.search) {
        const res = await window.HKF_API.search.query(params);
        if (res.data?.results) {
          renderListings(res.data.results, res.data.total);
          return;
        }
      }
    } catch (e) {
      console.warn('[Search Engine] API query failed, falling back to local dataset:', e);
    }

    // Fallback: local dataset if offline
    if (window.HKF_DATABASE?.halls) {
      renderListings(window.HKF_DATABASE.halls);
    }
  }

  function debouncedSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(executeSearch, 250);
  }

  // 7. Autocomplete Engine
  function initAutocomplete() {
    const input = document.getElementById('live-filter-keyword');
    const box = document.getElementById('search-suggestions-box');
    if (!input || !box) return;

    input.addEventListener('input', () => {
      clearTimeout(autocompleteTimer);
      const val = input.value.trim();
      if (val.length < 2) {
        box.style.display = 'none';
        return;
      }

      autocompleteTimer = setTimeout(async () => {
        try {
          if (window.HKF_API?.search?.suggestions) {
            const res = await window.HKF_API.search.suggestions(val);
            const list = res.data || [];
            if (list.length === 0) {
              box.style.display = 'none';
              return;
            }

            box.innerHTML = list.map(item => `
              <div class="suggestion-item" data-text="${item.text}">
                <span>🔍</span>
                <span>${item.text}</span>
                <span class="suggestion-badge">${item.category || item.type}</span>
              </div>
            `).join('');

            box.style.display = 'block';

            box.querySelectorAll('.suggestion-item').forEach(el => {
              el.addEventListener('click', () => {
                input.value = el.getAttribute('data-text');
                box.style.display = 'none';
                executeSearch();
              });
            });
          }
        } catch (e) {
          console.warn('[Autocomplete error]:', e);
        }
      }, 200);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.style.display = 'none';
      }
    });
  }

  // 8. Near Me Geolocation Handling
  function triggerNearMe() {
    const nearMeModal = document.getElementById('near-me-modal');
    const locationStatus = document.getElementById('near-me-status');

    if (nearMeModal) nearMeModal.classList.add('open');

    if (!navigator.geolocation) {
      if (locationStatus) {
        locationStatus.innerHTML = '<span style="color:#ef4444;">Geolocation is not supported by your browser. Please choose a city below.</span>';
      }
      return;
    }

    if (locationStatus) {
      locationStatus.innerHTML = '<div class="flex items-center gap-2"><span>🔄</span><span>Detecting your live GPS coordinates...</span></div>';
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (locationStatus) {
          locationStatus.innerHTML = `
            <div style="color:#10b981; font-weight:700; margin-bottom:0.25rem;">
              ✓ GPS Location Detected: (${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)})
            </div>
            <div style="font-size:0.85rem; color:#94a3b8;">
              Select radius and click "Apply Radius" to discover services near you:
            </div>
          `;
        }

        if (window.showToast) {
          window.showToast('Location detected successfully!', 'success');
        }

        updateUserLocationOnMap();
      },
      (error) => {
        console.warn('[Geolocation Error]:', error.message);
        if (locationStatus) {
          locationStatus.innerHTML = `
            <div style="color:#ef4444; font-weight:600; margin-bottom:0.35rem;">
              ⚠️ Location access was denied or unavailable.
            </div>
            <div style="font-size:0.85rem; color:#94a3b8; margin-bottom:0.75rem;">
              Don't worry! Select your city below or enter your area/PIN code:
            </div>
          `;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  // 9. Voice Search Web Speech API
  function initVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceStatus = document.getElementById('voice-status-text');
    const voiceTranscript = document.getElementById('voice-transcript-text');

    if (!SpeechRecognition) return;

    speechRecognizer = new SpeechRecognition();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = true;
    speechRecognizer.lang = 'hi-IN,en-IN,en-US';

    speechRecognizer.onstart = () => {
      if (voiceStatus) voiceStatus.textContent = 'Listening... Bolna shuru kijiye (e.g. Lucknow me AC Marriage Hall)';
      if (voiceTranscript) voiceTranscript.value = '';
    };

    speechRecognizer.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }

      if (voiceTranscript) voiceTranscript.value = final || interim;
    };

    speechRecognizer.onerror = () => {
      if (voiceStatus) voiceStatus.textContent = 'Speech not detected or mic blocked. Please type below:';
    };

    speechRecognizer.onend = () => {
      if (voiceStatus && voiceTranscript && voiceTranscript.value.trim().length > 0) {
        voiceStatus.textContent = 'Voice captured! Click Search below.';
      }
    };
  }

  function startVoiceSearch() {
    const voiceModal = document.getElementById('voice-search-modal');
    if (voiceModal) voiceModal.classList.add('open');

    if (speechRecognizer) {
      try {
        speechRecognizer.start();
      } catch (err) {
        console.log('[Voice Search] Resetting:', err);
      }
    }
  }

  // 10. AI Khoj Assistant
  function openAISearch() {
    const aiModal = document.getElementById('ai-search-modal');
    if (aiModal) aiModal.classList.add('open');
    const input = document.getElementById('ai-prompt-input');
    if (input) input.focus();
  }

  function processAIQuery(promptText) {
    if (!promptText || promptText.trim().length === 0) return;

    const lower = promptText.toLowerCase();

    // Capacity detection
    const guestMatch = lower.match(/(\d+)\s*(people|guests|log|person|members)/);
    const capSlider = document.getElementById('capacity-slider');
    const capVal = document.getElementById('capacity-slider-val');
    if (guestMatch && capSlider) {
      capSlider.value = guestMatch[1];
      if (capVal) capVal.textContent = `${guestMatch[1]} Guests`;
    }

    // Budget detection
    const budgetMatch = lower.match(/(\d+)\s*(k|thousand|hazaar|lakh)/);
    const priceSlider = document.getElementById('price-slider');
    const priceVal = document.getElementById('price-slider-val');
    if (budgetMatch && priceSlider) {
      let amt = parseInt(budgetMatch[1], 10);
      if (budgetMatch[2].includes('k') || budgetMatch[2].includes('thousand') || budgetMatch[2].includes('hazaar')) amt *= 1000;
      if (budgetMatch[2].includes('lakh')) amt *= 100000;
      priceSlider.value = amt;
      if (priceVal) priceVal.textContent = `₹${amt.toLocaleString('en-IN')}`;
    }

    // Category detection
    const catSelect = document.getElementById('filter-category');
    if (catSelect) {
      if (lower.includes('car') || lower.includes('gaadi')) catSelect.value = 'Wedding Car';
      else if (lower.includes('tent') || lower.includes('shamiana')) catSelect.value = 'Tent House';
      else if (lower.includes('cater') || lower.includes('food') || lower.includes('khana')) catSelect.value = 'Catering';
      else if (lower.includes('dj') || lower.includes('sound') || lower.includes('music')) catSelect.value = 'DJ';
      else if (lower.includes('photo') || lower.includes('camera') || lower.includes('video')) catSelect.value = 'Photography';
      else if (lower.includes('light') || lower.includes('roshni')) catSelect.value = 'Lighting';
      else if (lower.includes('flower') || lower.includes('phool')) catSelect.value = 'Flower Decoration';
      else if (lower.includes('resort')) catSelect.value = 'Resort';
      else if (lower.includes('banquet')) catSelect.value = 'Banquet Hall';
      else if (lower.includes('party')) catSelect.value = 'Party Hall';
      else catSelect.value = 'Marriage Hall';
    }

    // City detection
    const cities = ['lucknow', 'patna', 'delhi', 'mumbai', 'varanasi', 'kanpur', 'jaipur', 'bhopal', 'agra', 'gorakhpur', 'noida'];
    const cityInput = document.getElementById('filter-city');
    for (const c of cities) {
      if (lower.includes(c)) {
        if (cityInput) cityInput.value = c.charAt(0).toUpperCase() + c.slice(1);
        break;
      }
    }

    // Close modal & execute search
    const aiModal = document.getElementById('ai-search-modal');
    if (aiModal) aiModal.classList.remove('open');

    if (window.showToast) {
      window.showToast('AI Filter Applied! Showing best matches.', 'success');
    }

    executeSearch();
  }

  // 11. Event Listeners Setup
  function init() {
    initVoiceSearch();
    initAutocomplete();

    // View Switcher Buttons
    document.getElementById('view-grid-btn')?.addEventListener('click', () => setViewMode('grid'));
    document.getElementById('view-split-btn')?.addEventListener('click', () => setViewMode('split'));
    document.getElementById('view-map-btn')?.addEventListener('click', () => setViewMode('map'));

    // Input Listeners
    const keywordInput = document.getElementById('live-filter-keyword');
    const catSelect = document.getElementById('filter-category');
    const sortSelect = document.getElementById('filter-sort');
    const cityInput = document.getElementById('filter-city');
    const dateInput = document.getElementById('filter-date');
    const verifiedCheckbox = document.getElementById('filter-verified');
    const priceSlider = document.getElementById('price-slider');
    const priceVal = document.getElementById('price-slider-val');
    const capSlider = document.getElementById('capacity-slider');
    const capVal = document.getElementById('capacity-slider-val');

    if (keywordInput) keywordInput.addEventListener('input', debouncedSearch);
    if (catSelect) catSelect.addEventListener('change', executeSearch);
    if (sortSelect) sortSelect.addEventListener('change', executeSearch);
    if (cityInput) cityInput.addEventListener('input', debouncedSearch);
    if (dateInput) dateInput.addEventListener('change', executeSearch);
    if (verifiedCheckbox) verifiedCheckbox.addEventListener('change', executeSearch);

    document.querySelectorAll('input[name="rating-filter"]').forEach(radio => {
      radio.addEventListener('change', executeSearch);
    });

    document.querySelectorAll('.fac-filter').forEach(cb => {
      cb.addEventListener('change', executeSearch);
    });

    // Sliders
    if (priceSlider && priceVal) {
      priceSlider.addEventListener('input', () => {
        const val = parseInt(priceSlider.value, 10);
        priceVal.textContent = `₹${val.toLocaleString('en-IN')}`;
        debouncedSearch();
      });
    }

    if (capSlider && capVal) {
      capSlider.addEventListener('input', () => {
        const val = parseInt(capSlider.value, 10);
        capVal.textContent = `${val} Guests`;
        debouncedSearch();
      });
    }

    // Category Quick Pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-cat') || '';
        if (catSelect) {
          catSelect.value = cat;
        }
        executeSearch();
      });
    });

    // Reset Filters Button
    const resetBtn = document.getElementById('reset-filters-btn');
    const emptyResetBtn = document.getElementById('empty-reset-btn');
    const doReset = () => {
      if (keywordInput) keywordInput.value = '';
      if (catSelect) catSelect.value = '';
      if (cityInput) cityInput.value = '';
      if (dateInput) dateInput.value = '';
      if (verifiedCheckbox) verifiedCheckbox.checked = false;
      if (priceSlider) {
        priceSlider.value = 250000;
        if (priceVal) priceVal.textContent = '₹2,50,000';
      }
      if (capSlider) {
        capSlider.value = 50;
        if (capVal) capVal.textContent = '50 Guests';
      }
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      const allPill = document.querySelector('.category-pill[data-cat=""]');
      if (allPill) allPill.classList.add('active');

      const allRatingRadio = document.querySelector('input[name="rating-filter"][value=""]');
      if (allRatingRadio) allRatingRadio.checked = true;

      userLocation = null;
      executeSearch();
    };

    if (resetBtn) resetBtn.addEventListener('click', doReset);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', doReset);

    // Modal Trigger Buttons
    document.querySelectorAll('[data-trigger="voice-search"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        startVoiceSearch();
      });
    });

    document.querySelectorAll('[data-trigger="near-me"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerNearMe();
      });
    });

    document.querySelectorAll('[data-trigger="ai-search"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openAISearch();
      });
    });

    // Radius Pills in Near Me modal
    document.querySelectorAll('.radius-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.radius-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeRadius = parseInt(pill.getAttribute('data-radius'), 10) || 10;
        updateUserLocationOnMap();
      });
    });

    // Near Me Apply
    const nearMeApplyBtn = document.getElementById('near-me-apply-btn');
    if (nearMeApplyBtn) {
      nearMeApplyBtn.addEventListener('click', () => {
        const modal = document.getElementById('near-me-modal');
        if (modal) modal.classList.remove('open');
        const manualLoc = document.getElementById('manual-location-input')?.value?.trim();
        if (keywordInput || cityInput) {
          if (manualLoc && cityInput) cityInput.value = manualLoc;
          executeSearch();
        } else {
          const params = new URLSearchParams();
          if (userLocation) {
            params.set('lat', userLocation.lat);
            params.set('lng', userLocation.lng);
            params.set('nearMe', 'true');
            params.set('radius', activeRadius);
          }
          if (manualLoc) {
            params.set('location', manualLoc);
          }
          window.location.href = `/search.html?${params.toString()}`;
        }
      });
    }

    // Near Me Popular City Fallback Chips
    document.querySelectorAll('[data-city-fallback]').forEach(chip => {
      chip.addEventListener('click', () => {
        const cityName = chip.getAttribute('data-city-fallback');
        if (cityInput) {
          cityInput.value = cityName;
          const modal = document.getElementById('near-me-modal');
          if (modal) modal.classList.remove('open');
          executeSearch();
        } else {
          window.location.href = `/search.html?location=${encodeURIComponent(cityName)}`;
        }
      });
    });

    // Voice Modal Search Submit
    const voiceSubmitBtn = document.getElementById('voice-submit-btn');
    if (voiceSubmitBtn) {
      voiceSubmitBtn.addEventListener('click', () => {
        const transcript = document.getElementById('voice-transcript-text');
        if (transcript && transcript.value.trim()) {
          const qVal = transcript.value.trim();
          if (keywordInput) {
            keywordInput.value = qVal;
            const modal = document.getElementById('voice-search-modal');
            if (modal) modal.classList.remove('open');
            executeSearch();
          } else {
            window.location.href = `/search.html?q=${encodeURIComponent(qVal)}`;
          }
        }
      });
    }

    // AI Modal Search Submit
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    const aiInput = document.getElementById('ai-prompt-input');
    if (aiSubmitBtn && aiInput) {
      aiSubmitBtn.addEventListener('click', () => processAIQuery(aiInput.value));
      aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          processAIQuery(aiInput.value);
        }
      });
    }

    // AI Sample Prompts
    document.querySelectorAll('[data-ai-sample]').forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleText = chip.getAttribute('data-ai-sample');
        if (aiInput) aiInput.value = sampleText;
        processAIQuery(sampleText);
      });
    });

    // Parse URL params on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('q') && keywordInput) keywordInput.value = urlParams.get('q');
    if (urlParams.get('city') && cityInput) cityInput.value = urlParams.get('city');
    if (urlParams.get('state') && (!cityInput || !cityInput.value)) {
      if (cityInput) cityInput.value = urlParams.get('state');
    }
    if (urlParams.get('district') && (!cityInput || !cityInput.value)) {
      if (cityInput) cityInput.value = urlParams.get('district');
    }
    if (urlParams.get('pin') && (!keywordInput || !keywordInput.value)) {
      if (keywordInput) keywordInput.value = urlParams.get('pin');
    }
    if (urlParams.get('eventDate') && dateInput) {
      dateInput.value = urlParams.get('eventDate');
    }
    if (urlParams.get('budget') && priceSlider) {
      const budgetVal = urlParams.get('budget');
      if (budgetVal === '0-100000') priceSlider.value = 100000;
      else if (budgetVal === '100000-250000') priceSlider.value = 250000;
      else if (budgetVal === '250000-500000') priceSlider.value = 500000;
      else if (budgetVal === '500000+') priceSlider.value = 1000000;
      if (priceVal) priceVal.textContent = `₹${parseInt(priceSlider.value, 10).toLocaleString('en-IN')}`;
    }
    if (urlParams.get('guests') && capSlider) {
      const g = urlParams.get('guests');
      if (g === '100-300') capSlider.value = 300;
      else if (g === '300-600') capSlider.value = 600;
      else if (g === '600-1200') capSlider.value = 1000;
      else if (g === '1200+') capSlider.value = 1500;
      if (capVal) capVal.textContent = `${capSlider.value} Guests`;
    }
    if (urlParams.get('category') && catSelect) {
      catSelect.value = urlParams.get('category');
      document.querySelectorAll('.category-pill').forEach(p => {
        if (p.getAttribute('data-cat') === urlParams.get('category')) {
          document.querySelectorAll('.category-pill').forEach(x => x.classList.remove('active'));
          p.classList.add('active');
        }
      });
    }
    if (urlParams.get('lat') && urlParams.get('lng')) {
      userLocation = {
        lat: parseFloat(urlParams.get('lat')),
        lng: parseFloat(urlParams.get('lng'))
      };
      if (urlParams.get('radius')) activeRadius = parseInt(urlParams.get('radius'), 10) || 10;
    }

    // Initial Search Execution
    executeSearch();
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    initMap,
    setViewMode,
    executeSearch,
    triggerNearMe,
    startVoiceSearch,
    openAISearch,
    processAIQuery
  };
})();
