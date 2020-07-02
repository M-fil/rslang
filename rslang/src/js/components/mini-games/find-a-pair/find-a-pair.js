import {
  getWords,
} from '../../../service/service';
import {
  findAPairText,
  vocabularyConstants,
  wordsToLearnSelectConstants,
} from '../../../constants/constants';
import create from '../../../utils/сreate';
import shuffle from '../../../utils/shuffle';
import wordsFilter from '../../../utils/wordsfilter';
import Preloader from '../../preloader/preloader';
import Settings from '../../settings/Settings';
import ShortTermStatisctics from '../common/ShortTermStatistics';
import CloseButton from '../common/CloseButton';
import StartWindow from '../common/StartWindow';
import Vocabulary from '../../vocabulary/Vocabulary';

const {
  SELECT_OPTION_LEARNED_WORDS_VALUE,
} = wordsToLearnSelectConstants;

const {
  LEARNED_WORDS_TITLE,
} = vocabularyConstants;

const findAPairConst = {
  maxPages: 30,
  maxLevel: 6,
  cardsCount: 10,
  cardsCheckCount: 2,
  delayForClosingCards: 500,
  gameTimerSec: 90,
  gameTimerInterval: 1000,
};

export default class FindAPair {
  constructor(user) {
    this.user = user;
  }

  async init() {
    this.level = Number(localStorage.level) || 1;
    this.fixedCards = 0;
    this.gameStarted = false;
    this.gameOnPause = false;
    this.gameShowCards = false;
    this.openedWords = [];
    this.audioObj = new Audio();
    this.preloader = new Preloader();
    this.preloader.render();
    this.ShortTermStatistics = new ShortTermStatisctics();
    const StartPage = new StartWindow();
    this.StartWindow = StartPage.render('Find a pair', findAPairText.about, (this.startGame).bind(this));
    this.CloseButton = new CloseButton();
    this.Vocabulary = new Vocabulary(this.user);
    await this.Vocabulary.init();
    const settings = new Settings(this.user);
    await settings.init();
    this.settings = settings.getSettingsByGroup('findapair');
  }

  renderStartPage(container) {
    if (!this.main) {
      this.main = document.querySelector(container) || document.body;
    }
    this.container = document.querySelector('#find-a-pair');
    if (!this.container) {
      this.container = create('div', 'find-a-pair', undefined, this.main, ['id', 'find-a-pair']);
    }
    this.container.append(this.StartWindow);
    this.container.classList.add('find-a-pair__start-page');
  }

  async startGame(collection) {
    this.preloader.show();
    this.data = await this.getCardsData(collection);
    this.findPairs = 0;
    this.clearTimer();
    this.gameOnPause = false;
    this.renderGame();
  }

  renderGame() {
    this.container.innerHTML = '';
    this.container.classList.remove('find-a-pair__start-page');

    const timerEl = create('i', 'find-a-pair-timer__seconds', `${findAPairConst.gameTimerSec}`, undefined, ['id', 'remain_seconds']);
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

    this.CloseButton.show();
    this.CloseButton.addExitButtonClickCallbackFn((this.pauseGameHandler).bind(this));
    this.CloseButton.addCloseCallbackFn((this.newGameHandler).bind(this));
    this.CloseButton.addCancelCallbackFn((this.pauseGameHandler).bind(this));

    this.container.appendChild(controlbar);
    this.container.appendChild(playingField);
    this.container.append(this.CloseButton.render());
    this.preloader.hide();

    if (this.settings.showCardsTextOnStart) {
      this.startTimer();
      this.showCards();
    }
  }

  async getCardsData(collection) {
    let words;
    if (
      this.Vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE) >= findAPairConst.cardsCount
      && collection === SELECT_OPTION_LEARNED_WORDS_VALUE
    ) {
      words = this.Vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
      console.log('Words from User collection');
    } else {
      const page = Math.floor(Math.random() * findAPairConst.maxPages);
      words = await getWords(page, this.level - 1);
      console.log('Words from base collection');
    }

