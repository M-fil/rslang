import create from '../../../utils/сreate';
import WordsToLearnSelect from './WordsToLearnSelect';

export default class StartWindow {
  constructor() {
    this.body = document.querySelector('body');
    this.container = create('div', 'container', '', this.body);
    this.gameWindow = create('div', 'start-game-window', '', this.container);
  }

  render(gameNames, rules, startButtonName) {
    this.yourGameName = create('h2', 'game-name', gameNames, this.gameWindow);
    this.gameRules = create('div', 'game-rules', rules, this.gameWindow);
    this.wordsToLearnSelect = new WordsToLearnSelect(this.gameWindow);
    this.gameWindow.appendChild(this.wordsToLearnSelect.render());
    this.startButton = create('button', 'start-button', startButtonName, this.gameWindow);
  }
}
