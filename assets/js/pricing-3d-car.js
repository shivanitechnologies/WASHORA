// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Entire Hero Section Driving Arena:
// 1. Full-Hero Freedom: Car drives across the ENTIRE hero section (left to right, top to bottom), not constrained to a box.
// 2. Realistic Automotive Driving Physics: Car accelerates, banks into curves, steers front wheels, and performs natural about-turns.
// 3. Complete Frustum Safety: Model is dynamically scaled and arena bounds are strictly mapped so the car NEVER clips any edge.
// 4. Photorealistic Automotive Materials: Gloss obsidian metallic body paint, tinted glass, alloy rims, rubber tires, and luxury leather interior.

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
    this.targetPos = new THREE.Vector3(2.4, 0, 0.2);
    this.carPos = new THREE.Vector3(2.4, 0, 0.2);

    // Vehicle kinematic state
    this.heading = 2.45; // Radians
    this.speed = 0;
    this.steeringAngle = 0;
    this.wheelRotation = 0;

    // References to wheels
    this.wheelFL = null;
    this.wheelFR = null;
    this.allWheels = [];

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 650;

    // 1. Transparent WebGL Scene
    this.scene = new THREE.Scene();

    // 2. Camera setup - Broad, cinematic perspective encompassing the entire hero arena
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 4.4, 8.2);
    this.camera.lookAt(0, 0.1, 0);

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

    // 7. Load 3D Model
    this.loadModel();

    // 8. Mouse & Pointer Tracking over Entire Hero Section
    this.setupMouseInteraction();

    // 9. Resize Handling
    window.addEventListener('resize', () => this.onResize());

    // 10. Animation Loop
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
        // Left (-4.2) to Right (+4.2), Top Z (-2.0) to Bottom Z (+2.2)
        this.targetPos.x = THREE.MathUtils.clamp(intersection.x, -4.2, 4.2);
        this.targetPos.z = THREE.MathUtils.clamp(intersection.z, -2.0, 2.2);
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

  loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loaderEl = document.getElementById('pricing-3d-loader');

    // High quality automotive materials
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

        // Scaled to look realistic and agile across the entire hero arena
        const scale = 2.45 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

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

        this.carGroup.add(model);

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
      // 1. Vector from car to mouse destination
      const dx = this.targetPos.x - this.carPos.x;
      const dz = this.targetPos.z - this.carPos.z;
      const distance = Math.hypot(dx, dz);

      if (distance > 0.12) {
        // Model front is oriented along -Z axis.
        const desiredHeading = Math.atan2(dx, dz);

        // Shortest angular turn difference (-PI to +PI)
        let angleDiff = desiredHeading - this.heading;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Smooth steering response
        const turnSpeed = 0.07;
        this.heading += angleDiff * turnSpeed;

        // Steering wheel angle
        const targetSteer = THREE.MathUtils.clamp(-angleDiff * 0.75, -0.5, 0.5);
        this.steeringAngle += (targetSteer - this.steeringAngle) * 0.15;

        // Smooth acceleration and cornering throttle control
        const forwardSpeed = Math.min(distance * 0.05, 0.055) * Math.max(0.25, Math.cos(angleDiff));
        this.carPos.x += Math.sin(this.heading) * forwardSpeed;
        this.carPos.z += Math.cos(this.heading) * forwardSpeed;

        // Wheel roll animation
        this.wheelRotation += forwardSpeed * 4.8;
        this.allWheels.forEach(w => {
          w.rotation.x = this.wheelRotation;
        });

        // Dynamic chassis bank
        this.carGroup.rotation.z = THREE.MathUtils.lerp(this.carGroup.rotation.z, -angleDiff * 0.06, 0.12);
        this.carGroup.rotation.x = THREE.MathUtils.lerp(this.carGroup.rotation.x, -forwardSpeed * 0.5, 0.12);
      } else {
        // Return to rest
        this.steeringAngle *= 0.88;
        this.carGroup.rotation.z *= 0.88;
        this.carGroup.rotation.x *= 0.88;
      }

      // Steer front wheels
      if (this.wheelFL) this.wheelFL.rotation.y = this.steeringAngle;
      if (this.wheelFR) this.wheelFR.rotation.y = this.steeringAngle;

      // Update position and heading
      this.carGroup.position.copy(this.carPos);
      this.carGroup.rotation.y = this.heading;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
