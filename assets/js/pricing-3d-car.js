// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Complete Visual Perfection:
// 1. Zero clipping / cropped boundaries: Car stays 100% inside view frustum at all times
// 2. High-end Ferrari 458 Spider Metallic Nero Daytona & full interior shadering
// 3. True 3/4 Front Beauty View (Front bumper, headlights, hood, windshield, wheels facing viewer)
// 4. Smooth Mouse Parallax & Fluid Steering Tracking across hero section

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
    // Front 3/4 dynamic beauty angle:
    // With car facing -Z, rotation.y of ~2.45 rad angles the front bumper and front-left wheel toward the viewer
    this.baseRotationY = 2.45;
    this.baseRotationX = 0.05;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 650;
    const height = this.container.clientHeight || 560;

    // 1. Pure transparent WebGL Scene (Zero ground geometry, zero borders)
    this.scene = new THREE.Scene();

    // 2. Camera setup - Positioned with ample margin so entire car is visible without ANY cropping
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.set(0, 1.35, 5.4);
    this.camera.lookAt(0, 0.40, 0);

    // 3. High Performance Renderer with Alpha Transparency
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.30;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Automotive Lighting
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
    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambient);

    // Overhead Key Studio Softbox
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(2, 6, 4);
    this.scene.add(keyLight);

    // Front Headlight Accent & Fill Light (Illuminates front bumper and headlights)
    const frontKey = new THREE.DirectionalLight(0xffffff, 2.5);
    frontKey.position.set(0, 2.2, 5.0);
    this.scene.add(frontKey);

    // Electric Lime Rim Accent Light (Brand Identity)
    const rimLime = new THREE.DirectionalLight(0xD6FF36, 2.2);
    rimLime.position.set(-5, 3.5, 2);
    this.scene.add(rimLime);

    // Side Fill Light
    const fillLight = new THREE.DirectionalLight(0x9fc5ff, 1.8);
    fillLight.position.set(4, 2, 2);
    this.scene.add(fillLight);

    // Top Rim Light for roofline & windshield
    const roofLight = new THREE.DirectionalLight(0xffffff, 1.2);
    roofLight.position.set(0, 5, -2);
    this.scene.add(roofLight);
  }

  setupMouseInteraction() {
    window.addEventListener('mousemove', (e) => {
      // Normalize mouse coordinates (-1 to +1 from center of screen)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouse.targetX = x;
      this.mouse.targetY = y;
    });

    // Touch interaction for mobile devices
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

    // High quality automotive materials
    const metallicPaint = new THREE.MeshPhysicalMaterial({
      color: 0x0f141a,
      emissive: 0x040608,
      metalness: 0.90,
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

        // Calibrated scale to ensure car is bold yet completely fits the canvas without any edge clipping
        const scale = 3.65 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child.isMesh) {
            const name = (child.name || '').toLowerCase();
            const matName = (child.material && child.material.name ? child.material.name : '').toLowerCase();

            // Leather interior & seats (prevents seats from showing bright lime/white raw unshaded faces)
            if (name.includes('leather') || matName.includes('leather') || name.includes('interior_light') || matName.includes('interior_light') || name.includes('carpet') || matName.includes('carpet')) {
              child.material = luxuryLeather;
            }
            // Body paint / metal
            else if (name.includes('body') || matName.includes('body_color') || name.includes('metal') || matName.includes('leather_red')) {
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

    // Smooth mouse interpolation (spring easing damping)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.045;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.045;

    // Fluid car steering & travel towards mouse cursor across the hero section:
    if (this.carGroup) {
      // 1. Car steers smoothly toward cursor position
      this.carGroup.rotation.y = this.baseRotationY + this.mouse.x * 0.45;
      // 2. Pitch / tilt slightly with vertical mouse position
      this.carGroup.rotation.x = this.baseRotationX - this.mouse.y * 0.12;
      // 3. Realistic chassis bank / lean into the turn
      this.carGroup.rotation.z = -this.mouse.x * 0.04;
      // 4. Car travels smoothly across the hero section towards mouse position (well bounded)
      this.carGroup.position.x = this.mouse.x * 0.22;
      this.carGroup.position.y = this.mouse.y * 0.10;
      this.carGroup.position.z = -this.mouse.y * 0.15;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
