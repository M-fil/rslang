import GameService from './GameService';
import StartGameScreen from './StartGameScreen';

export default class AuditionGame {
  render(lives) {
    this.gameService = new GameService();
    const gameStartScreen = new StartGameScreen();
    const gameStartButton = gameStartScreen.createStartScreen();
    gameStartButton.addEventListener('click', async () => {
      document.querySelector('.startScreen').classList.toggle('hide');
      this.gameService.init(lives);
    });
  }
}
