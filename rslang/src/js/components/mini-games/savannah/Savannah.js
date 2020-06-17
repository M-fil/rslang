import create from '../../../utils/сreate';
import { startWindow } from '../../../constants/constants';
import Preloader from '../../preloader/Preloader';

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
    this.numberReverse = create('span', 'number-reverse', '', this.container);
    this.preloader = new Preloader();
  }

  render() {
    this.HTML = create('h2', 'game-name', 'Саванна', this.gameWindow);
    this.HTML = create('div', 'game-rules', RULES, this.gameWindow);
    this.HTML = create('button', 'start-button', START_BUTTON, this.gameWindow);
    this.HTML = create('button', 'exit-button', 'X', this.body);
    return this.HTML;
  }

  reverseReport() {
    const startGameWindow = document.querySelector('.start-game-window');
    startGameWindow.style.display = 'none';
    this.numberReverse.style.display = 'block';
    this.preloader.render();
    this.preloader.show();
    const seconds = 3;
    let timeLeft = seconds;

    this.numberReverse.innerHTML = timeLeft;
    const timer = setInterval(() => {
      if (timeLeft > 1) {
        timeLeft -= 1;
        this.numberReverse.innerHTML = timeLeft;
      } else {
        clearInterval(timer);
        this.mainGame();
      }
    }, 1000);
  }

  mainGame() {
    this.numberReverse.style.display = 'none';
    this.preloader.hide();
  }
}
