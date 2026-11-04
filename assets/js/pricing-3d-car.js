// CAR SHINE - Dedicated 3D Interactive Car Card Controller for Pricing Hero
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
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 420;

    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(3.2, 1.4, 4.2);

    // 3. Renderer with transparency and high performance
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting
    this.setupLighting();

    // 5. Studio Floor with soft shadow & reflection
    this.setupFloor();

    // 6. Interactive Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 2.8;
    this.controls.maxDistance = 7.5;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera dipping below floor
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.autoRotate = this.options.autoRotate;
    this.controls.autoRotateSpeed = 1.4;
    this.controls.target.set(0, 0.45, 0);

    // 7. Load Car Model
    this.loadModel();

    // 8. Resize Listener
    window.addEventListener('resize', () => this.onResize());

    // 9. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    // Overhead Key Studio Softbox
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.bias = -0.0005;
    this.scene.add(mainLight);

    // Electric Lime Rim / Accent Light from behind
    const rimLight = new THREE.DirectionalLight(0xD6FF36, 2.0);
    rimLight.position.set(-4, 3, -4);
    this.scene.add(rimLight);

    // Cool Fill Light from front-left
    const fillLight = new THREE.DirectionalLight(0x70a5ff, 1.2);
    fillLight.position.set(-4, 2, 4);
    this.scene.add(fillLight);
  }

  setupFloor() {
    // Soft shadow receiver plane
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const floor = new THREE.Mesh(planeGeo, planeMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loaderEl = document.getElementById('pricing-3d-loader');

    gltfLoader.load(
      this.options.modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Auto-compute bounding box to center & scale car perfectly
        const bbox = new THREE.Box3().setFromObject(model);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        // Desired car length ~ 3.6 units
        const scale = 3.6 / Math.max(size.x, size.z);
        model.scale.setScalar(scale);

        // Center car on floor at y=0
        model.position.x = -center.x * scale;
        model.position.y = -bbox.min.y * scale;
        model.position.z = -center.z * scale;

        // Enhance metallic car paint materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.5;
              if (child.material.name && child.material.name.toLowerCase().includes('paint')) {
                child.material.roughness = 0.12;
                child.material.metalness = 0.88;
                child.material.clearcoat = 1.0;
                child.material.clearcoatRoughness = 0.05;
              }
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
        console.warn('Error loading 3D car model for pricing card:', err);
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
