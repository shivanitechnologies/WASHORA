// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Features:
// 1. Zero Outline Borders: Removed square shadow plane and clipped mesh borders. Soft radial contact shadow directly underneath wheels.
// 2. No Continuous Auto-Rotation: Fixed initial luxury beauty angle.
// 3. Interactive Mouse Parallax & Focus: The car turns, rolls, and pitches gently in response to mouse movement across the hero section.
// 4. Photorealistic Automotive Materials: Deep gloss metallic paint with reflections, realistic glass, chrome, alloy rims, rubber tires, and interior lighting.

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
    this.baseRotationY = -0.45; // Hero 3/4 angle facing front-left
    this.baseRotationX = 0.04;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // 1. Pure transparent WebGL Scene
    this.scene = new THREE.Scene();

    // 2. Camera setup - Positioned for dynamic 3/4 beauty view
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    this.camera.position.set(0, 1.25, 4.8);
    this.camera.lookAt(0, 0.42, 0);

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

    // 5. Soft Circular Ground Contact Shadow (Soft radial texture, ZERO rectangular borders)
    this.setupRadialContactShadow();

    // 6. Car Root Group (Holds model and rotates smoothly with mouse movement)
    this.carGroup = new THREE.Group();
    this.carGroup.rotation.y = this.baseRotationY;
    this.carGroup.rotation.x = this.baseRotationX;
    this.scene.add(this.carGroup);

    // 7. Load & Shaderize 3D Model
    this.loadModel();

    // 8. Mouse Move Focus Interaction over Hero Section
    this.setupMouseInteraction();

    // 9. Resize Handling
    window.addEventListener('resize', () => this.onResize());

    // 10. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    // Overhead Key Studio Softbox
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 7, 4);
    this.scene.add(keyLight);

    // Electric Lime Rim Accent Light (Brand Identity)
    const rimLime = new THREE.DirectionalLight(0xD6FF36, 2.4);
    rimLime.position.set(-5, 3.5, -4);
    this.scene.add(rimLime);

    // Front-Left Fill Light
    const fillLight = new THREE.DirectionalLight(0x9fc5ff, 1.8);
    fillLight.position.set(-4, 2, 4);
    this.scene.add(fillLight);

    // Rear Fill Light to reveal car lines
    const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backLight.position.set(4, 2, -4);
    this.scene.add(backLight);
  }

  setupRadialContactShadow() {
    // Generate a procedural radial gradient canvas for a smooth contact shadow with ZERO rectangular cutoffs
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Oval gradient
    const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.35)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;

    const shadowGeo = new THREE.PlaneGeometry(4.4, 2.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      opacity: 0.85
    });

    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01; // Just above ground
    this.scene.add(contactShadow);
  }

  setupMouseInteraction() {
    // Listen to mouse movement over hero section or entire window
    const targetArea = document.querySelector('section') || window;

    window.addEventListener('mousemove', (e) => {
      // Normalize mouse coordinates from center (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouse.targetX = x;
      this.mouse.targetY = y;
    });

    // Mobile touch interaction
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        this.mouse.targetX = x * 0.7;
        this.mouse.targetY = y * 0.7;
      }
    }, { passive: true });
  }

  loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loaderEl = document.getElementById('pricing-3d-loader');

    // High quality automotive shaders
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
      roughness: 0.06,
      transmission: 0.88,
      transparent: true,
      opacity: 0.80,
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
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.2
    });

    const taillightRuby = new THREE.MeshPhysicalMaterial({
      color: 0xbb0f1a,
      emissive: 0x88050e,
      emissiveIntensity: 0.6,
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

        const scale = 3.6 / Math.max(size.x, size.z);
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

    // Smooth mouse interpolation (ease damping)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Subtle 3D mouse focus tracking:
    // Car turns towards cursor horizontally & tilts slightly vertically
    if (this.carGroup) {
      this.carGroup.rotation.y = this.baseRotationY + this.mouse.x * 0.55; // Horizontal turn
      this.carGroup.rotation.x = this.baseRotationX - this.mouse.y * 0.18; // Vertical tilt
      this.carGroup.rotation.z = this.mouse.x * -0.05; // Slight chassis roll
      this.carGroup.position.x = this.mouse.x * 0.12;  // Slight translation
      this.carGroup.position.y = this.mouse.y * 0.08;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
