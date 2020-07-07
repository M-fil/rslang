import GameService from './GameService';
import StartGameScreen from './StartGameScreen';
import create from '../../../utils/сreate';

export default class AuditionGame {
  constructor(user) {
    this.user = user;
  }

  render(lives, roundsAll, elementQuery) {
    const wrapper = create('div', 'audition-game__wrapper', '', document.querySelector(elementQuery));
    this.gameService = new GameService(this.user);
    this.gameService.getVocabularyData();
    const gameStartScreen = new StartGameScreen();
    const gameStartButton = gameStartScreen.createStartScreen();
    const roundResults = [];
    gameStartButton.addEventListener('click', async () => {
      document.querySelector('.audition-game__startScreen').classList.toggle('hide');
      this.gameService.preloaderInit();
      this.gameService.initRound(lives, roundsAll, 1, roundResults);
      create('div', 'progress', '', wrapper);
    });
  }
}
