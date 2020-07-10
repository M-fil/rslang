import create from '../../../utils/сreate';
import {
  savannahConstants, vocabularyConstants, wordsToLearnSelectConstants, StatisticsGameCodes,
} from '../../../constants/constants';
import { getWords } from '../../../service/service';
import Preloader from '../../preloader/Preloader';
import { shuffle } from '../../../utils/shuffle';
import ShortTermStatistics from '../common/ShortTermStatistics';
import { playAudio } from '../../../utils/audio';
import CloseButton from '../common/CloseButton';
import ModalWindow from '../common/ModalWindow';
import StartWindow from '../common/StartWindow';
import Vocabulary from '../../vocabulary/Vocabulary';
import Statistics from '../../statistics/Statistics';

const {
  SAVANNAH_SECONDS_COUNT,
  RULES,
  LAST_NUMBER,
  MAX_PAGE,
  RANDOM_WORDS,
  MAX_WORDS_LINE,
  LIVES,
  FRAME,
  END_ANIMATION,
  DIVIDER,
  ADD_LIVES,
  PLUS_LIVE,
  AUDIO_CORRECT,
  AUDIO_ERROR,
  AUDIO_BONUS,
  AUDIO_TICKING,
  STAT_IMAGE_AUDIO,
  LIVES_IMAGE_BLACK,
  LIVES_IMAGE_INHERIT,
  MAX_WORDS,
  GAME_NAME,
  MIN_VOCABULARY_WORDS,
} = savannahConstants;

const {
  WORDS_TO_LEARN_TITLE,
  LEARNED_WORDS_TITLE,
} = vocabularyConstants;

const {
  SELECT_OPTION_LEARNED_WORDS_VALUE,
} = wordsToLearnSelectConstants;

const {
  SAVANNA_GAME_CODE,
} = StatisticsGameCodes;

export default class SavannahGame {
  constructor(miniGameParameters) {
    this.userState = miniGameParameters.user;
    this.closeButton = miniGameParameters.closeButton;
    this.shortTermStatistics = miniGameParameters.shortTermStatistics;

    this.HTML = null;
    this.preloader = new Preloader();
    this.audio = new Audio();
    this.shortTermStatistics = new ShortTermStatistics();
    this.error = 0;
    this.modalWindow = new ModalWindow();
    this.startWindow = new StartWindow((this.reverseReport).bind(this));
    this.startWindow.gameWindow.classList.add('savannah__start-game-window');
    this.closeButton = new CloseButton();
    this.vocabulary = new Vocabulary(this.userState);
    this.statistics = new Statistics(this.userState);
  }

  async render(elementQuery) {
    this.learnedWords();
    this.startPage = this.startWindow.render(GAME_NAME, RULES, this.isVocabularyWords);
    this.content = document.querySelector(elementQuery);
    this.container = create('div', 'savannah__container', this.startPage, this.content);
    this.container.append(this.closeButton.render());
    this.allWords = document.querySelectorAll('.word');
    this.arrayBeforeClickWords = [];
    this.preloader.render();
    this.gameWindow = document.querySelector('.start-game-window');
    this.startButton = document.querySelector('.start-button');
    await this.vocabulary.init();
    this.wordClick();
    this.keyboardClick();
  }

