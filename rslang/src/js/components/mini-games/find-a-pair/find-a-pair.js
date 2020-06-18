import {
  getWords,
} from '../../../service/service';
import {
  findAPairText,
} from '../../../constants/constants';
import create from '../../../utils/сreate';
import shuffle from '../../../utils/shuffle';
import wordsFilter from '../../../utils/wordsfilter';
import Preloader from '../../preloader/preloader';

export default class FindAPair {
  init() {
    this.level = Number(localStorage.level) || 1;
    this.fixedCards = 0;
    this.gameStarted = false;
    this.gameOnPause = false;
    this.audioObj = new Audio();
    this.preloader = new Preloader();
    this.preloader.render();

    this.renderStartPage();
  }

  renderStartPage() {
    const aboutgame = create('p', 'find-a-pair__about', findAPairText.about);
    const startGameButton = create('button', 'find-a-pair__startgame-button', findAPairText.startButton, undefined, ['id', 'find-a-pair-startgame-button']);
    startGameButton.addEventListener('click', (this.startGameHandler).bind(this));
    const gameLevel = create('p', 'find-a-pair__gamelevel', `${findAPairText.level}: ${this.level}`);
    create('div', 'find-a-pair find-a-pair__start-page', [aboutgame, startGameButton, gameLevel], document.body, ['id', 'find-a-pair']);
  }

  async startGame() {
    this.preloader.show();
    this.data = await this.getCardsData();
    this.findPairs = 0;
    this.renderGame();
  }

  renderGame() {
    const container = document.querySelector('#find-a-pair');
    container.innerHTML = '';
    container.classList.remove('find-a-pair__start-page');

    const timerEl = create('i', 'find-a-pair-timer__seconds', '90', undefined, ['id', 'remain_seconds']);
    const timerSpan = create('span', 'find-a-pair-timer__text', `${findAPairText.remainSec}: ${timerEl.outerHTML}`);
    const timerContainer = create('div', 'find-a-pair-timer', timerSpan);

    const findCardsEl = create('i', 'find-a-pair-findcards__count', '0', undefined, ['id', 'findcards_count']);
    const findCardsSpan = create('span', 'find-a-pair-findcards__text', `${findAPairText.findCards}: ${findCardsEl.outerHTML}`);
    const findCardsContainer = create('div', 'find-a-pair-findcards', findCardsSpan);

    const pauseButton = create('button', 'find-a-pair__pause-button', findAPairText.pauseButton, undefined, ['id', 'find-a-pair-pause-button']);
    const controlbar = create('div', 'find-a-pair__controlbar', [timerContainer, findCardsContainer, pauseButton]);
    const playingField = create('div', 'find-a-pair__playing-field');

    this.data.forEach((data) => {
      playingField.append(this.createCard(data));
    });

    pauseButton.addEventListener('click', (this.pauseGameHandler).bind(this));

    container.appendChild(controlbar);
    container.appendChild(playingField);
    this.preloader.hide();
  }

  async getCardsData() {
    // Random page
    const page = Math.floor(Math.random() * 30);
    const words = await getWords(page, this.level - 1);
    if (words.length === 0) {
      this.getCardsData();
    }
    console.log(page, this.level, words);
    const data = shuffle(wordsFilter(words), 10);
    const arrCards = [];
    data.forEach((el) => {
      arrCards.push({
        word: el.word,
        pair: el.word,
      });
      arrCards.push({
        word: el.wordTranslate,
        pair: el.word,
      });
    });

    return shuffle(arrCards);
  }

  createCard(cardData) {
    const face = create('div', 'find-a-pair-card__side find-a-pair-card__face', undefined, undefined, ['wordPair', cardData.pair]);
    const word = create('p', 'find-a-pair-card__word', cardData.word);
    const back = create('div', 'find-a-pair-card__side find-a-pair-card__back', word, undefined, ['wordPair', cardData.pair]);
    const cardContainer = create('div', 'find-a-pair-card__container', [face, back], undefined, ['wordPair', cardData.pair]);

    // cardContainer.addEventListener('mouseenter', (this.mouseEnterHandler).bind(cardContainer));
    // cardContainer.addEventListener('mouseleave', (this.mouseLeaveHandler).bind(cardContainer));

    cardContainer.addEventListener('click', (this.mouseClickHandler).bind({ obj: this, element: cardContainer }));

    const card = create('div', 'find-a-pair-card', cardContainer, undefined, ['wordPair', cardData.pair]);

    return card;
  }

