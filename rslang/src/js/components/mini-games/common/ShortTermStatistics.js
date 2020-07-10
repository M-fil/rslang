import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';
import {
  shortTermStatisticsConstants,
  urls,
} from '../../../constants/constants';

const {
  ERROR_STAT,
  CORRECT_STAT,
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

  render(wrongWords, rightWords) {
    ModalWindow.changeDisplay(this.modal, 'block');
    ModalWindow.changeDisplay(this.modalCancel, 'none');
    this.modalText.classList.add('modal_text-statistics');
    this.modalTitle.innerHTML = STAT_TITLE;
    this.modalTitle.classList.add('short-statistics__title');
    this.modalWarning.innerHTML = null;
    this.modalClose.innerHTML = STAT_CLOSE;
    this.audio = new Audio();

    ShortTermStatistics.clearstatisticaWords();

    this.statisticaWrongWordsText = create('div', 'modal-words-block', `<p class = "modal-title__word-counter wrong-words">${ERROR_STAT} ${wrongWords.length}</p>`, this.modalText, ['id', 'short_term_wrong_words']);
    this.statisticaWrongWords = create('div', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('div', 'modal-words-block', `<p class = "modal-title__word-counter right-words">${CORRECT_STAT} ${rightWords.length}</p>`, this.modalText, ['id', 'short_term_right_words']);
    this.statisticaRightWords = create('div', 'modal_words', '', this.statisticaRightWordsText);

    ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
    ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);
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
        this.audio.src = `${WORDS_AUDIOS_URL}${event.target.nextSibling.dataset.audiosrc}`;
        this.audio.play();
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
  }
}
