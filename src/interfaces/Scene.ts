import * as THREE from 'three';
import { Game } from '../Game';

export interface Scene {
  threeScene: THREE.Scene;
  game: Game;
  init(): Promise<void>;
  dispose(): void;
  update(dt: number): void;
  render(dt: number): void;
}