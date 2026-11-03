/**
 * Hall Khoj Finder — 3D Venue Layout Inspector
 * Interactive 3D Architectural Preview with Area Switcher and 2D Gallery Fallback.
 */

(function initVenue3D() {
  const container = document.getElementById('venue-3d-wrapper');
  const canvas = document.getElementById('venue-3d-canvas');
  const galleryView = document.getElementById('venue-2d-gallery');
  const toggleBtn = document.getElementById('toggle-venue-view-btn');

  if (!canvas) return;

  function isWebGLAvailable() {
    try {
      const test = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (test.getContext('webgl') || test.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // If WebGL is unavailable or user prefers reduced motion, default to 2D view
  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    console.log('[Venue 3D] WebGL unavailable. Showing 2D photo gallery mode.');
    if (container) container.style.display = 'none';
    if (galleryView) galleryView.style.display = 'grid';
    if (toggleBtn) toggleBtn.style.display = 'none';
    return;
  }

  let scene, camera, renderer;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let rotX = 0.45, rotY = -0.55;
  let targetRotX = 0.45, targetRotY = -0.55;
  let zoom = 42;
  let targetZoom = 42;

  // Venue Zone Coordinates
  const ZONES = {
    overview: { x: 0, y: 15, z: 42, targetX: 0.45, targetY: -0.55 },
    stage:    { x: 0, y: 8,  z: 22, targetX: 0.25, targetY: 0 },
    seating:  { x: 0, y: 10, z: 28, targetX: 0.55, targetY: -0.4 },
    dining:   { x: 18, y: 8, z: 24, targetX: 0.35, targetY: -0.85 },
    entrance: { x: 0, y: 7,  z: 22, targetX: 0.3,  targetY: 3.14 },
    rooms:    { x: -18, y: 8, z: 24, targetX: 0.35, targetY: 0.85 }
  };

  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e1a);

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 460;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(0, 15, 42);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0xfef08a, 1.8);
    mainSpot.position.set(20, 35, 20);
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const fillSpot = new THREE.DirectionalLight(0x818cf8, 1.0);
    fillSpot.position.set(-20, 25, -20);
    scene.add(fillSpot);

    // Architectural Elements Materials
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.2 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const stageMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.6 });
    const archMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.6 });
    const carpetMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });

    // 1. Hall Floor
    const floorGeo = new THREE.BoxGeometry(50, 0.8, 60);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.4;
    scene.add(floor);

    // Red Carpet Walkway
    const carpetGeo = new THREE.BoxGeometry(6, 0.05, 45);
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.set(0, 0.05, 5);
    scene.add(carpet);

    // 2. Grand Stage Zone (North End)
    const stageGeo = new THREE.BoxGeometry(22, 2, 12);
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, 1, -22);
    scene.add(stage);

    // Stage Floral/Golden Arch
    const archGeo = new THREE.TorusGeometry(8, 0.6, 12, 40, Math.PI);
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 2, -26);
    scene.add(arch);

    // Royal Sofa on Stage
    const sofaBaseGeo = new THREE.BoxGeometry(6, 1.2, 2.5);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const sofa = new THREE.Mesh(sofaBaseGeo, sofaMat);
    sofa.position.set(0, 2.6, -22);
    scene.add(sofa);

    // 3. Guest Seating Zone (Center Tables & Chairs)
    const tableGeo = new THREE.CylinderGeometry(2, 2, 1.2, 20);
    const chairGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 12);

    const tablePositions = [
      { x: -10, z: -8 }, { x: 10, z: -8 },
      { x: -10, z: 4 },  { x: 10, z: 4 },
      { x: -10, z: 16 }, { x: 10, z: 16 }
    ];

    tablePositions.forEach(pos => {
      const table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(pos.x, 0.6, pos.z);
      scene.add(table);

      // 4 Chairs around each table
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      angles.forEach(ang => {
        const chair = new THREE.Mesh(chairGeo, chairMat);
        chair.position.set(
          pos.x + Math.cos(ang) * 3,
          0.5,
          pos.z + Math.sin(ang) * 3
        );
        scene.add(chair);
      });
    });

    // 4. Dining / Buffet Zone (East Wing)
    const buffetGeo = new THREE.BoxGeometry(4, 1.4, 28);
    const buffetMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
    const buffetTable = new THREE.Mesh(buffetGeo, buffetMat);
    buffetTable.position.set(20, 0.7, 0);
    scene.add(buffetTable);

    // 5. VIP / Bridal Rooms (West Wing)
    const roomWallGeo = new THREE.BoxGeometry(6, 6, 20);
    const room = new THREE.Mesh(roomWallGeo, wallMat);
    room.position.set(-20, 3, 0);
    scene.add(room);

    // 6. Grand Entrance Gate (South End)
    const pillarGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
    const p1 = new THREE.Mesh(pillarGeo, archMat);
    p1.position.set(-6, 4, 28);
    const p2 = new THREE.Mesh(pillarGeo, archMat);
    p2.position.set(6, 4, 28);
    scene.add(p1);
    scene.add(p2);

    // Mouse / Touch Interaction for Orbiting
    const canvasElem = canvas;

    canvasElem.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.008;
      targetRotX = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotX + deltaY * 0.008));
    });

    // Zoom on wheel
    canvasElem.addEventListener('wheel', (e) => {
      e.preventDefault();
      targetZoom = Math.max(15, Math.min(65, targetZoom + e.deltaY * 0.03));
    }, { passive: false });

    // Zone Switcher Buttons Listener
    // Lighting Presets Mode
    function setLightingPreset(preset) {
      if (preset === 'sunset') {
        scene.background.set(0x1a0f1e);
        ambientLight.color.set(0xff7744);
        ambientLight.intensity = 0.7;
        mainSpot.color.set(0xfb923c);
        mainSpot.intensity = 2.2;
        fillSpot.color.set(0xc084fc);
        fillSpot.intensity = 1.2;
      } else if (preset === 'night_gala') {
        scene.background.set(0x050510);
        ambientLight.color.set(0x38bdf8);
        ambientLight.intensity = 0.45;
        mainSpot.color.set(0xa855f7);
        mainSpot.intensity = 2.5;
        fillSpot.color.set(0xec4899);
        fillSpot.intensity = 1.8;
      } else { // daylight
        scene.background.set(0x090e1a);
        ambientLight.color.set(0xffffff);
        ambientLight.intensity = 0.85;
        mainSpot.color.set(0xfef08a);
        mainSpot.intensity = 1.8;
        fillSpot.color.set(0x818cf8);
        fillSpot.intensity = 1.0;
      }
    }

    const lightingButtons = document.querySelectorAll('[data-venue-lighting]');
    lightingButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        lightingButtons.forEach(b => b.classList.remove('btn-gold'));
        btn.classList.add('btn-gold');
        const mode = btn.getAttribute('data-venue-lighting');
        setLightingPreset(mode);
      });
    });

    const zoneButtons = document.querySelectorAll('[data-venue-zone]');
    zoneButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        zoneButtons.forEach(b => b.classList.remove('btn-primary', 'btn-gold'));
        btn.classList.add('btn-gold');

        const zoneKey = btn.getAttribute('data-venue-zone');
        if (ZONES[zoneKey]) {
          targetRotX = ZONES[zoneKey].targetX;
          targetRotY = ZONES[zoneKey].targetY;
          targetZoom = ZONES[zoneKey].z;
        }
      });
    });

    // Toggle 3D vs 2D Gallery View
    if (toggleBtn) {
      let is3D = true;
      toggleBtn.addEventListener('click', () => {
        is3D = !is3D;
        if (is3D) {
          container.style.display = 'block';
          if (galleryView) galleryView.style.display = 'none';
          toggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Switch to 2D Gallery
          `;
        } else {
          container.style.display = 'none';
          if (galleryView) galleryView.style.display = 'grid';
          toggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            Switch to 3D Preview
          `;
        }
      });
    }

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Render Loop (Optimized with Viewport Observer)
    let isVisible = true;
    let animFrameId = null;

    function animateVenue() {
      if (!isVisible) {
        animFrameId = null;
        return;
      }

      animFrameId = requestAnimationFrame(animateVenue);

      // Smooth interpolation for rotation & zoom
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
      zoom += (targetZoom - zoom) * 0.08;

      camera.position.x = zoom * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = zoom * Math.sin(rotX);
      camera.position.z = zoom * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    }

    if ('IntersectionObserver' in window && container) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting && document.visibilityState === 'visible';
        if (isVisible && !animFrameId) {
          animateVenue();
        }
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        const rect = container ? container.getBoundingClientRect() : null;
        isVisible = rect ? (rect.bottom > 0 && rect.top < window.innerHeight) : true;
        if (isVisible && !animFrameId) {
          animateVenue();
        }
      }
    });

    animateVenue();
    console.log('[Venue 3D] Interactive 3D Venue layout inspector loaded with battery-saving observer.');


  } catch (err) {
    console.warn('[Venue 3D] Failed to load 3D scene:', err);
    if (container) container.style.display = 'none';
    if (galleryView) galleryView.style.display = 'grid';
  }
})();
