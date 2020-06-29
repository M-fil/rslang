import create from '../../../utils/сreate';
import {
  savannahConstants,
  urls,
} from '../../../constants/constants';
import { getWords } from '../../../service/service';
import Preloader from '../../preloader/Preloader';
import shuffle from '../../../utils/shuffle';

const {
  SAVANNAH_SECONDS_COUNT,
  RULES,
  START_BUTTON,
  LAST_NUMBER,
  MAX_PAGE,
  MODAL_TITLE,
  MODAL_WARNING,
  CLOSE_BUTTON,
  CANCEL_BUTTON,
  RANDOM_WORDS,
  LIVES,
  FRAME,
  END_ANIMATION,
  DIVIDER,
  ADD_LIVES,
  ERROR_STAT,
  CORRECT_STAT,
  STAT,
  PLUS_LIVE,
  AUDIO_CORRECT,
  AUDIO_ERROR,
  AUDIO_BONUS,
  AUDIO_TICKING,
  STAT_IMAGE_AUDIO,
  LIVES_IMAGE_BLACK,
  LIVES_IMAGE_INHERIT,
  MAX_WORDS,
} = savannahConstants;

const {
  WORDS_AUDIOS_URL,
} = urls;

export default class SavannahGame {
  constructor() {
    this.HTML = null;
    this.body = document.querySelector('body');
    this.container = create('div', 'container', '', this.body);
    this.gameWindow = create('div', 'start-game-window', '', this.container);
    this.numberReverse = create('span', 'number-reverse', '', this.container);
    this.preloader = new Preloader();
    this.audio = new Audio();
    this.error = 0;
  }

  render() {
    this.allWords = document.querySelectorAll('.word');
    create('h2', 'game-name', 'Саванна', this.gameWindow);
    create('div', 'game-rules', RULES, this.gameWindow);
    this.startButton = create('button', 'start-button', START_BUTTON, this.gameWindow);
    this.exitButton = create('button', 'exit-button', 'X', this.body);
    this.arrayBeforeClickWords = [];
    this.startButton.addEventListener('click', () => {
      this.reverseReport();
    });
    this.preloader.render();
  }

  reverseReport() {
    this.playAudio(AUDIO_TICKING);
    SavannahGame.changeDisplay(this.exitButton, 'none');
    const startGameWindow = document.querySelector('.start-game-window');
    SavannahGame.changeDisplay(startGameWindow, 'none');
    SavannahGame.changeDisplay(this.numberReverse, 'block');
    this.preloader.show();
    let timeLeft = SAVANNAH_SECONDS_COUNT;
    this.numberReverse.innerHTML = timeLeft;
    const timer = setInterval(() => {
      if (timeLeft > LAST_NUMBER) {
        timeLeft -= 1;
        this.numberReverse.innerHTML = timeLeft;
      } else {
        clearInterval(timer);
        this.mainGame();
      }
    }, 1000);
  }

  async mainGame() {
    this.page = 0;
    this.group = 0;
    SavannahGame.changeDisplay(this.numberReverse, 'none');
    this.data = await getWords(this.page, this.group);
    this.crateCardsData();
    this.wordClick();
    this.offAudio();
    this.modalWindow();
    this.changeLives();
    this.animatedWord();
    this.liveIndex = 0;
    this.rusBut = document.querySelectorAll('.word_russian');
    this.rightWords = [];
    this.wrongWords = [];
    this.keyboardClick();
    this.correctWordNumber = 0;
    this.countLives = 0;
    this.pauseAudio();
  }

