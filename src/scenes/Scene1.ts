import * as THREE from 'three';
import { Scene } from '../interfaces/Scene';
import { Game } from '../Game';
import { Scene2 } from './Scene2';

export class Scene1 implements Scene {
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

    // Check for input and move the cube
    if (this.game.inputManager.isKeyPressed('ArrowRight') || this.game.inputManager.isKeyPressed('D') || this.game.inputManager.isKeyPressed('d')) {
      this.cube.position.x += dt * 2;
    }
    if (this.game.inputManager.isKeyPressed('ArrowLeft') || this.game.inputManager.isKeyPressed('A') || this.game.inputManager.isKeyPressed('a')) {
      this.cube.position.x -= dt * 2;
    }
    if (this.game.inputManager.isKeyPressed('ArrowUp') || this.game.inputManager.isKeyPressed('W') || this.game.inputManager.isKeyPressed('w')) {
      this.cube.position.z -= dt * 2;
    }
    if (this.game.inputManager.isKeyPressed('ArrowDown') || this.game.inputManager.isKeyPressed('S') || this.game.inputManager.isKeyPressed('s')) {
      this.cube.position.z += dt * 2;
    }
    if (this.game.inputManager.isKeyPressed('Enter')) {
      this.game.sceneManager.setScene(new Scene2(this.game))
    }
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