import GameService from './GameService';
import StartGameScreen from './StartGameScreen';
import create from '../../../utils/сreate';

export default class AuditionGame {
  render(lives, roundsAll) {
    this.gameService = new GameService();
    const gameStartScreen = new StartGameScreen();
    const gameStartButton = gameStartScreen.createStartScreen();
    const roundResults = [];
    gameStartButton.addEventListener('click', async () => {
      document.querySelector('.startScreen').classList.toggle('hide');
      this.gameService.init(lives, roundsAll, 1, roundResults);
      this.progressBar = create('div', 'progress', '', document.querySelector('body'));
    });
  }
}
