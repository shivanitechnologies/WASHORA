// CAR SHINE - Three.js 3D Audi RS7 Cinematic Hero Scene Controller
// Implements the exact requested 8-second cinematic sequence:
// 0-2s: Headlight reveal in darkness
// 2-4s: Car drives forward, 4 wheels rotate, headlights cast beam on floor
// 4-6s: Overhead studio spotlights power on and reveal the high-gloss metallic paint
// 6-8s: Car smoothly turns and settles into final showcase pose (text reveals cleanly on left)

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CarShineScene {
  constructor(canvasContainerId, options = {}) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) {
      console.warn('Canvas container not found:', canvasContainerId);
      return;
    }

    this.options = Object.assign({
      modelPath: 'assets/models/car.glb',
      autoPlay: true,
      allowOrbitAfterReveal: true,
      onLoadProgress: null,
      onModelLoaded: null,
      onSequenceComplete: null,
      onTimeUpdate: null
    }, options);

    this.init();
  }

  init() {
    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0d11);
    this.scene.fog = new THREE.FogExp2(0x0a0d11, 0.04);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.45, 6.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // 2. Reflective Studio Floor Grid
    this.createStudioFloor();

    // 3. Cinematic Studio Lighting Rig
    this.createLighting();

    // 4. Wheels & Car state
    this.wheels = [];
    this.carRoot = new THREE.Group();
    this.scene.add(this.carRoot);

    // 5. Load 3D Vehicle Model
    this.loadCarModel();

    // 6. Interactive Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't clip through floor
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 12;
    this.controls.target.set(0.6, 0.5, 0);
    this.controls.enabled = false; // Disabled during the 8s cinematic sequence

    // 7. Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 8. Animation clock & timeline
    this.clock = new THREE.Clock();
    this.currentTime = 0;
    this.isPlaying = true;
    this.isCompleted = false;

    this.animate();
  }

  createStudioFloor() {
    // Reflective dark floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080a0d,
      roughness: 0.28,
      metalness: 0.85
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.01;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Circular studio turntable ring indicator
    const ringGeo = new THREE.RingGeometry(2.8, 2.84, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x252e35, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    this.scene.add(ring);
  }

  createLighting() {
    // Ambient light - starts pitch black for headlight reveal
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    this.scene.add(this.ambientLight);

    // Headlight left & right spot projectors
    this.headlightL = new THREE.SpotLight(0xd6ff36, 0, 18, Math.PI / 6, 0.5, 1.2);
    this.headlightR = new THREE.SpotLight(0xd6ff36, 0, 18, Math.PI / 6, 0.5, 1.2);

    this.headlightLTarget = new THREE.Object3D();
    this.headlightRTarget = new THREE.Object3D();
    this.scene.add(this.headlightLTarget);
    this.scene.add(this.headlightRTarget);

    this.headlightL.target = this.headlightLTarget;
    this.headlightR.target = this.headlightRTarget;
    this.scene.add(this.headlightL);
    this.scene.add(this.headlightR);

    // Overhead Studio Spotlights (reveal during 4-6s)
    this.studioSpotL = new THREE.SpotLight(0xffffff, 0, 25, Math.PI / 4, 0.4, 1.5);
    this.studioSpotL.position.set(-3.5, 6, 2.5);
    this.studioSpotL.castShadow = true;
    this.studioSpotL.shadow.bias = -0.001;
    this.studioSpotL.shadow.mapSize.width = 1024;
    this.studioSpotL.shadow.mapSize.height = 1024;
    this.scene.add(this.studioSpotL);

    this.studioSpotR = new THREE.SpotLight(0xe8f0ff, 0, 25, Math.PI / 4, 0.4, 1.5);
    this.studioSpotR.position.set(3.5, 6, 2.5);
    this.studioSpotR.castShadow = true;
    this.studioSpotR.shadow.bias = -0.001;
    this.studioSpotR.shadow.mapSize.width = 1024;
    this.studioSpotR.shadow.mapSize.height = 1024;
    this.scene.add(this.studioSpotR);

    // Rim / Backlight for aggressive Audi RS7 silhouette
    this.rimLight = new THREE.DirectionalLight(0xd6ff36, 0);
    this.rimLight.position.set(0, 3, -6);
    this.scene.add(this.rimLight);
  }

  loadCarModel() {
    const loader = new GLTFLoader();
    
    loader.load(
      this.options.modelPath,
      (gltf) => {
        this.carModel = gltf.scene;

        // Center and scale car
        const bbox = new THREE.Box3().setFromObject(this.carModel);
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        this.carModel.scale.set(scale, scale, scale);

        // Re-center on ground
        bbox.setFromObject(this.carModel);
        this.carModel.position.y = -bbox.min.y;

        // Collect wheels and customize materials for realistic obsidian black clearcoat
        this.wheels = [];
        this.carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = child.name.toLowerCase();

            // High-gloss deep metallic paint
            if (name.includes('body') || name.includes('metal') || name.includes('yellow_trim')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x11161b,
                metalness: 0.9,
                roughness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                reflectivity: 0.95
              });
            }

            // Glass
            if (name.includes('glass')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x05070a,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.9,
                transparent: true,
                opacity: 0.85
              });
            }

            // Headlights (LED glow)
            if (name.includes('lights') || name.includes('leds')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xd6ff36,
                emissive: 0xd6ff36,
                emissiveIntensity: 0
              });
              this.headlightMesh = child;
            }
          }

          // Tag wheels
          const nodeName = child.name.toLowerCase();
          if (nodeName.includes('wheel_') || nodeName.includes('wheel') && !nodeName.includes('steering')) {
            this.wheels.push(child);
          }
        });

        this.carRoot.add(this.carModel);

        // Initial placement: Far back in darkness along Z
        this.carRoot.position.set(0, 0, -4.5);
        this.carRoot.rotation.set(0, 0, 0);

        if (typeof this.options.onModelLoaded === 'function') {
          this.options.onModelLoaded();
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && typeof this.options.onLoadProgress === 'function') {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          this.options.onLoadProgress(percent);
        }
      },
      (err) => {
        console.error('Error loading 3D Car GLB:', err);
        // Fallback: create placeholder vehicle geometry if GLB fetch fails on restricted networks
        this.createFallbackCar();
        if (typeof this.options.onModelLoaded === 'function') {
          this.options.onModelLoaded();
        }
      }
    );
  }

  createFallbackCar() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x11161b,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.65, 3.4), bodyMat);
    cabin.position.y = 0.65;
    cabin.castShadow = true;
    group.add(cabin);

    this.carModel = group;
    this.carRoot.add(this.carModel);
    this.carRoot.position.set(0, 0, -4.5);
  }

  updateTimeline(t) {
    if (!this.carModel) return;

    // Headlight position tracking car front
    const carPos = this.carRoot.position;
    this.headlightL.position.set(carPos.x - 0.7, carPos.y + 0.65, carPos.z + 1.8);
    this.headlightR.position.set(carPos.x + 0.7, carPos.y + 0.65, carPos.z + 1.8);
    this.headlightLTarget.position.set(carPos.x - 1.2, 0, carPos.z + 9);
    this.headlightRTarget.position.set(carPos.x + 1.2, 0, carPos.z + 9);

    // ==========================================
    // 0.0s – 2.0s: HEADLIGHT REVEAL
    // Black environment. Only dual headlights illuminate & beam forward.
    // ==========================================
    if (t < 2.0) {
      const progress = Math.min(t / 1.5, 1.0);
      const ease = Math.pow(progress, 2);

      this.ambientLight.intensity = 0.02;
      this.studioSpotL.intensity = 0;
      this.studioSpotR.intensity = 0;
      this.rimLight.intensity = ease * 0.4;

      const beamPower = ease * 45;
      this.headlightL.intensity = beamPower;
      this.headlightR.intensity = beamPower;

      if (this.headlightMesh && this.headlightMesh.material) {
        this.headlightMesh.material.emissiveIntensity = ease * 3.5;
      }

      this.carRoot.position.set(0, 0, -4.5);
      this.carRoot.rotation.set(0, 0, 0);
    }

    // ==========================================
    // 2.0s – 4.0s: CAR MOVEMENT FORWARD
    // Car accelerates out of darkness, 4 wheels rotate, beams illuminate floor.
    // ==========================================
    else if (t < 4.0) {
      const subT = (t - 2.0) / 2.0; // 0 -> 1
      const ease = 0.5 - Math.cos(subT * Math.PI) * 0.5;

      // Z moves from -4.5 to 0.0
      this.carRoot.position.z = -4.5 + ease * 4.5;
      this.carRoot.position.x = 0;
      this.carRoot.rotation.y = 0;

      // Rotate wheels forward proportionally
      const wheelDelta = (subT * 4.5 * 3.2);
      this.wheels.forEach(w => {
        w.rotation.x = wheelDelta;
      });

      this.headlightL.intensity = 45;
      this.headlightR.intensity = 45;
      this.ambientLight.intensity = 0.05 + ease * 0.15;
    }

    // ==========================================
    // 4.0s – 6.0s: SPOTLIGHT REVEAL
    // Dual overhead spotlights power on, revealing glossy metallic clear coat.
    // ==========================================
    else if (t < 6.0) {
      const subT = (t - 4.0) / 2.0; // 0 -> 1
      const spotEase = Math.pow(subT, 1.5);

      this.studioSpotL.intensity = spotEase * 65;
      this.studioSpotR.intensity = spotEase * 65;
      this.ambientLight.intensity = 0.2 + spotEase * 0.45;
      this.rimLight.intensity = 0.4 + spotEase * 0.8;

      // Subtle dynamic camera track closer
      this.camera.position.x = Math.sin(subT * 0.3) * -0.4;
      this.camera.position.y = 1.45 - subT * 0.15;
    }

    // ==========================================
    // 6.0s – 8.0s: FINAL POSITION
    // Car turns gracefully, moves right and stops.
    // Left side stays open for the hero website copy & CTAs.
    // ==========================================
    else if (t <= 8.5) {
      const subT = Math.min((t - 6.0) / 2.0, 1.0); // 0 -> 1
      const ease = 0.5 - Math.cos(subT * Math.PI) * 0.5;

      // Move right from 0 to +1.35 along X
      this.carRoot.position.x = ease * 1.35;
      // Slight quarter-turn angle to show side & front profile
      this.carRoot.rotation.y = -ease * 0.38;

      // Subtle wheel roll while shifting
      this.wheels.forEach(w => {
        w.rotation.x = 4.5 * 3.2 + ease * 1.2;
      });

      // Lighting remains fully locked on
      this.studioSpotL.intensity = 65;
      this.studioSpotR.intensity = 65;
      this.ambientLight.intensity = 0.65;
      this.rimLight.intensity = 1.2;

      if (t >= 8.0 && !this.isCompleted) {
        this.isCompleted = true;
        this.controls.enabled = this.options.allowOrbitAfterReveal;
        if (typeof this.options.onSequenceComplete === 'function') {
          this.options.onSequenceComplete();
        }
      }
    }

    // Pass time update callback if hooked
    if (typeof this.options.onTimeUpdate === 'function') {
      this.options.onTimeUpdate(t);
    }
  }

  restart() {
    this.currentTime = 0;
    this.isCompleted = false;
    this.controls.enabled = false;
    this.camera.position.set(0, 1.45, 6.2);
    this.controls.target.set(0.6, 0.5, 0);
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    if (this.isPlaying && this.currentTime < 8.5) {
      this.currentTime += delta;
      this.updateTimeline(this.currentTime);
    }

    // Keep gentle showroom turntable rotation after sequence completes if user is not dragging
    if (this.isCompleted && !this.controls.state) {
      this.carRoot.rotation.y += 0.0015;
    }

    if (this.controls.enabled) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.CarShineScene = CarShineScene;
