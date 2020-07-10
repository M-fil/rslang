import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';
import {
  shortTermStatisticsConstants,
  urls,
} from '../../../constants/constants';

const {
  ERROR_STAT,
  CORRECT_STAT,
  IDK_STAT,
  STAT_TITLE,
  STAT_CLOSE,
} = shortTermStatisticsConstants;

const {
  WORDS_AUDIOS_URL,
  STAT_IMAGE_AUDIO,
} = urls;

export default class ShortTermStatistics extends ModalWindow {
  constructor() {
    super('short-term-statistics');
    if (ShortTermStatistics.exists) {
      return ShortTermStatistics.instance;
    }

    ShortTermStatistics.exists = true;
    shortTermStatisticsConstants.instance = this;
    this.audio = new Audio();
    this.initilized = false;
  }

  render(wrongWords, rightWords, IdkWords) {
    ModalWindow.changeDisplay(this.modal, 'block');
    ModalWindow.changeDisplay(this.modalCancel, 'none');
    this.modalText.classList.add('modal_text-statistics');
    this.modalTitle.innerHTML = STAT_TITLE;
    this.modalTitle.classList.add('short-statistics__title');
    this.modalWarning.innerHTML = null;
    this.modalClose.innerHTML = STAT_CLOSE;
    this.audio = new Audio();

    ShortTermStatistics.clearstatisticaWords();

    this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${wrongWords.length}`, this.modalText, ['id', 'short_term_wrong_words']);
    this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${rightWords.length}`, this.modalText, ['id', 'short_term_right_words']);
    this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);

    ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
    ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);

    if (IdkWords) {
      this.statisticaIdkWordsText = create('p', 'modal_title', `${IDK_STAT} ${IdkWords.length}`, this.modalText, ['id', 'short_term_idk_words']);
      this.statisticaIdkWords = create('p', 'modal_words', '', this.statisticaIdkWordsText);
      ShortTermStatistics.statisticaWords(IdkWords, this.statisticaIdkWords);
    }
    this.clickStatisticaAudio();
  }

  static statisticaWords(arrayWords, container) {
    arrayWords.forEach((word) => {
      const picture = create('img', 'audio-pictures', '');
      picture.src = STAT_IMAGE_AUDIO;
      this.audioPic = create('audio', '', '');
      this.audioPic.setAttribute('data-audiosrc', word.audio);
      const wordText = create('p', 'modal_words-word', `${word.word} - ${word.wordTranslate}`);
      create('div', 'modal_words-word-container', [picture, this.audioPic, wordText], container);
    });
  }

  clickStatisticaAudio() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.audio-pictures');

      if (target) {
        if (this.audio.ended || this.audio.paused) {
          this.audio.src = `${WORDS_AUDIOS_URL}${event.target.nextSibling.dataset.audiosrc}`;
          this.audio.play();
        }
      }
    });
  }

  static clearstatisticaWords() {
    const wrongWords = document.querySelector('#short_term_wrong_words');
    if (wrongWords) {
      wrongWords.remove();
    }
    const rightWords = document.querySelector('#short_term_right_words');
    if (rightWords) {
      rightWords.remove();
    }
    const IdkWords = document.querySelector('#short_term_idk_words');
    if (IdkWords) {
      IdkWords.remove();
    }
  }
}
