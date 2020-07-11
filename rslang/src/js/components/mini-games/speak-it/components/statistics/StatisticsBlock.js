import create, {
  speakItConstants,
  shortTermStatisticsConstants,
} from '../../pathes';
import ShortTermStatistics from '../../../common/ShortTermStatistics';

const {
  NEW_GAME_BUTTON,
  CONTINUE_BUTTON,
} = speakItConstants;

const {
  ERROR_STAT,
  CORRECT_STAT,
} = shortTermStatisticsConstants;

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

  update(wrongWords, rightWords) {
    this.statisticaWrongWordsText.innerHTML = '';
    this.statisticaRightWordsText.innerHTML = '';

    this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${wrongWords.length}`, this.modalText);
    this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${rightWords.length}`, this.modalText);
    this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);

    ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
    ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);
  }
}
