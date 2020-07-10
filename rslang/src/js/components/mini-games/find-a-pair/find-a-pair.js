import {
  getWords,
} from '../../../service/service';
import {
  findAPairText,
  vocabularyConstants,
  wordsToLearnSelectConstants,
  StatisticsGameCodes,
} from '../../../constants/constants';
import create from '../../../utils/сreate';
import shuffle from '../../../utils/shuffle';
import wordsFilter from '../../../utils/wordsfilter';
import Preloader from '../../preloader/preloader';
import Settings from '../../settings/Settings';
import Statistics from '../../statistics/Statistics';
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

const {
  FIND_A_PAIR_GAME_CODE,
} = StatisticsGameCodes;

export default class FindAPair {
  constructor(miniGameObj) {
    this.user = miniGameObj.user;
    this.CloseButton = miniGameObj.closeButton;
    this.ShortTermStatistics = miniGameObj.shortTermStatistics;
  }

  async init() {
    this.level = Number(localStorage.level) || 0;
    this.fixedCards = 0;
    this.gameStarted = false;
    this.gameOnPause = false;
    this.gameShowCards = false;
    this.audioObj = new Audio();
    this.preloader = new Preloader();
    this.preloader.render();
    this.StartWindow = new StartWindow((this.startGame).bind(this));
    this.Vocabulary = new Vocabulary(this.user);
    await this.Vocabulary.init();
    const settings = new Settings(this.user);
    await settings.init();
    this.settings = settings.getSettingsByGroup('findapair');
    this.statistics = new Statistics(this.user);
    await this.statistics.init();
  }

  renderStartPage(container) {
    if (!this.main) {
      this.main = FindAPair.getRootElement(container);
    }

    if (!this.wrapper) {
      this.wrapper = create('div', 'find-a-pair__wrapper', undefined, this.main);
    }

    this.container = document.querySelector('#find-a-pair');
    if (!this.container) {
      this.container = create('div', 'find-a-pair__container', undefined, this.wrapper, ['id', 'find-a-pair']);
    }

    this.container.append(this.StartWindow.render('Find a pair', findAPairText.about, this.checkWordsCountInVocabulary()));
    this.container.classList.add('find-a-pair__start-page');
    this.container.classList.remove('find-a-pair_short-term-statistics');
    this.container.classList.remove('find-a-pair_on-pause');
  }

  async startGame(collection, group) {
    this.preloader.show();
    this.level = group || 0;
    this.data = await this.getCardsData(collection);
    this.openedWords = [];
    this.findPairs = 0;
    this.clearTimer();
    this.gameOnPause = false;
    this.closeButtonShowing = false;
    this.renderGame();
  }

  renderGame() {
    this.container.innerHTML = '';
    this.container.classList.remove('find-a-pair__start-page');

    const timerEl = create('i', 'find-a-pair-timer__seconds', `${findAPairConst.gameTimerSec}`, undefined, ['id', 'remain_seconds']);
    const timerContainer = create('div', 'find-a-pair-timer', timerEl);
    timerContainer.innerHTML += `
    <svg class="find-a-pair-timer__svg">
      <circle r="13" cx="15" cy="15"></circle>
    </svg>`;

    const findCardsEl = create('i', 'find-a-pair-findcards__count', `0 / ${findAPairConst.cardsCount}`, undefined, ['id', 'findcards_count']);
    const findCardsSpan = create('i', 'find-a-pair-findcards__text fas fa-search');
    const findCardsContainer = create('div', 'find-a-pair-findcards', [findCardsSpan, findCardsEl]);

    const pauseButton = create('button', 'find-a-pair__pause-button', '<i class="fas fa-pause"></i>', undefined, ['id', 'find-a-pair-pause-button'], ['title', findAPairText.pauseButton]);
    const controlbar = create('div', 'find-a-pair__controlbar', [timerContainer, findCardsContainer, pauseButton]);
    const playingField = create('div', 'find-a-pair__playing-field');

    this.data.forEach((data) => {
      playingField.append(this.createCard(data));
    });

    pauseButton.addEventListener('click', (this.pauseGameHandler).bind(this));

    this.CloseButton.show();
    this.CloseButton.addExitButtonClickCallbackFn((this.closeButtonHandler).bind(this));
    this.CloseButton.addCloseCallbackFn((this.newGameHandler).bind(this));
    this.CloseButton.addCancelCallbackFn((this.closeButtonHandler).bind(this));

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
      words = this.Vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE, true);
    } else {
      const page = Math.floor(Math.random() * findAPairConst.maxPages);
      words = wordsFilter(await getWords(page, this.level));
    }

    if (!words.length) {
      this.getCardsData();
    }
    this.words = shuffle(words, findAPairConst.cardsCount);
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
    document.querySelector('#findcards_count').innerText = `${this.findPairs} / ${findAPairConst.cardsCount}`;
  }

  resultsPage() {
    this.preloader.show();
    this.clearTimer();
    this.saveStats();
    const resWords = FindAPair.getResultWords(this.words, this.openedWords);

    this.statistics.saveGameStatistics(FIND_A_PAIR_GAME_CODE, resWords.correct.length, 0);

    this.ShortTermStatistics.render(resWords.wrong, resWords.correct);
    this.ShortTermStatistics.addCallbackFnOnClose((this.newGameHandler).bind(this));

    this.container.classList.add('find-a-pair_short-term-statistics');
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

  closeButtonHandler() {
    if (!this.closeButtonShowing) {
      if (!this.gameOnPause) {
        this.pauseGameHandler();
      }
      this.closeButtonShowing = true;
    } else {
      if (this.gameOnPause) {
        this.pauseGameHandler();
      }
      this.closeButtonShowing = false;
    }
  }

  pauseGameHandler() {
    this.gameOnPause = !this.gameOnPause;
    const pauseButton = document.querySelector('#find-a-pair-pause-button');
    if (this.gameOnPause) {
      this.container.classList.add('find-a-pair_on-pause');
      pauseButton.innerHTML = '<i class="fas fa-play"></i>';
      pauseButton.setAttribute('title', findAPairText.onPauseButton);
    } else {
      this.container.classList.remove('find-a-pair_on-pause');
      pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
      pauseButton.setAttribute('title', findAPairText.pauseButton);
    }
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
    this.clearTimer();
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

  checkWordsCountInVocabulary() {
    const vocabuleryLength = this.Vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE);
    return (vocabuleryLength >= findAPairConst.cardsCount);
  }

  static getRootElement(container) {
    const htmlElementNode = 1;
    const typeOBJECT = 'object';
    const typeSTRING = 'string';
    let rootContainer;

    switch (typeof container) {
      case typeOBJECT:
        if (container.nodeType === htmlElementNode) {
          rootContainer = container;
        }
        break;
      case typeSTRING:
        rootContainer = document.querySelector(container);
        break;
      default:
        rootContainer = document.body;
        break;
    }

    return rootContainer;
  }
}
