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
  constructor(wrongWords, rightWords) {
    super(wrongWords, rightWords);
    this.exists = false;

    if (!this.exists) {
      this.modal.append(this.renderButtons());
      this.modalClose.setAttribute('disabled', 'disabled');
      this.exists = true;
    }
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
