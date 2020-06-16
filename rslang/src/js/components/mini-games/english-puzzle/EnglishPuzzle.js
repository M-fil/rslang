import createStartWindow from './components/start-menu';
import createWorkBlock from './components/main-block';
import createResultBlock from './components/result-block';
import create from '../../../utils/сreate';
import {
  hidingElement,
  showingElement,
  cleanParentNode,
} from './components/dom-actions';

export default class EnglishPuzzle {
  constructor() {
    this.startMenu = createStartWindow();
    this.gameForm = createWorkBlock();
    this.resultForm = createResultBlock();
  }

  start() {
    [this.body] = document.getElementsByTagName('body');
    this.wrapper = create('div', 'wrapper', [this.startMenu, this.gameForm, this.resultForm]);
    this.body.appendChild(this.wrapper);

    this.startMenuButtonAction();
  }

  startMenuButtonAction() {
    document.querySelector('.information-button').addEventListener('click', async () => {
      // await this.initGameCards();
      hidingElement(this.startMenu);
      showingElement(this.gameForm);
    });
  }
}
