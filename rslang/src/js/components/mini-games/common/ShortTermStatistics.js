import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';
import {
  statistics,
  urls,
} from '../../../constants/constants';

const {
  ERROR_STAT,
  CORRECT_STAT,
  STAT_TITLE,
  STAT_IMAGE_AUDIO,
  STAT_CLOSE,
} = statistics;

const {
  WORDS_AUDIOS_URL,
} = urls;

export default class ShortTermStatistics extends ModalWindow {
  render(wrongWords, rightWords) {
    this.modaleWindow = new ModalWindow();
    ModalWindow.changeDisplay(this.modal, 'block');
    ModalWindow.changeDisplay(this.modalCancel, 'none');
    this.modalTitle.innerHTML = STAT_TITLE;
    this.modalWarning.innerHTML = null;
    this.modalClose.innerHTML = STAT_CLOSE;

    this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${wrongWords.length}`, this.modalText);
    this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${rightWords.length}`, this.modalText);
    this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);

    ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
    ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);
    this.clickStatisticaAudio();
  }

  static statisticaWords(arrayWords, container) {
    arrayWords.forEach((word) => {
      const everyString = create('p', '', '', container);
      const picture = create('img', 'audio-pictures', '', everyString);
      picture.src = STAT_IMAGE_AUDIO;
      this.audioPic = create('audio', '', '', everyString);
      this.audioPic.setAttribute('data-audiosrc', word.audio);
      everyString.innerHTML += `<b>${word.word}</b> - ${word.wordTranslate}<br>`;
    });
  }

  clickStatisticaAudio() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.audio-pictures');
      if (target) {
        this.playAudio(`${WORDS_AUDIOS_URL}${event.target.nextSibling.dataset.audiosrc}`);
      }
    });
  }
}
