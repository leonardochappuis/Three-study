import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

interface Scene {
  threeScene: THREE.Scene;
  game: Game;
  init(): Promise<void>;
  dispose(): void;
  update(dt: number): void;
  render(dt: number): void;
}

class Scene1 implements Scene {
  threeScene: THREE.Scene;
  game: Game;
  cube = null as THREE.Mesh | null;
  camera = null as THREE.OrthographicCamera | null;

  constructor(game: Game) {
    this.game = game;
    this.threeScene = new THREE.Scene();
  }

  async init() {
    try {
      if (this.cube && this.camera) {
        console.warn('Scene1 is already initialized');
        return;
      }
      this.initLights();
      this.initCube();
      this.initCamera();
    } catch (error) {
      console.error('Error initializing Scene1:', error);
    }
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    this.threeScene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.threeScene.add(ambientLight);
  }

  initCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.5,
      metalness: 0.5,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.threeScene.add(this.cube);
  }

  initCamera() {
    const size = new THREE.Vector2();
    this.game.renderer.getSize(size);
    const aspect = size.x / size.y;
    const frustumSize = 10;

    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );

    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, -1);
  }

  update(dt: number) {
    if (!this.cube) return;
    this.cube.rotation.x += dt;
    this.cube.rotation.z += dt;
  }

  render(dt: number) {
    if (!this.cube || !this.camera) return;
    this.game.renderer.render(this.threeScene, this.camera);
  }

  dispose() {
    if (!this.cube) return;
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
    this.threeScene.clear();
    this.cube = null;
    this.camera = null;
  }
}

class Scene2 implements Scene {
  threeScene: THREE.Scene;
  game: Game;
  sphere = null as THREE.Mesh | null;
  camera = null as THREE.PerspectiveCamera | null;

  constructor(game: Game) {
    this.game = game;
    this.threeScene = new THREE.Scene();
  }

  async init() {
    try {
      if (this.sphere && this.camera) {
        console.warn('Scene2 is already initialized');
        return;
      }
      await this.loadAssets();
      this.initLights();
      this.initCamera();
    } catch (error) {
      console.error('Error initializing Scene2:', error);
    }
  }

  async loadAssets() {
    const loader = new THREE.TextureLoader();
    try {
      const texture = await loader.loadAsync('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'); // Sample texture
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({ map: texture });
      this.sphere = new THREE.Mesh(geometry, material);
      this.threeScene.add(this.sphere);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.threeScene.add(ambientLight);
    this.threeScene.add(directionalLight);
  }

  initCamera() {
    const size = new THREE.Vector2();
    this.game.renderer.getSize(size);
    const aspect = size.x / size.y
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;
  }

  update(dt: number) {
    if (!this.sphere) return;
    this.sphere.rotation.y += dt;
  }

  render(dt: number) {
    if (!this.sphere || !this.camera) return;
    this.game.renderer.render(this.threeScene, this.camera);
  }

  dispose() {
    if (!this.sphere) return;
    this.sphere.geometry.dispose();
    (this.sphere.material as THREE.Material).dispose();
    this.threeScene.clear();
    this.sphere = null;
    this.camera = null;
  }
}

class SceneManager {
  currentScene: Scene | null = null;
  transitionDuration = 0.6; // Transition duration in seconds

  async setScene(scene: Scene) {
    if (this.currentScene) {
      await this.fadeOut(this.transitionDuration);
      this.currentScene.dispose();
    }

    this.currentScene = scene;
    await this.currentScene.init();
    this.fadeIn(this.transitionDuration);
  }

  async fadeOut(duration: number) {
    const rendererDom = document.querySelector('canvas');
    if (rendererDom) {
      rendererDom.style.transition = `opacity ${duration}s`;
      rendererDom.style.opacity = '0.0';
    }
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  }

  fadeIn(duration: number) {
    const rendererDom = document.querySelector('canvas');
    if (rendererDom) {
      rendererDom.style.transition = `opacity ${duration}s`;
      rendererDom.style.opacity = '1';
    }
  }
}

class Game {
  readonly renderer!: THREE.WebGLRenderer;
  readonly clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 60;
  sceneManager = new SceneManager();
  rootElement!: HTMLElement;

  initThreeRenderer = () => {
    if (!this.rootElement) {
      throw new Error("Couldn't find root element to attach the renderer.");
    }

    if (!WebGL.isWebGL2Available()) {
      const warning = WebGL.getWebGL2ErrorMessage();
      this.rootElement.appendChild(warning);
      throw new Error('No WebGL support');
    }

    const renderer = new THREE.WebGLRenderer();
    const width = this.rootElement.clientWidth;
    const height = this.rootElement.clientHeight;
    renderer.setSize(width, height);
    this.rootElement.appendChild(renderer.domElement);
    return renderer;
  };

  constructor() {
    let element = document.getElementById('renderer');
    if (!element) {
      throw "Couldn't find the renderer element";
    }
    this.rootElement = element;
    this.renderer = this.initThreeRenderer();

    this.sceneManager = new SceneManager();

    const resizeObserver = new ResizeObserver(() => {
      this.onWindowResize();
    });
    resizeObserver.observe(this.rootElement);

    document.addEventListener('keydown', this.onKeyDown);

    this.update();
  }


  onWindowResize = () => {
    const width = this.rootElement.clientWidth;
    const height = this.rootElement.clientHeight;
    this.renderer.setSize(width, height);

    if (this.sceneManager.currentScene instanceof Scene1) {
      const scene = this.sceneManager.currentScene as Scene1;
      const aspect = width / height;
      const frustumSize = 10;

      if (!scene || !scene.camera) return;
      scene.camera.left = (frustumSize * aspect) / -2;
      scene.camera.right = (frustumSize * aspect) / 2;
      scene.camera.top = frustumSize / 2;
      scene.camera.bottom = frustumSize / -2;
      scene.camera.updateProjectionMatrix();
    } else if (this.sceneManager.currentScene instanceof Scene2) {
      const scene = this.sceneManager.currentScene as Scene2;
      if (scene.camera) {
        scene.camera.aspect = width / height;
        scene.camera.updateProjectionMatrix();
      }
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === '1') {
      this.sceneManager.setScene(new Scene1(this));
    } else if (event.key === '2') {
      this.sceneManager.setScene(new Scene2(this));
    }
  };

  // Animation loop
  update = () => {
    requestAnimationFrame(this.update);
    this.delta += this.clock.getDelta();
    if (this.delta > this.interval) {
      if (this.sceneManager.currentScene) {
        this.sceneManager.currentScene.update(this.delta);
        this.sceneManager.currentScene.render(this.delta);
      }
      this.delta = this.delta % this.interval;
    }
  };
}

// Initialize the game
const game = new Game();
game.sceneManager.setScene(new Scene1(game)); // Start with Scene1
// Example transition to Scene2 after 5 seconds
setTimeout(() => {
  game.sceneManager.setScene(new Scene2(game));
}, 5000);
