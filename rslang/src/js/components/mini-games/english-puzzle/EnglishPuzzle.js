import '../../../../scss/components/mini-games/english-puzzle/english-puzzle.scss';
import createStartWindow from './components/start-menu';
import create from '../../../utils/сreate';

export default class EnglishPuzzle {
  constructor() {
    this.startMenu = null;
  }

  start() {
    [this.body] = document.getElementsByTagName('body');
    this.wrapper = create('div', 'wrapper', [createStartWindow()]);
    this.body.appendChild(this.wrapper);
  }
}
