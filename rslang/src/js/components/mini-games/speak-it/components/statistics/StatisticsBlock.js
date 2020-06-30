import create, { speakItConstants } from '../../pathes';
import ShortTermStatistics from '../../../common/ShortTermStatistics';

const {
  NEW_GAME_BUTTON,
  CONTINUE_BUTTON,
} = speakItConstants;

export default class StatisticsBlock extends ShortTermStatistics {
  constructor(wrongWords, rightWords) {
    super(wrongWords, rightWords)
    this.modal.append(this.renderButtons());
    this.modalClose.setAttribute('disabled', 'disabled');
  }

  renderButtons() {
    const buttons = create('div', 'statistics__buttons');
    this.continueButton = create(
      'button', 'continue-button statistics__button', CONTINUE_BUTTON, buttons 
    );
    this.newGameButton = create(
      'button', 'new-game-button statistics__button', NEW_GAME_BUTTON, buttons,
    );

    return buttons;
  }
}