  crateCardsData() {
    SavannahGame.changeDisplay(this.exitButton, 'block');
    this.preloader.hide();
    this.num = 0;
    this.lives = create('div', 'lives', '', this.container);
    this.offSound = create('button', 'sound sound_on', 'Off', this.container);
    this.engLine = create('div', 'english-line', '', this.container);
    this.rusLine = create('div', 'russian-line', '', this.container);
    this.engRandomWords = this.data;
    this.engRandomWords = shuffle(this.data);

    this.engBut = create('span', 'word word_english', this.engRandomWords[this.num].word, this.engLine);
    this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
    this.arrayBeforeClickWords = this.engRandomWords[this.num];

    this.engBut.disabled = true;
    this.wordsTranslate = [];
    for (let i = 0; i < this.data.length; i += 1) {
      if (this.engBut.dataset.translate === this.engRandomWords[i].wordTranslate) {
        this.wordsTranslate.push(this.engBut.dataset.translate);
      }
      if (this.engBut.dataset.translate !== this.engRandomWords[i].wordTranslate && this.wordsTranslate.length < 4) {
        this.wordsTranslate.push(this.engRandomWords[i].wordTranslate);
      }
    }
    shuffle(this.wordsTranslate);
    let keyboardNumber = 0;
    this.wordsTranslate.forEach((butTranslate) => {
      keyboardNumber += 1;
      const russianBut = create('button', 'word word_russian', butTranslate, this.rusLine);
      russianBut.setAttribute('data-translate', butTranslate);
      this.wordNumber = create('span', 'word_number', keyboardNumber.toString(), russianBut);
    });
    this.plusLive = create('span', 'add-lives-number', PLUS_LIVE, this.container);
  }

  async changeCard() {
    this.animatedWord();
    this.rusBut.forEach((rusButton) => {
      const disabledButton = rusButton;
      disabledButton.classList.remove('word_correct');
      disabledButton.classList.remove('word_error');
      disabledButton.disabled = false;
    });
    this.exitButton.disabled = false;
    if (this.num === this.data.length - 1) {
      this.num = 0;
      this.page += 1;
      this.data = await getWords(this.page, this.group);
      this.engRandomWords = this.data;
      this.engRandomWords = shuffle(this.data);
    }
    if (this.page === MAX_PAGE) {
      this.group += 1;
      this.page = 0;
      this.data = await getWords(this.page, this.group);
      this.engRandomWords = this.data;
      this.engRandomWords = shuffle(this.data);
    }
    this.wordsTranslate.length = 0;

    if (this.num !== this.data.length - 1) {
      this.num += 1;
      this.engBut.innerHTML = this.engRandomWords[this.num].word;
      this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
      this.arrayBeforeClickWords = this.engRandomWords[this.num];

      const randomData = this.data;
      const correctWord = randomData.find((word) => this.engBut.dataset.translate === word.wordTranslate);

      let randomTranslations = randomData
        .filter((word) => this.engBut.dataset.translate !== word.wordTranslate)
        .map((word) => word.wordTranslate);

      randomTranslations = shuffle(randomTranslations, RANDOM_WORDS);
      const int = Math.round(Math.random());
      this.wordsTranslate = (!int) ? [...randomTranslations, correctWord.wordTranslate] : [correctWord.wordTranslate, ...randomTranslations];
      this.wordTranslate = shuffle(this.wordsTranslate);
      let keyboardNumber = 0;
      for (let i = 0; i < this.rusBut.length; i += 1) {
        keyboardNumber += 1;
        this.rusBut[i].setAttribute('data-translate', this.wordsTranslate[i]);
        this.rusBut[i].innerHTML = this.wordsTranslate[i];
        this.wordNumber = create('span', 'word_number', keyboardNumber.toString(), this.rusBut[i]);
      }
    }
  }

  checkWord(event, target) {
    clearInterval(this.timer);
    const englishWord = document.querySelector('.word_english');
    const engTranslate = englishWord.dataset.translate;
    if (target.dataset.translate === engTranslate) {
      this.correctWordNumber += 1;
      this.rightWords.push(this.arrayBeforeClickWords);
      this.playAudio(AUDIO_CORRECT);
      target.classList.add('word_correct');
      this.errorTimer = setTimeout(async () => {
        await this.changeCard();
      }, 2000);
      this.disabledButtons();
      if (this.correctWordNumber === ADD_LIVES) {
        this.addLives();
      }
      if ((this.rightWords.length + this.wrongWords.length) === MAX_WORDS) {
        this.createStatistics();
      }
    } else {
      this.correctWordNumber = 0;
      target.classList.add('word_error');
      this.errorWord();
      if (this.error === (LIVES + this.countLives) || (this.rightWords.length + this.wrongWords.length) === MAX_WORDS) {
        this.createStatistics();
      }
    }
  }