  checkPair() {
    const checkedCards = document.querySelectorAll('.is-fixed');
    if (checkedCards.length === 2) {
      if (checkedCards[0].dataset.wordPair === checkedCards[1].dataset.wordPair) {
        this.findPairs += 1;
        this.playAudio('correct');
        checkedCards[0].classList.add('is-paired');
        checkedCards[1].classList.add('is-paired');
        this.updateFindPairs();
        if (this.findPairs === 10) this.resultsPage();
      } else {
        this.playAudio('error');
      }
    }
    this.fixedCards = 0;
    setTimeout(() => {
      checkedCards.forEach((element) => element.classList.remove('is-fixed'));
    }, 500);
  }

  playAudio(file) {
    this.audioObj.src = `./src/assets/audio/${file}.mp3`;
    this.audioObj.play();
  }

  startTimer() {
    this.timer = setInterval((this.timerHandler).bind(this), 1000);
  }

  updateFindPairs() {
    document.querySelector('#findcards_count').innerText = this.findPairs;
  }

  resultsPage() {
    this.preloader.show();
    this.clearTimer();
    this.saveStats();
    const globalFindedCards = localStorage.findedpairs || 0;
    const container = document.querySelector('#find-a-pair');
    container.innerHTML = '';
    container.classList.add('find-a-pair__start-page');

    create('p', 'find-a-pair__result-text', findAPairText.resultText, container);
    create('p', 'find-a-pair__finded-pairs', `${findAPairText.findCards}: ${this.findPairs} (${globalFindedCards})`, container);
    create('p', 'find-a-pair__next-level', `${findAPairText.nextLevel}: ${this.level}`, container);
    const newGame = create('button', 'find-a-pair__newgame-button', findAPairText.newGameButton, container);

    newGame.addEventListener('click', (this.newGameHandler).bind(this));
    this.preloader.hide();
  }

  levelUp() {
    this.level = (this.level < 6) ? this.level + 1 : this.level;
  }

  saveStats() {
    if (this.findPairs === 10) this.levelUp();
    const findPairs = Number(localStorage.findedpairs) || 0;
    localStorage.level = this.level;
    localStorage.findedpairs = findPairs + this.findPairs;
  }

  static clearPage() {
    const container = document.querySelector('#find-a-pair');
    if (container) container.remove();
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  startGameHandler() {
    this.startGame();
  }

  pauseGameHandler() {
    this.gameOnPause = !this.gameOnPause;
    document.querySelector('#find-a-pair-pause-button').innerText = (this.gameOnPause) ? findAPairText.onPauseButton : findAPairText.pauseButton;
  }

  mouseEnterHandler() {
    if (!this.gameOnPause) this.classList.add('is-flipped');
  }

  mouseLeaveHandler() {
    if (!this.gameOnPause) this.classList.remove('is-flipped');
  }

  mouseClickHandler() {
    if (!this.obj.gameOnPause && !this.element.classList.contains('is-paired')) {
      if (!this.obj.timer) {
        this.obj.startTimer();
      }
      this.element.classList.add('is-fixed');
      this.obj.fixedCards += 1;
      if (this.obj.fixedCards === 2) {
        this.obj.checkPair();
      }
    }
  }

  timerHandler() {
    if (!this.gameOnPause) {
      let seconds = parseInt(document.querySelector('#remain_seconds').innerText, 10);
      seconds -= 1;
      document.querySelector('#remain_seconds').innerText = seconds;
      if (seconds === 0) {
        this.resultsPage();
      }
    }
  }

  newGameHandler() {
    FindAPair.clearPage();
    this.renderStartPage();
  }
}
