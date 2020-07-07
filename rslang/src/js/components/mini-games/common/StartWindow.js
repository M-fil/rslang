import create from '../../../utils/сreate';
import WordsToLearnSelect from './WordsToLearnSelect';
import { startWindow } from '../../../constants/constants';

const {
  START_BUTTON,
  GO_TO_MAIN_PAGE_BUTTON,
} = startWindow;

export default class StartWindow {
  constructor(startButtonFn) {
    this.gameWindow = create('div', 'start-game-window');
    this.startButton = create('button', 'start-button', START_BUTTON);
    this.startButtonFn = startButtonFn;
    this.startButton.addEventListener('click', (this.startButtonClickHandler).bind(this));
    this.goToMainButton = create('button', 'start-button', GO_TO_MAIN_PAGE_BUTTON, undefined, ['id', 'button-go-to-main-page']);
  }

  render(gameNames, rules, showUserCollection = true) {
    this.gameWindow.innerHTML = '';

    this.yourGameName = create('h2', 'game-name', gameNames, this.gameWindow);
    this.gameRules = create('div', 'game-rules', rules, this.gameWindow);
    this.wordsToLearnSelect = new WordsToLearnSelect('gameWindow');
    this.gameWindow.appendChild(this.wordsToLearnSelect.render(showUserCollection));
    this.gameWindow.appendChild(this.startButton);
    this.gameWindow.appendChild(this.goToMainButton);

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