  createStatistics() {
    clearInterval(this.timer);
    clearTimeout(this.errorTimer);
    const statisticaContainer = create('div', 'modal', '', this.body);
    SavannahGame.changeDisplay(statisticaContainer, 'block');
    this.statisticaText = create('div', 'modal_text', '', statisticaContainer);
    this.statisticaTitle = create('h4', 'modal_title', `${STAT}`, this.statisticaText);

    this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${this.wrongWords.length}`, this.statisticaText);
    this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${this.rightWords.length}`, this.statisticaText);
    this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);
    this.audio.muted = false;
    SavannahGame.statisticaWords(this.wrongWords, this.statisticaWrongWords);
    SavannahGame.statisticaWords(this.rightWords, this.statisticaRightWords);
    this.clickStatisticaAudio();
  }

  wordClick() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word_russian');
      if (target) {
        this.checkWord(event, target);
      }
    });
  }

  keyboardClick() {
    document.addEventListener('keydown', (keydown) => {
      const target = this.rusBut[keydown.key - 1];
      if (!this.rusBut[0].disabled && target) {
        this.checkWord(keydown, target);
      }
    });
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

  playAudio(source) {
    if (this.audio.src === '' || this.audio.src !== source || this.audio.ended) {
      this.audio.src = source;
      this.audio.play();
    }
  }

  pauseAudio() {
    this.audio.pause();
  }

  offAudio() {
    this.offSound.addEventListener('click', () => {
      if (this.offSound.classList.contains('sound_on')) {
        this.offSound.classList.add('sound_off');
        this.offSound.classList.remove('sound_on');
        this.audio.muted = true;
      } else {
        this.offSound.classList.remove('sound_off');
        this.offSound.classList.add('sound_on');
        this.audio.muted = false;
      }
    });
  }

  modalWindow() {
    const modal = create('div', 'modal', '', this.body);
    const modalText = create('div', 'modal_text', '', modal);
    this.modalTitle = create('h4', 'modal_title', MODAL_TITLE, modalText);
    this.modalWarning = create('p', 'modal_warning', MODAL_WARNING, modalText);
    this.modalClose = create('button', 'modal_button close_button', CLOSE_BUTTON, modalText);
    this.modalCancel = create('button', 'modal_button cancel_button', CANCEL_BUTTON, modalText);
    this.exitButton.addEventListener('click', () => {
      SavannahGame.changeDisplay(modal, 'block');
      clearInterval(this.timer);
    });
    this.modalClose.addEventListener('click', () => {
      SavannahGame.changeDisplay(modal, 'none');
    });
    this.modalCancel.addEventListener('click', () => {
      SavannahGame.changeDisplay(modal, 'none');
      this.animatedWord();
    });
  }

  changeLives() {
    for (let i = 0; i < LIVES; i += 1) {
      this.live = create('img', 'live', '', this.lives);
      this.live.src = LIVES_IMAGE_BLACK;
    }
  }

  addLives() {
    this.live = create('img', 'live', '', this.lives);
    this.live.src += LIVES_IMAGE_BLACK;
    this.countLives += 1;
    this.correctWordNumber = 0;
    this.playAudio(AUDIO_BONUS);
    this.plusLive = document.querySelector('.add-lives-number');
    this.plusLive.classList.add('show-number-live');
    setTimeout(() => {
      this.plusLive.classList.remove('show-number-live');
    }, 3000);
  }

  animatedWord() {
    const start = Date.now();
    this.timer = setInterval(() => {
      const timePassed = Date.now() - start;
      this.engLine.style.top = `${timePassed / DIVIDER}px`;
      if (timePassed > END_ANIMATION) {
        clearInterval(this.timer);
        this.errorWord();
      }
    }, FRAME);
  }

  errorWord() {
    this.allLives = document.querySelectorAll('.live');
    this.error += 1;
    this.playAudio(AUDIO_ERROR);
    this.rusBut.forEach((rusButton) => {
      if (rusButton.dataset.translate === this.engRandomWords[this.num].wordTranslate) {
        rusButton.classList.add('word_correct');
      }
      this.disabledButtons();
    });
    this.allLives[this.liveIndex].src = LIVES_IMAGE_INHERIT;
    this.liveIndex += 1;
    this.wrongWords.push(this.arrayBeforeClickWords);
    clearInterval(this.timer);
    this.errorTimer = setTimeout(async () => {
      await this.changeCard();
    }, 2000);
  }

  disabledButtons() {
    this.rusBut.forEach((rusButton) => {
      const disabledButton = rusButton;
      disabledButton.disabled = true;
    });
    this.exitButton.disabled = true;
  }

  static changeDisplay(element, event) {
    const el = element;
    if (event === 'none') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
}
