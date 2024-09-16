import { Game } from './Game';
import { Scene1 } from './scenes/Scene1';
// import { Scene2 } from './scenes/Scene2';

// Initialize the game
const game = new Game();
game.sceneManager.setScene(new Scene1(game)); // Start with Scene1

// setTimeout(() => {
//   game.sceneManager.setScene(new Scene2(game));
// }, 5000);
