// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Features:
// 1. Zero Outline Borders: 100% transparent WebGL canvas with NO ground plane geometry, NO clipped textures, and NO rectangular boundary lines.
// 2. Front 3/4 Showcase Angle: Front headlights, bumper, wheels, and hood face the viewer prominently.
// 3. Smooth Mouse Travel & Focus: Moving the cursor across the hero section smoothly steers the car, rolls the chassis, and translates the car along the hero area.
// 4. Photorealistic Automotive Materials: Deep gloss metallic obsidian paint, tinted automotive glass, brushed alloy wheels, chrome accents, and illuminated LEDs.

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

    // Mouse coordinates normalized (-1 to +1)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    // Car root rotation offsets
    this.carRoot = null;
    // Front 3/4 beauty view: Front of the car (negative Z in model space) rotated to face the camera/viewer
    // Rotation of ~2.55 rad (approx 146 deg) positions the front bumper, headlights, and front-left wheel dynamically facing the user
    this.baseRotationY = 2.55;
    this.baseRotationX = 0.08;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 650;
    const height = this.container.clientHeight || 560;

    // 1. Pure transparent WebGL Scene (No background meshes, zero borders)
    this.scene = new THREE.Scene();

    // 2. Camera setup - Positioned for dynamic 3/4 front beauty perspective
    this.camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    this.camera.position.set(0, 1.25, 4.6);
    this.camera.lookAt(0, 0.38, 0);

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

    // 4. Studio Automotive Lighting tuned for Front-Facing Supercar
    this.setupLighting();

    // 5. Car Root Group (Holds model and travels/turns smoothly with mouse focus)
    this.carGroup = new THREE.Group();
    this.carGroup.rotation.y = this.baseRotationY;
    this.carGroup.rotation.x = this.baseRotationX;
    this.scene.add(this.carGroup);

    // 6. Load & Shaderize 3D Model
    this.loadModel();

    // 7. Mouse Move Focus Interaction over Hero Section
    this.setupMouseInteraction();

    // 8. Resize Handling
    window.addEventListener('resize', () => this.onResize());

    // 9. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient Light for soft baseline illumination
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    // Overhead Key Studio Softbox
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(2, 6, 4);
    this.scene.add(keyLight);

    // Front Headlight Accent & Fill Light (Illuminates front bumper and headlights)
    const frontKey = new THREE.DirectionalLight(0xffffff, 2.8);
    frontKey.position.set(0, 2.5, 5.5);
    this.scene.add(frontKey);

    // Electric Lime Rim Accent Light (Brand Identity on body contour)
    const rimLime = new THREE.DirectionalLight(0xD6FF36, 2.5);
    rimLime.position.set(-5, 3.5, 2);
    this.scene.add(rimLime);

    // Side Fill Light to reveal car doors and wheels
    const fillLight = new THREE.DirectionalLight(0x9fc5ff, 2.0);
    fillLight.position.set(4, 2, 2);
    this.scene.add(fillLight);

    // Top Rim Light for roofline & windshield
    const roofLight = new THREE.DirectionalLight(0xffffff, 1.5);
    roofLight.position.set(0, 5, -2);
    this.scene.add(roofLight);
  }

  setupMouseInteraction() {
    // Listen to mouse movement over hero section or entire window
    window.addEventListener('mousemove', (e) => {
      // Normalize mouse coordinates (-1 to +1 from center of screen)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouse.targetX = x;
      this.mouse.targetY = y;
    });

    // Touch interaction for mobile / tablet devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        this.mouse.targetX = x * 0.8;
        this.mouse.targetY = y * 0.8;
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
      color: 0x0e1319,
      emissive: 0x05070a,
      metalness: 0.90,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98
    });

    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: 0x090e14,
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
      color: 0x15171a,
      roughness: 0.82,
      metalness: 0.05
    });

    const carbonTrim = new THREE.MeshStandardMaterial({
      color: 0x1c2127,
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

        // Increased scale for larger, hero-commanding presence
        const scale = 4.35 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child.isMesh) {
            const name = (child.name || '').toLowerCase();
            const matName = (child.material && child.material.name ? child.material.name : '').toLowerCase();

            // Body paint / metal
            if (name.includes('body') || matName.includes('body_color') || name.includes('metal') || matName.includes('leather_red')) {
              child.material = metallicPaint;
            }
            // Windows & glass
            else if (name.includes('glass') || matName.includes('glass') || name.includes('window')) {
              child.material = tintedGlass;
            }
            // Chrome details
            else if (name.includes('chrome') || matName.includes('chrome') || name.includes('exhaust')) {
              child.material = chromeMetal;
            }
            // Rims & alloy wheels
            else if (name.includes('wheel') || name.includes('rim') || matName.includes('metal_gray') || name.includes('brakes')) {
              child.material = alloyRim;
            }
            // Tires
            else if (name.includes('tire') || matName.includes('tires')) {
              child.material = tireRubber;
            }
            // Carbon trims / grills
            else if (name.includes('carbon') || matName.includes('carbon') || name.includes('plastic') || name.includes('grill') || matName.includes('plastic_gray') || name.includes('trim')) {
              child.material = carbonTrim;
            }
            // Headlights
            else if (name.includes('led') || matName.includes('turn_signal') || (name.includes('lights') && !name.includes('red'))) {
              child.material = headlightLens;
            }
            // Taillights
            else if (name.includes('lights_red') || matName.includes('taillight')) {
              child.material = taillightRuby;
            }
            else if (child.material) {
              child.material.roughness = 0.25;
              child.material.metalness = 0.75;
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

    // Smooth mouse interpolation (spring easing damping)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.045;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.045;

    // Fluid car steering & travel towards mouse cursor across the hero section:
    if (this.carGroup) {
      // 1. Car steers smoothly toward cursor position
      this.carGroup.rotation.y = this.baseRotationY + this.mouse.x * 0.52;
      // 2. Pitch / tilt slightly with vertical mouse position
      this.carGroup.rotation.x = this.baseRotationX - this.mouse.y * 0.16;
      // 3. Realistic chassis bank / lean into the turn
      this.carGroup.rotation.z = -this.mouse.x * 0.05;
      // 4. Car travels smoothly across the hero section towards mouse position
      this.carGroup.position.x = this.mouse.x * 0.42;
      this.carGroup.position.y = this.mouse.y * 0.18;
      this.carGroup.position.z = -this.mouse.y * 0.25;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
