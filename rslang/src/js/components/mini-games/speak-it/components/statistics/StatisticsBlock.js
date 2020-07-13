import create, {
  speakItConstants,
} from '../../pathes';
import ShortTermStatistics from '../../../common/ShortTermStatistics';

const {
  NEW_GAME_BUTTON,
  CONTINUE_BUTTON,
} = speakItConstants;

export default class StatisticsBlock extends ShortTermStatistics {
  constructor() {
    super();
    this.exists = false;

    if (!this.exists) {
      this.modal.append(this.renderButtons());
      this.modalClose.setAttribute('disabled', 'disabled');
      this.exists = true;
    }
  }

  renderButtons() {
    this.buttonsBlock = create('div', 'speak-it-statistics__buttons');
    this.continueButton = create(
      'button', 'continue-button speak-it-statistics__button', CONTINUE_BUTTON, this.buttonsBlock,
    );
    this.newGameButton = create(
      'button', 'new-game-button speak-it-statistics__button', NEW_GAME_BUTTON, this.buttonsBlock,
    );

    return this.buttonsBlock;
  }
}
