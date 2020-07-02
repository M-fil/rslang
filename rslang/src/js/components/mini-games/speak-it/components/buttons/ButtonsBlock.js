import create, { speakItConstants } from '../../pathes';

const {
  RESTART_BUTTON,
  START_GAME_BUTTON,
  RESULTS_BUTTON,
} = speakItConstants;

export default class ButtonsBlock {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'buttons-container');

    create('button', 'restart-button buttons-container__button', RESTART_BUTTON, this.container);
    create('button', 'start-game-button buttons-container__button', START_GAME_BUTTON, this.container);
    create('button', 'result-button buttons-container__button', RESULTS_BUTTON, this.container);

    return this.container;
  }
}
