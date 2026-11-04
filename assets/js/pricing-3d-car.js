// CAR SHINE - Dedicated 3D Interactive Car Showcase Controller for Pricing Hero
// Renders photorealistic automotive materials:
// - Obsidian Deep Black Metallic Clearcoat Paint (Glossy studio reflections)
// - Realistic Tinted Automotive Glass with transmission & refraction
// - Polished Chrome & Brushed Alloy Wheels
// - Carbon Fiber & Matte Trim
// - Glowing Headlights & Tail Lamp Optics

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Pricing3DCarCard {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      modelPath: 'assets/models/car.glb',
      autoRotate: true
    }, options);

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 560;
    const height = this.container.clientHeight || 460;

    // 1. Pure transparent scene - NO dark box background
    this.scene = new THREE.Scene();

    // 2. Camera: 3/4 beauty hero angle
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(3.4, 1.45, 3.8);

    // 3. High quality WebGL Renderer with Alpha Transparency
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Environment Lighting Setup
    this.setupStudioLighting();

    // 5. Soft Ground Shadow Plane (Purely catches car shadow, transparent otherwise)
    this.setupContactShadow();

    // 6. Smooth Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 2.6;
    this.controls.maxDistance = 7.0;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.autoRotate = this.options.autoRotate;
    this.controls.autoRotateSpeed = 1.3;
    this.controls.target.set(0, 0.42, 0);

    // 7. Load & Apply Photorealistic Automotive Shaders
    this.loadPhotorealisticModel();

    // 8. Handle Window Resize
    window.addEventListener('resize', () => this.onResize());

    // 9. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupStudioLighting() {
    // Soft Ambient Fill
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambient);

    // Overhead Key Studio Softbox (creates beautiful clearcoat roof & bonnet highlights)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4.5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    // Electric Lime Accent Rim Light (Brand identity rim reflection along shoulders)
    const rimLime = new THREE.DirectionalLight(0xD6FF36, 2.2);
    rimLime.position.set(-5, 3.5, -4.5);
    this.scene.add(rimLime);

    // Front-Left Soft Cool Studio Fill
    const fillLight = new THREE.DirectionalLight(0xbad4ff, 1.8);
    fillLight.position.set(-4, 2.5, 4);
    this.scene.add(fillLight);

    // Ground Bounce Light for undercarriage & wheel wells
    const bounceLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bounceLight.position.set(0, -3, 0);
    this.scene.add(bounceLight);
  }

  setupContactShadow() {
    // Pure shadow receiver plane (100% transparent except where car casts shadow)
    const planeGeo = new THREE.PlaneGeometry(16, 16);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(planeGeo, planeMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  loadPhotorealisticModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loaderEl = document.getElementById('pricing-3d-loader');

    // Create Shared Real-World Automotive Materials
    // 1. Midnight Obsidian Black Metallic Paint (Deep, glossy, double-clearcoat like real luxury cars)
    const metallicCarPaint = new THREE.MeshPhysicalMaterial({
      color: 0x11161d,
      emissive: 0x05070a,
      metalness: 0.88,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98,
      envMapIntensity: 1.8
    });

    // 2. High-End Tinted Automotive Windshield & Window Glass
    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: 0x0b1016,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.88,
      transparent: true,
      opacity: 0.75,
      ior: 1.52,
      reflectivity: 0.95
    });

    // 3. Polished Chrome (Emblems, exhaust tips, mirror stalks)
    const chromeMetal = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8,
      metalness: 0.96,
      roughness: 0.08,
      envMapIntensity: 2.0
    });

    // 4. Brushed Silver Alloy Wheels & Rims
    const alloyRim = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.4
    });

    // 5. Matte Rubber Tires
    const tireRubber = new THREE.MeshStandardMaterial({
      color: 0x181a1d,
      roughness: 0.78,
      metalness: 0.05
    });

    // 6. Carbon Fiber & Dark Matte Aerodynamic Trims
    const carbonTrim = new THREE.MeshStandardMaterial({
      color: 0x1c2128,
      roughness: 0.35,
      metalness: 0.4
    });

    // 7. Glowing Headlight Lenses
    const headlightLens = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xd6ff36,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.2
    });

    // 8. Ruby Red Tail Lamps
    const taillightRuby = new THREE.MeshPhysicalMaterial({
      color: 0xaa0e18,
      emissive: 0x77050d,
      emissiveIntensity: 0.5,
      transmission: 0.6,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1
    });

    gltfLoader.load(
      this.options.modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Auto-compute bounding box to center & scale car perfectly
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        const scale = 3.6 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

        // Traverse and replace cartoonish/flat materials with photorealistic shaders
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = (child.name || '').toLowerCase();
            const matName = (child.material && child.material.name ? child.material.name : '').toLowerCase();

            // Body paint / metal panels
            if (name.includes('body') || matName.includes('body_color') || name.includes('metal') || matName.includes('leather_red')) {
              child.material = metallicCarPaint;
            }
            // Glass windows / windshields
            else if (name.includes('glass') || matName.includes('glass') || name.includes('window')) {
              child.material = tintedGlass;
            }
            // Chrome / bright metallic accents
            else if (name.includes('chrome') || matName.includes('chrome') || name.includes('exhaust')) {
              child.material = chromeMetal;
            }
            // Rims / wheels / brakes
            else if (name.includes('wheel') || name.includes('rim') || matName.includes('metal_gray') || name.includes('brakes')) {
              child.material = alloyRim;
            }
            // Tires / rubber
            else if (name.includes('tire') || matName.includes('tires')) {
              child.material = tireRubber;
            }
            // Carbon fiber / spoilers / diffusers
            else if (name.includes('carbon') || matName.includes('carbon') || name.includes('plastic') || name.includes('grill') || matName.includes('plastic_gray')) {
              child.material = carbonTrim;
            }
            // Headlights
            else if (name.includes('led') || matName.includes('turn_signal') || name.includes('lights') && !name.includes('red')) {
              child.material = headlightLens;
            }
            // Taillights
            else if (name.includes('lights_red') || matName.includes('taillight')) {
              child.material = taillightRuby;
            }
            // Default fallback
            else if (child.material) {
              child.material.roughness = 0.25;
              child.material.metalness = 0.75;
            }
          }
        });

        this.carModel = model;
        this.scene.add(model);

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
        console.warn('Error loading 3D car model:', err);
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
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
