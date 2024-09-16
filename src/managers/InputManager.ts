export class InputManager {
  private keysPressed: Set<string> = new Set();

  constructor() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    
  }

  private onKeyDown = (event: KeyboardEvent) => {
    this.keysPressed.add(event.key);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.keysPressed.delete(event.key);
  };

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  clear() {
    this.keysPressed.clear()
  }
  
  dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }
}