    if (!words.length) {
      this.getCardsData();
    }
    this.words = shuffle(wordsFilter(words), findAPairConst.cardsCount);
    const arrCards = [];
    this.words.forEach((el) => {
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

    cardContainer.addEventListener('click', (this.mouseClickHandler).bind({ obj: this, element: cardContainer }));

    const card = create('div', 'find-a-pair-card', cardContainer, undefined, ['wordPair', cardData.pair]);

    return card;
  }

  checkPair() {
    const checkedCards = document.querySelectorAll('.is-fixed');
    if (checkedCards.length === findAPairConst.cardsCheckCount) {
      if (checkedCards[0].dataset.wordPair === checkedCards[1].dataset.wordPair) {
        this.findPairs += 1;
        this.playAudio('correct');
        checkedCards[0].classList.add('is-paired');
        checkedCards[1].classList.add('is-paired');
        this.openedWords.push(checkedCards[0].dataset.wordPair);
        this.updateFindPairs();
        if (this.findPairs === findAPairConst.cardsCount) this.resultsPage();
      } else {
        this.playAudio('error');
      }
    }
    this.fixedCards = 0;
    setTimeout(() => {
      checkedCards.forEach((element) => element.classList.remove('is-fixed'));
    }, this.settings.delayBeforeClosingCard);
  }

  playAudio(file) {
    this.audioObj.src = `./src/assets/audio/${file}.mp3`;
    this.audioObj.play();
  }

  startTimer() {
    this.timer = setInterval((this.timerHandler).bind(this), findAPairConst.gameTimerInterval);
  }

  updateFindPairs() {
    document.querySelector('#findcards_count').innerText = this.findPairs;
  }

  resultsPage() {
    this.preloader.show();
    this.clearTimer();
    this.saveStats();
    const resWords = FindAPair.getResultWords(this.words, this.openedWords);

    this.ShortTermStatistics.render(resWords.wrong, resWords.correct);
    this.ShortTermStatistics.addCallbackFnOnClose((this.newGameHandler).bind(this));

    this.preloader.hide();
  }

  levelUp() {
    this.level = (this.level < findAPairConst.maxLevel) ? this.level + 1 : this.level;
  }

  saveStats() {
    if (this.findPairs === findAPairConst.cardsCount) this.levelUp();
    const findPairs = Number(localStorage.findedpairs) || 0;
    localStorage.level = this.level;
    localStorage.findedpairs = findPairs + this.findPairs;
  }

  clearPage() {
    this.container.innerHTML = '';
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
    if (!this.obj.gameOnPause && !this.gameShowCards && !this.element.classList.contains('is-paired')) {
      if (!this.obj.timer) {
        this.obj.startTimer();
      }
      this.element.classList.add('is-fixed');
      this.obj.fixedCards += 1;
      if (this.obj.fixedCards === findAPairConst.cardsCheckCount) {
        this.obj.checkPair();
      }
    }
  }

  timerHandler() {
    if (!this.gameOnPause) {
      let seconds = Number(document.querySelector('#remain_seconds').innerText);
      seconds -= 1;
      document.querySelector('#remain_seconds').innerText = seconds;
      if (seconds === 0) {
        this.resultsPage();
      }
    }
  }

  newGameHandler() {
    this.clearPage();
    this.ShortTermStatistics.hide();
    this.renderStartPage();
  }

  showCards() {
    this.gameShowCards = true;
    const cards = document.querySelectorAll('.find-a-pair-card__container');
    cards.forEach((el) => {
      el.classList.add('is-fixed');
    });

    setTimeout(() => {
      cards.forEach((el) => {
        el.classList.remove('is-fixed');
      });
      this.gameShowCards = false;
    }, this.settings.showingCardsTime);
  }

  static getResultWords(words, arr) {
    const correctWords = [];
    const wrongWords = [];

    words.forEach((word) => {
      if (arr.includes(word.word)) {
        correctWords.push(word);
      } else {
        wrongWords.push(word);
      }
    });

    return {
      correct: correctWords,
      wrong: wrongWords,
    };
  }
}
