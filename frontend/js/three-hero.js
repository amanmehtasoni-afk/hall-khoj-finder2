/**
 * Hall Khoj Finder — 3D Celebratory Hero Scene
 * High-performance Three.js implementation with WebGL detection & CSS fallback.
 */

(function initHero3D() {
  const container = document.getElementById('hero-3d-wrapper');
  const canvas = document.getElementById('hero-3d-canvas');
  const fallback = document.getElementById('webgl-fallback');

  if (!container || !canvas) return;

  // 1. WebGL Support Detection
  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (
        testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      ));
    } catch (e) {
      return false;
    }
  }

  // Check reduced-motion preference or low-power mode
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isWebGLAvailable() || prefersReducedMotion || typeof THREE === 'undefined') {
    console.log('[3D System] WebGL unavailable or reduced-motion active. Switching to high-performance fallback.');
    if (fallback) fallback.classList.add('active');
    canvas.style.display = 'none';
    return;
  }

  // 2. Three.js Setup
  let scene, camera, renderer;
  let particles, rings = [], crystals = [];
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  try {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a13, 0.0022);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.z = 600;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3. Lighting (Royal Indigo & Golden Amber spotlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 900);
    goldLight.position.set(250, 200, 300);
    scene.add(goldLight);

    const indigoLight = new THREE.PointLight(0x6366f1, 2.5, 900);
    indigoLight.position.set(-250, -150, 250);
    scene.add(indigoLight);

    const pinkLight = new THREE.PointLight(0xec4899, 1.5, 700);
    pinkLight.position.set(0, 300, 150);
    scene.add(pinkLight);

    // 4. Floating 3D Geometric Celebration Elements (Rings & Prisms)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x92400e,
      emissiveIntensity: 0.2
    });

    const indigoMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x312e81,
      emissiveIntensity: 0.2
    });

    // Grand Celebration Torus Rings
    const ringGeo1 = new THREE.TorusGeometry(180, 4, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);
    rings.push({ mesh: ring1, rotSpeedX: 0.002, rotSpeedY: 0.003 });

    const ringGeo2 = new THREE.TorusGeometry(230, 3, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, indigoMaterial);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);
    rings.push({ mesh: ring2, rotSpeedX: -0.0025, rotSpeedY: 0.002 });

    // Floating Crystal Banquet Gems
    const isMobile = window.innerWidth < 768;
    const crystalCount = isMobile ? 12 : 24;
    const crystalGeos = [
      new THREE.OctahedronGeometry(20, 0),
      new THREE.IcosahedronGeometry(18, 0),
      new THREE.TetrahedronGeometry(22, 0)
    ];

    for (let i = 0; i < crystalCount; i++) {
      const geo = crystalGeos[i % crystalGeos.length];
      const mat = (i % 2 === 0) ? goldMaterial : indigoMaterial;
      const crystal = new THREE.Mesh(geo, mat);

      crystal.position.x = (Math.random() - 0.5) * 900;
      crystal.position.y = (Math.random() - 0.5) * 600;
      crystal.position.z = (Math.random() - 0.5) * 400 - 100;

      crystal.scale.setScalar(Math.random() * 0.8 + 0.6);
      scene.add(crystal);

      crystals.push({
        mesh: crystal,
        speedX: (Math.random() - 0.5) * 0.015,
        speedY: (Math.random() - 0.5) * 0.015,
        floatOffset: Math.random() * Math.PI * 2
      });
    }

    // 5. Sparkle Particle Field (Confetti / Star Dust)
    const particleCount = isMobile ? 350 : 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colGold = new THREE.Color(0xf59e0b);
    const colIndigo = new THREE.Color(0x818cf8);
    const colPink = new THREE.Color(0xec4899);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1400;
      positions[i + 1] = (Math.random() - 0.5) * 1000;
      positions[i + 2] = (Math.random() - 0.5) * 900;

      const mix = Math.random();
      const chosenColor = mix < 0.4 ? colGold : (mix < 0.8 ? colIndigo : colPink);
      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Parallax Listener
    window.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.4;
      mouseY = (event.clientY - windowHalfY) * 0.4;
    }, { passive: true });

    // 7. Responsive Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 8. Animation Loop (Battery & Performance Optimized with Viewport & Tab Observers)
    let clock = new THREE.Clock();
    let isVisible = true;
    let animFrameId = null;

    function animate() {
      if (!isVisible) {
        animFrameId = null;
        return;
      }

      animFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera dampening with mouse target
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = targetX * 0.4;
      camera.position.y = -targetY * 0.4;
      camera.lookAt(scene.position);

      // Rotate Rings
      rings.forEach(item => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
      });

      // Animate Crystals
      crystals.forEach((item, idx) => {
        item.mesh.rotation.x += item.speedX;
        item.mesh.rotation.y += item.speedY;
        item.mesh.position.y += Math.sin(elapsedTime * 1.5 + item.floatOffset) * 0.35;
      });

      // Slowly rotate particle field
      if (particles) {
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.01;
      }

      renderer.render(scene, camera);
    }

    // IntersectionObserver: Pause rendering when scrolled out of view
    if ('IntersectionObserver' in window && container) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting && document.visibilityState === 'visible';
        if (isVisible && !animFrameId) {
          clock.start();
          animate();
        }
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    // Pause rendering when browser tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        const rect = container.getBoundingClientRect();
        isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (isVisible && !animFrameId) {
          clock.start();
          animate();
        }
      }
    });

    animate();
    console.log('[3D System] Three.js Hero Scene initialized with battery-saving viewport observer.');

  } catch (err) {
    console.warn('[3D System] Error initializing WebGL scene:', err);
    if (fallback) fallback.classList.add('active');
    canvas.style.display = 'none';
  }
})();

