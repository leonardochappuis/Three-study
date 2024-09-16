import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

class Game {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera; // Top-down
  rootElement: HTMLElement | null;
  cube: THREE.Mesh;

  constructor() {
    this.rootElement = document.getElementById('renderer');
    if (!this.rootElement) {
      throw new Error("Couldn't find root element to attach the renderer.");
    }

    // Start the animation loop
    if (!WebGL.isWebGL2Available()) {
      const warning = WebGL.getWebGL2ErrorMessage();
      this.rootElement.appendChild(warning);
      throw new Error("No WebGL support");
    }
    
    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer();
    
    const width = this.rootElement.clientWidth;
    const height = this.rootElement.clientHeight;
    this.renderer.setSize(width, height);

    this.rootElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    // Set up an orthographic camera
    const aspect = width / height;
    const frustumSize = 10;
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 0); // Position the camera above the scene
    this.camera.lookAt(0, 0, 0); // Look at the center of the scene (origin)
    this.camera.up.set(0, 0, -1); // Set the camera's up direction

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    this.scene.add(ambientLight);

    // Add a basic object to the scene (for testing)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Use a material that reacts to light
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Start the animation loop
    this.animate();
  }

  // Animation loop
  animate = () => {
    requestAnimationFrame(this.animate);

    this.cube.rotation.x += 0.01;
    this.cube.rotation.z += 0.01;

    this.renderer.render(this.scene, this.camera);
  };
}

new Game();
