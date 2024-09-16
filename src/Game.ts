import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { SceneManager } from './managers/SceneManager';
import { InputManager } from './managers/InputManager'
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';

export class Game {
  readonly renderer!: THREE.WebGLRenderer;
  readonly clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 60;
  sceneManager = new SceneManager();
  inputManager!: InputManager;
  rootElement!: HTMLElement;
  private isFocused: boolean = true;

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
    this.inputManager = new InputManager();
    const resizeObserver = new ResizeObserver(() => {
      this.onWindowResize();
    });
    resizeObserver.observe(this.rootElement);

    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('focus', this.onWindowFocus);

    this.update();
  }

  private onWindowBlur = () => {
    this.isFocused = false;
    this.inputManager.clear()
  };

  private onWindowFocus = () => {
    this.isFocused = true;
  };

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
