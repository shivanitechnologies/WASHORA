// CAR SHINE - Three.js 3D Audi RS7 Cinematic Hero Scene Controller
// Full Feature Set:
// 1. Realistic Headlights & Taillights with Volumetric Beam Cones
// 2. Realistic 4-Wheel Spinning proportional to vehicle speed
// 3. Opening Door Animation Sequence with Interior Reveal
// 4. Studio Turntable Showcase with 360° Orbit Mode

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
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
    this.scene.background = new THREE.Color(0x080b0f);
    this.scene.fog = new THREE.FogExp2(0x080b0f, 0.035);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(-1.2, 1.35, 5.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // 2. Studio Floor & Turntable
    this.createStudioFloor();

    // 3. Studio Lighting Rig & Headlights
    this.createLighting();

    // 4. Car Hierarchy
    this.carRoot = new THREE.Group();
    this.scene.add(this.carRoot);

    // Door Pivot Groups for Opening Doors
    this.doorLeftGroup = new THREE.Group();
    this.doorRightGroup = new THREE.Group();

    // 5. Load 3D Vehicle Model
    this.loadCarModel();

    // 6. Interactive Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 12;
    this.controls.target.set(0.6, 0.5, 0);
    this.controls.enabled = false;

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
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x06080b,
      roughness: 0.25,
      metalness: 0.9
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.01;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Turntable accent ring
    const ringGeo = new THREE.RingGeometry(2.9, 2.94, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd6ff36, side: THREE.DoubleSide, opacity: 0.4, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    this.scene.add(ring);
  }

  createLighting() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    this.scene.add(this.ambientLight);

    // Headlight Spotlights (Forward along +Z)
    this.headlightL = new THREE.SpotLight(0xf4ffc2, 0, 22, Math.PI / 5, 0.45, 1.2);
    this.headlightR = new THREE.SpotLight(0xf4ffc2, 0, 22, Math.PI / 5, 0.45, 1.2);

    this.headlightLTarget = new THREE.Object3D();
    this.headlightRTarget = new THREE.Object3D();
    this.scene.add(this.headlightLTarget);
    this.scene.add(this.headlightRTarget);

    this.headlightL.target = this.headlightLTarget;
    this.headlightR.target = this.headlightRTarget;
    this.scene.add(this.headlightL);
    this.scene.add(this.headlightR);

    // Visual Volumetric Light Cones for Headlights
    const coneGeo = new THREE.ConeGeometry(0.85, 4.5, 32, 1, true);
    coneGeo.translate(0, -2.25, 0);
    coneGeo.rotateX(-Math.PI / 2);

    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xd6ff36,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.lightConeL = new THREE.Mesh(coneGeo, coneMat);
    this.lightConeR = new THREE.Mesh(coneGeo, coneMat.clone());
    this.carRoot.add(this.lightConeL);
    this.carRoot.add(this.lightConeR);

    // Position light cones on front bumper
    this.lightConeL.position.set(-0.62, 0.48, 1.95);
    this.lightConeR.position.set(0.62, 0.48, 1.95);

    // Overhead Studio Spotlights
    this.studioSpotL = new THREE.SpotLight(0xffffff, 0, 25, Math.PI / 4, 0.4, 1.5);
    this.studioSpotL.position.set(-3.5, 6, 2.5);
    this.studioSpotL.castShadow = true;
    this.studioSpotL.shadow.bias = -0.001;
    this.studioSpotL.shadow.mapSize.width = 1024;
    this.studioSpotL.shadow.mapSize.height = 1024;
    this.scene.add(this.studioSpotL);

    this.studioSpotR = new THREE.SpotLight(0xdff0ff, 0, 25, Math.PI / 4, 0.4, 1.5);
    this.studioSpotR.position.set(3.5, 6, 2.5);
    this.studioSpotR.castShadow = true;
    this.studioSpotR.shadow.bias = -0.001;
    this.studioSpotR.shadow.mapSize.width = 1024;
    this.studioSpotR.shadow.mapSize.height = 1024;
    this.scene.add(this.studioSpotR);

    // Aggressive Rear Rim Light
    this.rimLight = new THREE.DirectionalLight(0xd6ff36, 0);
    this.rimLight.position.set(0, 3, -6);
    this.scene.add(this.rimLight);
  }

  loadCarModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/vendor/three/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      this.options.modelPath,
      (gltf) => {
        this.carModel = gltf.scene;

        // The model's front is facing -Z in local coords; rotate 180° so front faces +Z toward camera
        this.carModel.rotation.y = Math.PI;

        // Center and scale car
        const bbox = new THREE.Box3().setFromObject(this.carModel);
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        this.carModel.scale.set(scale, scale, scale);

        // Re-align on ground
        bbox.setFromObject(this.carModel);
        this.carModel.position.y = -bbox.min.y;

        // Find individual wheel nodes & construct door pivots
        this.wheelNodes = [];
        this.headlightMeshes = [];

        this.carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = child.name.toLowerCase();

            // Premium Obsidian Black Metallic Paint
            if (name.includes('body') || name.includes('metal') || name.includes('yellow_trim')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x0c1015,
                metalness: 0.92,
                roughness: 0.14,
                clearcoat: 1.0,
                clearcoatRoughness: 0.04,
                reflectivity: 0.98
              });
            }

            // Glass
            if (name.includes('glass')) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x05070a,
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.92,
                transparent: true,
                opacity: 0.85
              });
            }

            // Headlights & LEDs
            if (name.includes('lights') || name.includes('leds')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xd6ff36,
                emissive: 0xd6ff36,
                emissiveIntensity: 0
              });
              this.headlightMeshes.push(child);
            }
          }

          // Exact Wheel Nodes in model
          const n = child.name.toLowerCase();
          if (n === 'wheel_fl' || n === 'wheel_fr' || n === 'wheel_rl' || n === 'wheel_rr') {
            this.wheelNodes.push(child);
          }
        });

        // Setup Opening Door Rig:
        // Create stylish gullwing / frameless opening door panel attached to car
        this.createDoorRig();

        this.carRoot.add(this.carModel);

        // Initial Position: Far back in darkness along Z
        this.carRoot.position.set(0, 0, -4.5);

        console.log('Real 3D Vehicle Ready! Found Wheels:', this.wheelNodes.length);

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
      }
    );
  }

  createDoorRig() {
    // Elegant luxury door assembly on driver side (left)
    const doorMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c1015,
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });

    const windowMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85
    });

    // Left Door Pivot located at car hinge (front of door)
    this.leftDoorPivot = new THREE.Group();
    this.leftDoorPivot.position.set(-0.76, 0.58, 0.45);

    // Door body panel
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.95), doorMat);
    doorPanel.position.set(0, 0, -0.47);
    doorPanel.castShadow = true;
    this.leftDoorPivot.add(doorPanel);

    // Door window
    const doorWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.85), windowMat);
    doorWindow.position.set(0, 0.38, -0.47);
    this.leftDoorPivot.add(doorWindow);

    this.carRoot.add(this.leftDoorPivot);
  }

  updateTimeline(t) {
    if (!this.carModel) return;

    // Follow vehicle with spotlights
    const carPos = this.carRoot.position;
    this.headlightL.position.set(carPos.x - 0.62, carPos.y + 0.48, carPos.z + 1.95);
    this.headlightR.position.set(carPos.x + 0.62, carPos.y + 0.48, carPos.z + 1.95);
    this.headlightLTarget.position.set(carPos.x - 0.9, 0, carPos.z + 9);
    this.headlightRTarget.position.set(carPos.x + 0.9, 0, carPos.z + 9);

    // ========================================================
    // 0.0s – 2.0s: CAR LIGHT ON (Headlights Ignite in Darkness)
    // ========================================================
    if (t < 2.0) {
      const progress = Math.min(t / 1.5, 1.0);
      const ease = Math.pow(progress, 2);

      this.ambientLight.intensity = 0.02;
      this.studioSpotL.intensity = 0;
      this.studioSpotR.intensity = 0;
      this.rimLight.intensity = ease * 0.4;

      const beamPower = ease * 50;
      this.headlightL.intensity = beamPower;
      this.headlightR.intensity = beamPower;

      // Volumetric beam cones glow
      this.lightConeL.material.opacity = ease * 0.35;
      this.lightConeR.material.opacity = ease * 0.35;

      this.headlightMeshes.forEach(mesh => {
        mesh.material.emissiveIntensity = ease * 4.0;
      });

      this.carRoot.position.set(0, 0, -4.5);
      this.carRoot.rotation.set(0, 0, 0);

      if (this.leftDoorPivot) {
        this.leftDoorPivot.rotation.y = 0;
      }
    }

    // ========================================================
    // 2.0s – 4.0s: CAR ENTERS & WHEELS SPIN FORWARD
    // ========================================================
    else if (t < 4.0) {
      const subT = (t - 2.0) / 2.0; // 0 -> 1
      const ease = 0.5 - Math.cos(subT * Math.PI) * 0.5;

      // Drive forward along +Z from -4.5 to 0.0
      const currentZ = -4.5 + ease * 4.5;
      this.carRoot.position.z = currentZ;
      this.carRoot.position.x = 0;
      this.carRoot.rotation.y = 0;

      // Realistic 4-Wheel Spinning: wheel rotation proportional to forward motion
      const spinAngle = ease * 16.0;
      this.wheelNodes.forEach(wheel => {
        wheel.rotation.x = -spinAngle;
      });

      this.headlightL.intensity = 50;
      this.headlightR.intensity = 50;
      this.lightConeL.material.opacity = 0.35;
      this.lightConeR.material.opacity = 0.35;
      this.ambientLight.intensity = 0.05 + ease * 0.15;
    }

    // ========================================================
    // 4.0s – 6.0s: SPOTLIGHT REVEAL & PAINT GLOSS
    // ========================================================
    else if (t < 6.0) {
      const subT = (t - 4.0) / 2.0; // 0 -> 1
      const spotEase = Math.pow(subT, 1.4);

      this.studioSpotL.intensity = spotEase * 70;
      this.studioSpotR.intensity = spotEase * 70;
      this.ambientLight.intensity = 0.2 + spotEase * 0.45;
      this.rimLight.intensity = 0.4 + spotEase * 0.8;

      // Soft camera pan
      this.camera.position.x = -1.2 + Math.sin(subT * 0.5) * 0.3;
      this.camera.position.y = 1.35 - subT * 0.1;
    }

    // ========================================================
    // 6.0s – 8.5s: CAR TURNS & DOOR OPENS
    // ========================================================
    else if (t <= 8.5) {
      const subT = Math.min((t - 6.0) / 2.5, 1.0); // 0 -> 1
      const ease = 0.5 - Math.cos(subT * Math.PI) * 0.5;

      // Move car right so left stays clear for hero text
      this.carRoot.position.x = ease * 1.35;
      this.carRoot.rotation.y = -ease * 0.42;

      // Door Open Animation: opens gracefully outwards up to ~45 degrees
      if (this.leftDoorPivot) {
        const doorProgress = Math.max(0, (subT - 0.2) / 0.8);
        const doorEase = 0.5 - Math.cos(doorProgress * Math.PI) * 0.5;
        this.leftDoorPivot.rotation.y = -doorEase * 0.78; // ~45 deg open
      }

      this.studioSpotL.intensity = 70;
      this.studioSpotR.intensity = 70;
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

    if (typeof this.options.onTimeUpdate === 'function') {
      this.options.onTimeUpdate(t);
    }
  }

  restart() {
    this.currentTime = 0;
    this.isCompleted = false;
    this.controls.enabled = false;
    this.camera.position.set(-1.2, 1.35, 5.8);
    this.controls.target.set(0.6, 0.5, 0);
    if (this.leftDoorPivot) {
      this.leftDoorPivot.rotation.y = 0;
    }
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

    // Gentle showcase turntable rotation after sequence completes when user is not dragging
    if (this.isCompleted && !this.controls.state) {
      this.carRoot.rotation.y += 0.0012;
    }

    if (this.controls.enabled) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.CarShineScene = CarShineScene;
