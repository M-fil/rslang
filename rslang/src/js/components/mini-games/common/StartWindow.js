import create from '../../../utils/сreate';
import WordsToLearnSelect from './WordsToLearnSelect';
import CloseButton from './CloseButton';
import { startWindow } from '../../../constants/constants';

const {
  START_BUTTON,
} = startWindow;
export default class StartWindow {
  constructor(startButtonFn) {
    this.gameWindow = create('div', 'start-game-window');
    this.closeButton = new CloseButton();
    this.startButton = create('button', 'start-button', START_BUTTON);
    this.startButtonFn = startButtonFn;
    this.startButton.addEventListener('click', (this.startButtonClickHandler).bind(this));
  }

  render(gameNames, rules, showUserCollection = true) {
    this.gameWindow.innerHTML = '';

    this.yourGameName = create('h2', 'game-name', gameNames, this.gameWindow);
    this.gameRules = create('div', 'game-rules', rules, this.gameWindow);
    this.wordsToLearnSelect = new WordsToLearnSelect('gameWindow');
    this.gameWindow.appendChild(this.wordsToLearnSelect.render(showUserCollection));
    this.gameWindow.appendChild(this.startButton);
    this.closeButton.show();

    return this.gameWindow;
  }

  startButtonClickHandler() {
    const selectedCollection = document.querySelector('#selectWords').value;
    const selectedGroup = document.querySelector('#selectGroup').value;
    if (typeof this.startButtonFn === 'function') {
      this.startButtonFn(selectedCollection, selectedGroup);
    }
  }
}
