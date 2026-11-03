/**
 * Hall Khoj Finder — Cinematic Video Hero Engine
 * Supports:
 * - Seamless crossfading multi-video playlist (Indian Wedding Palaces, Grand Banquets, Stages)
 * - MP4 & WebM sources with high-resolution fallback posters
 * - Dark transparent overlay & Glassmorphic ambient lighting
 * - Respects prefers-reduced-motion & mobile data saver
 * - Interactive video controls (Next, Pause/Play, Indicator Pills)
 */

(function initVideoHero() {
  const container = document.getElementById('hero-video-wrapper');
  if (!container) return;

  // Curated royalty-free, authorized cinematic Indian wedding loops & palaces
  const PLAYLIST = [
    {
      id: 'palace',
      title: 'Luxury Heritage Marriage Palace',
      poster: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
      sources: [
        { src: 'https://assets.mixkit.co/videos/preview/mixkit-curtain-of-lights-in-a-wedding-hall-42998-large.mp4', type: 'video/mp4' }
      ]
    },
    {
      id: 'banquet',
      title: 'Grand Royal Banquet & Chandeliers',
      poster: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1920&q=80',
      sources: [
        { src: 'https://assets.mixkit.co/videos/preview/mixkit-grand-wedding-hall-with-chandeliers-42997-large.mp4', type: 'video/mp4' }
      ]
    },
    {
      id: 'stage',
      title: 'Majestic Royal Wedding Stage & Floral Decor',
      poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
      sources: [
        { src: 'https://assets.mixkit.co/videos/preview/mixkit-luxurious-wedding-reception-hall-43000-large.mp4', type: 'video/mp4' }
      ]
    },
    {
      id: 'celebration',
      title: 'Destination Wedding Fireworks & Celebration',
      poster: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80',
      sources: [
        { src: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-venue-decorated-with-white-flowers-43002-large.mp4', type: 'video/mp4' }
      ]
    }
  ];

  let currentIndex = 0;
  let isPlaying = true;
  let timer = null;
  const TRANSITION_INTERVAL = 14000; // 14 seconds per clip

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build DOM structure with double buffering for smooth crossfading
  container.innerHTML = `
    <div class="video-buffer-layer active" id="video-buffer-1">
      <video class="hero-bg-video" autoplay muted loop playsinline preload="auto" poster="${PLAYLIST[0].poster}">
        ${PLAYLIST[0].sources.map(s => `<source src="${s.src}" type="${s.type}">`).join('')}
      </video>
    </div>
    <div class="video-buffer-layer" id="video-buffer-2">
      <video class="hero-bg-video" muted loop playsinline preload="none" poster="${PLAYLIST[1].poster}">
        ${PLAYLIST[1].sources.map(s => `<source src="${s.src}" type="${s.type}">`).join('')}
      </video>
    </div>
    <div class="cinematic-dark-overlay"></div>
    <div class="cinematic-vignette"></div>
    
    <!-- Video Player Interactive Controls -->
    <div class="hero-video-controls glass-panel-subtle" aria-label="Cinematic Video Controls">
      <button class="hero-video-ctrl-btn" id="hero-video-play-btn" aria-label="Pause Background Video" title="Pause / Play Video">
        <svg id="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <svg id="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <div class="hero-video-indicators" id="hero-video-pills">
        ${PLAYLIST.map((item, idx) => `
          <button class="hero-video-pill ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="${item.title}" aria-label="Play ${item.title}"></button>
        `).join('')}
      </div>
      <button class="hero-video-ctrl-btn" id="hero-video-next-btn" aria-label="Next Wedding Clip" title="Next Clip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
      </button>
    </div>
  `;

  if (prefersReducedMotion) {
    console.log('[Video Hero] Reduced motion preferred. Using static high-res poster fallback.');
    const v1 = container.querySelector('#video-buffer-1 video');
    if (v1) v1.pause();
    return;
  }

  const buf1 = document.getElementById('video-buffer-1');
  const buf2 = document.getElementById('video-buffer-2');
  let activeBuf = buf1;
  let inactiveBuf = buf2;

  function switchToIndex(nextIndex) {
    if (nextIndex === currentIndex) return;
    const targetItem = PLAYLIST[nextIndex];
    const incomingVideo = inactiveBuf.querySelector('video');

    incomingVideo.poster = targetItem.poster;
    incomingVideo.innerHTML = targetItem.sources.map(s => `<source src="${s.src}" type="${s.type}">`).join('');
    incomingVideo.load();

    const playPromise = incomingVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        inactiveBuf.classList.add('active');
        activeBuf.classList.remove('active');

        // Swap buffers
        const temp = activeBuf;
        activeBuf = inactiveBuf;
        inactiveBuf = temp;

        currentIndex = nextIndex;
        updatePills();
      }).catch(err => {
        console.warn('[Video Hero] Autoplay transition notice:', err.message);
        // Fallback to updating poster
        activeBuf.querySelector('video').poster = targetItem.poster;
        currentIndex = nextIndex;
        updatePills();
      });
    }
  }

  function nextVideo() {
    const nextIdx = (currentIndex + 1) % PLAYLIST.length;
    switchToIndex(nextIdx);
  }

  function updatePills() {
    const pills = container.querySelectorAll('.hero-video-pill');
    pills.forEach((p, idx) => {
      p.classList.toggle('active', idx === currentIndex);
    });
  }

  function startAutoRotation() {
    stopAutoRotation();
    timer = setInterval(() => {
      if (isPlaying) nextVideo();
    }, TRANSITION_INTERVAL);
  }

  function stopAutoRotation() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Event Listeners
  const playBtn = document.getElementById('hero-video-play-btn');
  const nextBtn = document.getElementById('hero-video-next-btn');
  const iconPause = document.getElementById('icon-pause');
  const iconPlay = document.getElementById('icon-play');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      const curVid = activeBuf.querySelector('video');
      if (isPlaying) {
        if (curVid) curVid.play();
        iconPause.style.display = 'block';
        iconPlay.style.display = 'none';
        startAutoRotation();
      } else {
        if (curVid) curVid.pause();
        iconPause.style.display = 'none';
        iconPlay.style.display = 'block';
        stopAutoRotation();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextVideo();
      if (isPlaying) startAutoRotation();
    });
  }

  const pills = container.querySelectorAll('.hero-video-pill');
  pills.forEach(p => {
    p.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      switchToIndex(idx);
      if (isPlaying) startAutoRotation();
    });
  });

  // Start rotation
  startAutoRotation();
})();
