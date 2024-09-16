import * as THREE from 'three';
import { Scene } from '../interfaces/Scene';
import { Game } from '../Game';

export class Scene2 implements Scene {
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