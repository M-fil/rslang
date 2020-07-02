import create from '../../../utils/сreate';
import WordsToLearnSelect from './WordsToLearnSelect';
import CloseButton from './CloseButton';
import { startWindow } from '../../../constants/constants';

const {
  START_BUTTON,
} = startWindow;
export default class StartWindow {
  constructor() {
    this.gameWindow = create('div', 'start-game-window');
  }

  render(gameNames, rules, startButtonFn) {
    this.yourGameName = create('h2', 'game-name', gameNames, this.gameWindow);
    this.gameRules = create('div', 'game-rules', rules, this.gameWindow);
    this.wordsToLearnSelect = new WordsToLearnSelect('gameWindow');
    this.closeButton = new CloseButton();
    this.gameWindow.appendChild(this.wordsToLearnSelect.render());
    this.startButton = create('button', 'start-button', START_BUTTON, this.gameWindow);
    this.closeButton.show();
    if (typeof startButtonFn === 'function') {
      this.startButton.addEventListener('click', startButtonFn);
    }

    return this.gameWindow;
  }
}
