import create from '../../../utils/сreate';
import {
  savannahConstants,
} from '../../../constants/constants';
import getWords from '../../../service/service';
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
} = savannahConstants;

export default class SavannahGame {
  constructor() {
    this.HTML = null;
    this.body = document.querySelector('body');
    this.container = create('div', 'container', '', this.body);
    this.gameWindow = create('div', 'start-game-window', '', this.container);
    this.numberReverse = create('span', 'number-reverse', '', this.container);
    this.preloader = new Preloader();
    this.allWords = document.querySelectorAll('.word');
    this.audio = new Audio();
    this.error = 0;
  }

  render() {
    this.HTML = create('h2', 'game-name', 'Саванна', this.gameWindow);
    this.HTML = create('div', 'game-rules', RULES, this.gameWindow);
    this.HTML = create('button', 'start-button', START_BUTTON, this.gameWindow);
    this.exitButton = create('button', 'exit-button', 'X', this.body);
    return this.HTML;
  }

  reverseReport() {
    this.exitButton.classList.add('none');
    const startGameWindow = document.querySelector('.start-game-window');
    startGameWindow.style.display = 'none';
    this.numberReverse.style.display = 'block';
    this.preloader.render();
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
    this.numberReverse.style.display = 'none';
    this.data = await getWords(this.page, this.group);
    this.crateCardsData();
    this.wordClick();
    this.offAudio();
    this.modalWindow();
    this.changeLives();
    this.animatedWord();
    this.liveIndex = 0;
    this.rusBut = document.querySelectorAll('.word_russian');
  }

  crateCardsData() {
    this.exitButton.classList.remove('none');
    this.preloader.hide();
    this.num = 0;
    const container = document.querySelector('.container');
    this.lives = create('div', 'lives', '', container);
    this.offSound = create('button', 'sound sound_on', 'Off', container);
    this.engLine = create('div', 'english-line', '', container);
    this.rusLine = create('div', 'russian-line', '', container);
    this.engRandomWords = this.data;
    this.engRandomWords = shuffle(this.data);

    this.engBut = create('button', 'word word_english', this.engRandomWords[this.num].word, this.engLine);
    this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
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
    this.wordsTranslate.forEach((butTranslate) => {
      const russianBut = create('button', 'word word_russian', butTranslate, this.rusLine);
      russianBut.setAttribute('data-translate', butTranslate);
    });
  }

  async changeCard() {
    this.animatedWord();
    this.rusBut.forEach((rusButton) => {
      rusButton.classList.remove('word_correct');
    });
    if (this.num === this.data.length - 1) {
      this.num = 0;
      this.page += 1;
      this.data = await getWords(this.page, this.group);
      this.engRandomWords = this.data;
      this.engRandomWords = shuffle(this.data);
    }
    if (this.page === MAX_PAGE) {
      this.group += 1;
      this.data = await getWords(this.page, this.group);
      this.engRandomWords = this.data;
      this.engRandomWords = shuffle(this.data);
    }
    this.wordsTranslate.length = 0;

    if (this.num !== this.data.length - 1) {
      this.num += 1;

      this.engBut.innerHTML = this.engRandomWords[this.num].word;

      this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
      const randomData = this.data;
      const correctWord = randomData.find((word) => this.engBut.dataset.translate === word.wordTranslate);

      let randomTranslations = randomData
        .filter((word) => this.engBut.dataset.translate !== word.wordTranslate)
        .map((word) => word.wordTranslate);

      randomTranslations = shuffle(randomTranslations).slice(0, 3);
      this.wordsTranslate = [correctWord.wordTranslate, ...randomTranslations];
      this.wordTranslate = shuffle(this.wordsTranslate);

      for (let i = 0; i < this.rusBut.length; i += 1) {
        this.rusBut[i].setAttribute('data-translate', this.wordsTranslate[i]);
        this.rusBut[i].innerHTML = this.wordsTranslate[i];
      }
    }
  }

  wordClick() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word_russian');
      if (target) {
        clearInterval(this.timer);
        const englishWord = document.querySelector('.word_english');
        if (target.dataset.translate === englishWord.dataset.translate) {
          this.playAudio('correct');
          this.changeCard();
        } else {
          this.errorWord();
          if (this.error === 4) {
            console.log('statistica');
          }
        }
      }
    });
  }

  playAudio(file) {
    this.audio.src = `./src/assets/audio/${file}.mp3`;
    this.audio.play();
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
    const modal = create('div', 'modal none', '', this.body);
    const modalText = create('div', 'modal_text', '', modal);
    this.modalTitle = create('h4', 'modal_title', MODAL_TITLE, modalText);
    this.modalWarning = create('p', 'modal_warning', MODAL_WARNING, modalText);
    this.modalClose = create('button', 'modal_button close_button', CLOSE_BUTTON, modalText);
    this.modalCancel = create('button', 'modal_button cancel_button', CANCEL_BUTTON, modalText);

    this.exitButton.addEventListener('click', () => {
      modal.classList.remove('none');
    });
    this.modalClose.addEventListener('click', () => {
      modal.classList.add('none');
    });
    this.modalCancel.addEventListener('click', () => {
      modal.classList.add('none');
    });
  }

  changeLives() {
    for (let i = 0; i < 5; i += 1) {
      this.live = create('img', 'live', '', this.lives);
      this.live.src = '/src/assets/images/heart_black.png';
    }
    this.allLives = document.querySelectorAll('.live');
  }

  animatedWord() {
    const endAnimation = 7000;
    const frame = 24;
    const start = Date.now();
    this.timer = setInterval(() => {
      const timePassed = Date.now() - start;
      this.engLine.style.top = `${timePassed / frame}px`;
      if (timePassed > endAnimation) {
        clearInterval(this.timer);
        this.errorWord();
      }
    }, frame);
  }

  errorWord() {
    this.error += 1;
    this.playAudio('error');

    this.allLives[this.liveIndex].src = '/src/assets/images/heart_inherit.png';
    this.liveIndex += 1;
    this.rusBut.forEach((rusButton) => {
      if (rusButton.outerText === this.engRandomWords[this.num].wordTranslate) {
        rusButton.classList.add('word_correct');
      }
    });
    clearInterval(this.timer);
    setTimeout(this.changeCard, 2000);
  }
}