  learnedWords() {
    if (this.vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE) >= MIN_VOCABULARY_WORDS) {
      this.isVocabularyWords = true;
    } else {
      this.isVocabularyWords = false;
    }
  }

  reverseReport(collection, group) {
    playAudio(AUDIO_TICKING, this.audio);
    this.container.classList.add('savannah__container_in-game');
    this.numberReverse = create('span', 'number-reverse', '', this.container);
    SavannahGame.changeDisplay(this.gameWindow, 'none');
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
        this.mainGame(collection, group);
      }
    }, 1000);
  }

  async mainGame(collection, group) {
    SavannahGame.changeDisplay(this.numberReverse, 'none');
    this.page = Math.floor(Math.random() * MAX_PAGE);
    this.data = await getWords(this.page, group);
    this.crateCardsData(collection);
    this.offAudio();
    this.createModal();
    await this.statistics.init();
    this.changeLives();
    this.animatedWord();
    this.liveIndex = 0;
    this.rusBut = document.querySelectorAll('.word_russian');
    this.rightWords = [];
    this.wrongWords = [];
    this.correctWordNumber = 0;
    this.countLives = 0;
    this.pauseAudio();
  }

  crateCardsData(collection) {
    if (this.vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE) >= MIN_VOCABULARY_WORDS && collection === SELECT_OPTION_LEARNED_WORDS_VALUE) {
      this.engRandomWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE, true);
    } else {
      this.engRandomWords = this.data;
    }
    this.closeButton.show();
    this.preloader.hide();
    this.num = 0;
    this.lineForInfo = create('div', 'line-info', '', this.container);
    this.offSound = create('button', 'sound sound_on', '<i class="fas fa-volume-up"></i>', this.lineForInfo);
    this.lives = create('div', 'lives', '', this.lineForInfo);
    this.engLine = create('div', 'english-line', '', this.container);
    this.rusLine = create('div', 'russian-line', '', this.container);
    shuffle(this.engRandomWords);

    this.engBut = create('span', 'word word_english', this.engRandomWords[this.num].word, this.engLine);
    this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
    this.arrayBeforeClickWords = this.engRandomWords[this.num];

    this.engBut.disabled = true;
    this.wordsTranslate = [];
    for (let i = 0; i < this.engRandomWords.length; i += 1) {
      if (this.engBut.dataset.translate === this.engRandomWords[i].wordTranslate) {
        this.wordsTranslate.push(this.engBut.dataset.translate);
      }
      if (this.engBut.dataset.translate !== this.engRandomWords[i].wordTranslate && this.wordsTranslate.length < MAX_WORDS_LINE) {
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
    this.closeButton.disabled(false);
    this.wordsTranslate.length = 0;
    this.num += 1;
    this.engBut.innerHTML = this.engRandomWords[this.num].word;
    this.engBut.setAttribute('data-translate', this.engRandomWords[this.num].wordTranslate);
    this.arrayBeforeClickWords = this.engRandomWords[this.num];

    const randomData = this.engRandomWords;
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

  checkWord(event, target) {
    clearInterval(this.timer);
    clearTimeout(this.errorTimer);
    const englishWord = document.querySelector('.word_english');
    const engTranslate = englishWord.dataset.translate;
    if (target.dataset.translate === engTranslate) {
      this.correctWordNumber += 1;
      this.rightWords.push(this.arrayBeforeClickWords);
      playAudio(AUDIO_CORRECT, this.audio);
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
    }
  }

  async createStatistics() {
    clearInterval(this.timer);
    clearTimeout(this.errorTimer);
    this.shortTermStatistics.render(this.wrongWords, this.rightWords);
    this.shortTermStatistics.modalClose.addEventListener('click', this.goToTheStartPageHandler.bind(this));
    const arrayOfPromises = this.wrongWords
      .map((word) => this.vocabulary.addWordToTheVocabulary(word, WORDS_TO_LEARN_TITLE));
    await Promise.all(arrayOfPromises);
    await this.statistics.saveGameStatistics(
      SAVANNA_GAME_CODE, this.rightWords.length, this.wrongWords.length,
    );
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

  pauseAudio() {
    this.audio.pause();
  }

  offAudio() {
    this.offSound.addEventListener('click', () => {
      if (this.offSound.classList.contains('sound_on')) {
        this.offSound.classList.add('sound_off');
        this.offSound.classList.remove('sound_on');
        this.offSound.innerHTML = '<i class="fas fa-volume-mute"></i>';
        this.audio.muted = true;
      } else {
        this.offSound.classList.remove('sound_off');
        this.offSound.classList.add('sound_on');
        this.offSound.innerHTML = '<i class="fas fa-volume-up"></i>';
        this.audio.muted = false;
      }
    });
  }

  createModal() {
    this.closeButton.addExitButtonClickCallbackFn((this.clearTime).bind(this));
    this.closeButton.addCancelCallbackFn((this.clickCancelButton).bind(this));
    this.closeButton.addCloseCallbackFn(this.goToTheStartPageHandler.bind(this));
  }

  clickCancelButton() {
    this.closeButton.resume((this.animatedWord).bind(this));
  }

  clearTime() {
    clearInterval(this.timer);
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
    playAudio(AUDIO_BONUS, this.audio);
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
    playAudio(AUDIO_ERROR, this.audio);
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
    if (this.error === (LIVES + this.countLives) || (this.rightWords.length + this.wrongWords.length) === MAX_WORDS) {
      this.createStatistics();
    }
  }

  disabledButtons() {
    this.rusBut.forEach((rusButton) => {
      const disabledButton = rusButton;
      disabledButton.disabled = true;
    });
    this.closeButton.disabled(true);
  }

  static changeDisplay(element, event) {
    const el = element;
    if (event === 'none') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }

  goToTheStartPageHandler() {
    this.container.classList.remove('savannah__container_in-game');
    this.container.innerHTML = '';
    this.startWindow.gameWindow.remove();
    const isShowLearnedWordsOption = this.vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE) >= MIN_VOCABULARY_WORDS;
    const startWindowHTML = this.startWindow.render(
      GAME_NAME, RULES, isShowLearnedWordsOption,
    );
    this.container.append(startWindowHTML);
    SavannahGame.changeDisplay(this.gameWindow, 'block');
    this.container.append(this.closeButton.render());
    this.closeButton.hide();
    this.error = 0;
    this.closeButton.disabled(false);
  }
}
