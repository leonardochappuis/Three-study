import { Scene } from '../interfaces/Scene';

export class SceneManager {
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
