import create from '../../../utils/сreate';
import { startWindow } from '../../../constants/constants';

const {
  RULES,
  START_BUTTON,
} = startWindow;

export default class SavannahGame {
  constructor() {
    this.HTML = null;
    this.body = document.querySelector('body');
    this.container = create('div', 'container', '', this.body);
    this.gameWindow = create('div', 'start-game-window', '', this.container);
  }

  render() {
    this.HTML = create('h2', 'game-name', 'Саванна', this.gameWindow);
    this.HTML = create('div', 'game-rules', RULES, this.gameWindow);
    this.HTML = create('button', 'start-button', START_BUTTON, this.gameWindow);
    this.HTML = create('button', 'exit-button', 'X', this.body);
    return this.HTML;
  }
}
