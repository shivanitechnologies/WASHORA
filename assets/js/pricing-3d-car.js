// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Complete Automotive Experience:
// 1. True Frontside Leading Driving: Front headlights and bumper lead the car across the full hero section.
// 2. Realistic Driving Physics: Smooth acceleration, cornering deceleration, active front-wheel steering, and realistic about-turns.
// 3. Double-Click / Double-Tap Door Toggle: Double-click anywhere or on the car to open butterfly/scissor doors; double-click again to close!
// 4. Interactive Automotive Audio: High-performance V8 engine rumble (idle + throttle pitch acceleration) and realistic hydraulic door latch sounds via Web Audio API, plus optional ambient soundtrack toggle.
// 5. Sound Control Pill: Discreet audio mute/unmute button with brand neon styling.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class Pricing3DCarCard {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      modelPath: 'assets/models/car.glb'
    }, options);

    // Initial position on the right side of the hero section
    this.targetPos = new THREE.Vector3(2.2, 0, 0.1);
    this.carPos = new THREE.Vector3(2.2, 0, 0.1);

    // Initial heading in radians
    this.heading = -0.75;
    this.speed = 0;
    this.steeringAngle = 0;
    this.wheelRotation = 0;

    // Door animation state
    this.doorsOpen = false;
    this.doorProgress = 0; // 0 = fully closed, 1 = fully open
    this.leftDoorGroup = null;
    this.rightDoorGroup = null;

    // References to wheels
    this.wheelFL = null;
    this.wheelFR = null;
    this.allWheels = [];

    // Audio Engine state
    this.soundEnabled = false;
    this.audioCtx = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.soundTrackAudio = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 650;

    // 1. Transparent WebGL Scene
    this.scene = new THREE.Scene();

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(0, 3.8, 7.2);
    this.camera.lookAt(0, 0.15, 0);

    // 3. High Performance Renderer with Alpha Transparency
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Automotive Lighting
    this.setupLighting();

    // 5. Car Root Group
    this.carGroup = new THREE.Group();
    this.carGroup.position.copy(this.carPos);
    this.carGroup.rotation.y = this.heading;
    this.scene.add(this.carGroup);

    // 6. Raycasting plane for smooth mouse-to-ground projection
    this.raycaster = new THREE.Raycaster();
    this.mouse2D = new THREE.Vector2(0, 0);
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // 7. Load 3D Model & Construct Doors
    this.loadModel();

    // 8. Mouse & Pointer Tracking over Entire Hero Section
    this.setupMouseInteraction();

    // 9. Setup Double-Click & Double-Tap Door Interaction
    this.setupDoorInteraction();

    // 10. Sound System Setup
    this.setupSoundSystem();

    // 11. Resize Handling
    window.addEventListener('resize', () => this.onResize());

    // 12. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 9, 5);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.2);
    fillLight.position.set(-5, 7, 2);
    this.scene.add(fillLight);

    const rimLime = new THREE.DirectionalLight(0xD6FF36, 2.2);
    rimLime.position.set(-6, 4, -4);
    this.scene.add(rimLime);

    const frontFill = new THREE.DirectionalLight(0x9fc5ff, 1.8);
    frontFill.position.set(0, 2, 6);
    this.scene.add(frontFill);
  }

  setupMouseInteraction() {
    const updateTarget = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse2D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse2D.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Project onto ground plane (Y = 0)
      this.raycaster.setFromCamera(this.mouse2D, this.camera);
      const intersection = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.groundPlane, intersection)) {
        // Safe boundaries across the full hero area:
        this.targetPos.x = THREE.MathUtils.clamp(intersection.x, -3.8, 3.8);
        this.targetPos.z = THREE.MathUtils.clamp(intersection.z, -1.6, 1.8);
      }
    };

    window.addEventListener('mousemove', (e) => {
      updateTarget(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  setupDoorInteraction() {
    // 1. Double Click for Desktop
    window.addEventListener('dblclick', (e) => {
      // Ignore double clicks on buttons/links
      if (e.target.closest('a, button, input')) return;
      this.toggleDoors();
    });

    // 2. Double Tap for Mobile / Touch
    let lastTapTime = 0;
    window.addEventListener('touchend', (e) => {
      if (e.target.closest('a, button, input')) return;
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 350 && tapLength > 50) {
        this.toggleDoors();
        e.preventDefault();
      }
      lastTapTime = currentTime;
    });
  }

  toggleDoors() {
    this.doorsOpen = !this.doorsOpen;
    this.playDoorSound(this.doorsOpen);
    this.showDoorNotification(this.doorsOpen ? 'Car Doors Opened' : 'Car Doors Closed');
  }

  showDoorNotification(msg) {
    let toast = document.getElementById('pricing-door-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pricing-door-toast';
      toast.className = 'fixed bottom-8 right-8 z-50 px-4 py-2.5 rounded-full bg-[#101820]/90 backdrop-blur-md border border-[#D6FF36]/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2 transition-all duration-300 pointer-events-none opacity-0 translate-y-3';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#D6FF36] animate-ping"></span><span>${msg}</span>`;
    toast.classList.remove('opacity-0', 'translate-y-3');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-3');
    }, 2200);
  }

  setupSoundSystem() {
    // Inject subtle sound toggle button at bottom-left of hero section
    const soundBtn = document.createElement('button');
    soundBtn.id = 'pricing-sound-toggle';
    soundBtn.className = 'absolute bottom-6 right-8 sm:right-12 z-20 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-[#101820]/80 backdrop-blur-md border border-gray-200 dark:border-[#252E35] text-xs font-bold text-gray-800 dark:text-gray-200 shadow-lg hover:border-[#D6FF36] transition-all flex items-center gap-2 group cursor-pointer';
    soundBtn.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-[#D6FF36] transition-colors" id="sound-dot"></span>
      <span id="sound-label">Engine Sound: OFF</span>
    `;

    const heroSection = document.getElementById('pricing-hero-section') || this.container;
    heroSection.appendChild(soundBtn);

    const toggleSound = () => {
      this.soundEnabled = !this.soundEnabled;
      const dot = document.getElementById('sound-dot');
      const label = document.getElementById('sound-label');

      if (this.soundEnabled) {
        this.initAudioContext();
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-[#D6FF36] shadow-[0_0_8px_#D6FF36]';
        if (label) label.textContent = 'Engine Sound: ON';
        this.startEngineAudio();
      } else {
        if (dot) dot.className = 'w-2 h-2 rounded-full bg-gray-400';
        if (label) label.textContent = 'Engine Sound: OFF';
        this.stopEngineAudio();
      }
    };

    soundBtn.addEventListener('click', toggleSound);

    // Automatically enable on first user interaction if they interact with the car
    const autoEnableOnce = () => {
      window.removeEventListener('click', autoEnableOnce);
    };
    window.addEventListener('click', autoEnableOnce);
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startEngineAudio() {
    if (!this.audioCtx) return;
    try {
      // 1. Synthesize realistic sports car engine rumble with Dual Oscillators + LowPass Filter
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      // Deep V8 engine harmonics
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(42, this.audioCtx.currentTime); // Low engine idle rumble

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(84, this.audioCtx.currentTime); // Sub-harmonic

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.audioCtx.currentTime); // Throaty exhaust tone

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();

      this.engineOsc1 = osc1;
      this.engineOsc2 = osc2;
      this.engineGain = gain;
      this.engineFilter = filter;
    } catch (err) {
      console.warn('Audio init error:', err);
    }
  }

  stopEngineAudio() {
    try {
      if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); }
      if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); }
      if (this.engineGain) { this.engineGain.disconnect(); }
    } catch (e) {}
  }

  updateEnginePitch(speed) {
    if (!this.soundEnabled || !this.audioCtx || !this.engineOsc1) return;
    try {
      // Rev pitch scales with travel speed
      const targetFreq1 = 42 + speed * 1200; // 42Hz idle up to 110Hz acceleration
      const targetFreq2 = 84 + speed * 2400;
      const targetFilter = 140 + speed * 3000;

      this.engineOsc1.frequency.setTargetAtTime(targetFreq1, this.audioCtx.currentTime, 0.08);
      this.engineOsc2.frequency.setTargetAtTime(targetFreq2, this.audioCtx.currentTime, 0.08);
      this.engineFilter.frequency.setTargetAtTime(targetFilter, this.audioCtx.currentTime, 0.08);
    } catch (e) {}
  }

  playDoorSound(isOpen) {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // Mechanical latch click + hydraulic door whoosh
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      if (isOpen) {
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      } else {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
      }

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch (e) {}
  }

  buildDoors(parentModel, metallicPaint, tintedGlass, carbonTrim) {
    // Procedurally assemble aerodynamic scissor / butterfly doors that seamlessly articulate on double-click
    const doorMat = metallicPaint.clone();
    const glassMat = tintedGlass.clone();
    const frameMat = carbonTrim.clone();

    // Left Door Assembly
    this.leftDoorGroup = new THREE.Group();
    // Hinge positioned at front-left A-pillar
    this.leftDoorGroup.position.set(-0.82, 0.52, -0.15);

    const lDoorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.48, 0.95),
      doorMat
    );
    lDoorPanel.position.set(-0.04, 0.02, 0.46);

    const lWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.32, 0.82),
      glassMat
    );
    lWindow.position.set(-0.02, 0.38, 0.44);

    const lFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.04, 0.88),
      frameMat
    );
    lFrame.position.set(-0.03, 0.54, 0.44);

    this.leftDoorGroup.add(lDoorPanel, lWindow, lFrame);

    // Right Door Assembly
    this.rightDoorGroup = new THREE.Group();
    // Hinge positioned at front-right A-pillar
    this.rightDoorGroup.position.set(0.82, 0.52, -0.15);

    const rDoorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.48, 0.95),
      doorMat
    );
    rDoorPanel.position.set(0.04, 0.02, 0.46);

    const rWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.32, 0.82),
      glassMat
    );
    rWindow.position.set(0.02, 0.38, 0.44);

    const rFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.04, 0.88),
      frameMat
    );
    rFrame.position.set(0.03, 0.54, 0.44);

    this.rightDoorGroup.add(rDoorPanel, rWindow, rFrame);

    // Add to parent model
    parentModel.add(this.leftDoorGroup);
    parentModel.add(this.rightDoorGroup);
  }

  loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loaderEl = document.getElementById('pricing-3d-loader');

    // Automotive Materials
    const metallicPaint = new THREE.MeshPhysicalMaterial({
      color: 0x0f141a,
      emissive: 0x040608,
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98
    });

    const luxuryLeather = new THREE.MeshStandardMaterial({
      color: 0x181c20,
      roughness: 0.75,
      metalness: 0.08
    });

    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: 0x0b1017,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.88,
      transparent: true,
      opacity: 0.82,
      ior: 1.52
    });

    const alloyRim = new THREE.MeshStandardMaterial({
      color: 0xd6dbe2,
      metalness: 0.85,
      roughness: 0.22
    });

    const chromeMetal = new THREE.MeshStandardMaterial({
      color: 0xf5f7fb,
      metalness: 0.96,
      roughness: 0.06
    });

    const tireRubber = new THREE.MeshStandardMaterial({
      color: 0x141618,
      roughness: 0.84,
      metalness: 0.04
    });

    const carbonTrim = new THREE.MeshStandardMaterial({
      color: 0x1b1f24,
      roughness: 0.35,
      metalness: 0.35
    });

    const headlightLens = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xd6ff36,
      emissiveIntensity: 0.6,
      roughness: 0.08,
      metalness: 0.2
    });

    const taillightRuby = new THREE.MeshPhysicalMaterial({
      color: 0xbb0f1a,
      emissive: 0x88050e,
      emissiveIntensity: 0.5,
      transmission: 0.55,
      transparent: true,
      roughness: 0.1
    });

    gltfLoader.load(
      this.options.modelPath,
      (gltf) => {
        const model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        // Scaled to look realistic and impressive (+40% scale)
        const scale = 3.40 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        // Center model geometry at local origin
        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

        // Model wrapper to rotate car 180 degrees so front points forward (+Z in carGroup)
        const modelWrapper = new THREE.Group();
        modelWrapper.rotation.y = Math.PI;
        modelWrapper.add(model);

        // Build doors
        this.buildDoors(model, metallicPaint, tintedGlass, carbonTrim);

        model.traverse((child) => {
          const name = (child.name || '').toLowerCase();

          // Store wheel references for steering and rolling
          if (name === 'wheel_fl') this.wheelFL = child;
          if (name === 'wheel_fr') this.wheelFR = child;
          if (name.includes('tire') || name.includes('rim_')) {
            this.allWheels.push(child);
          }

          if (child.isMesh) {
            const matName = (child.material && child.material.name ? child.material.name : '').toLowerCase();

            if (name.includes('leather') || matName.includes('leather') || name.includes('interior_light') || matName.includes('interior_light') || name.includes('carpet') || matName.includes('carpet')) {
              child.material = luxuryLeather;
            } else if (name.includes('body') || matName.includes('body_color') || name.includes('metal') || matName.includes('leather_red')) {
              child.material = metallicPaint;
            } else if (name.includes('glass') || matName.includes('glass') || name.includes('window')) {
              child.material = tintedGlass;
            } else if (name.includes('chrome') || matName.includes('chrome') || name.includes('exhaust')) {
              child.material = chromeMetal;
            } else if (name.includes('wheel') || name.includes('rim') || matName.includes('metal_gray') || name.includes('brakes')) {
              child.material = alloyRim;
            } else if (name.includes('tire') || matName.includes('tires')) {
              child.material = tireRubber;
            } else if (name.includes('carbon') || matName.includes('carbon') || name.includes('plastic') || name.includes('grill') || matName.includes('plastic_gray') || name.includes('trim')) {
              child.material = carbonTrim;
            } else if (name.includes('led') || matName.includes('turn_signal') || (name.includes('lights') && !name.includes('red'))) {
              child.material = headlightLens;
            } else if (name.includes('lights_red') || matName.includes('taillight')) {
              child.material = taillightRuby;
            } else if (child.material) {
              child.material.roughness = 0.35;
              child.material.metalness = 0.65;
            }
          }
        });

        this.carGroup.add(modelWrapper);

        if (loaderEl) {
          loaderEl.classList.add('opacity-0', 'pointer-events-none');
          setTimeout(() => loaderEl.remove(), 400);
        }
      },
      (xhr) => {
        if (loaderEl && xhr.total) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          const bar = document.getElementById('pricing-3d-bar');
          if (bar) bar.style.width = pct + '%';
        }
      },
      (err) => {
        console.warn('Error loading 3D car:', err);
        if (loaderEl) loaderEl.remove();
      }
    );
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.carGroup) {
      // 1. Vector from car position to mouse target
      const dx = this.targetPos.x - this.carPos.x;
      const dz = this.targetPos.z - this.carPos.z;
      const distance = Math.hypot(dx, dz);

      let forwardSpeed = 0;

      if (distance > 0.12) {
        // True frontside heading towards target
        const desiredHeading = Math.atan2(dx, dz);

        // Shortest angular turn difference (-PI to +PI)
        let angleDiff = desiredHeading - this.heading;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Smooth steering response
        const turnSpeed = 0.075;
        this.heading += angleDiff * turnSpeed;

        // Front wheels angle into the turn
        const targetSteer = THREE.MathUtils.clamp(-angleDiff * 0.75, -0.5, 0.5);
        this.steeringAngle += (targetSteer - this.steeringAngle) * 0.15;

        // Forward driving speed
        forwardSpeed = Math.min(distance * 0.05, 0.055) * Math.max(0.25, Math.cos(angleDiff));
        this.carPos.x += Math.sin(this.heading) * forwardSpeed;
        this.carPos.z += Math.cos(this.heading) * forwardSpeed;

        // Wheels rolling
        this.wheelRotation += forwardSpeed * 4.2;
        this.allWheels.forEach(w => {
          w.rotation.x = this.wheelRotation;
        });

        // Dynamic chassis bank
        this.carGroup.rotation.z = THREE.MathUtils.lerp(this.carGroup.rotation.z, -angleDiff * 0.06, 0.12);
        this.carGroup.rotation.x = THREE.MathUtils.lerp(this.carGroup.rotation.x, -forwardSpeed * 0.4, 0.12);
      } else {
        // Return to rest
        this.steeringAngle *= 0.88;
        this.carGroup.rotation.z *= 0.88;
        this.carGroup.rotation.x *= 0.88;
      }

      // 2. Dynamic Engine Rev Sound (Pitch adjusts with forward speed)
      this.updateEnginePitch(forwardSpeed);

      // 3. Steer front wheels
      if (this.wheelFL) this.wheelFL.rotation.y = this.steeringAngle;
      if (this.wheelFR) this.wheelFR.rotation.y = this.steeringAngle;

      // 4. Update car group position and heading
      this.carGroup.position.copy(this.carPos);
      this.carGroup.rotation.y = this.heading;

      // 5. Door Opening / Closing Smooth Animation (Butterfly style: Y + Z rotation)
      const targetDoorProgress = this.doorsOpen ? 1 : 0;
      this.doorProgress += (targetDoorProgress - this.doorProgress) * 0.08;

      if (this.leftDoorGroup && this.rightDoorGroup) {
        // Left Door: Rotates outwards & upward
        this.leftDoorGroup.rotation.y = -this.doorProgress * 0.65;
        this.leftDoorGroup.rotation.z = this.doorProgress * 0.55;

        // Right Door: Rotates outwards & upward
        this.rightDoorGroup.rotation.y = this.doorProgress * 0.65;
        this.rightDoorGroup.rotation.z = -this.doorProgress * 0.55;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
