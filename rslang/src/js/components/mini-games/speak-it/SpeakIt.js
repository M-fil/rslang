import create, {
  getWords,
  wordsToLearnSelectConstants,
  urls,
  speakItConstants,
  getRandomInteger,
  vocabularyConstants,
  StatisticsGameCodes,
} from './pathes';

import WordCard from './components/words/WordCard';
import ImageBlock from './components/imageBlock/ImageBlock';
import Navigation from './components/navigation/Navigation';
import ButtonsBlock from './components/buttons/ButtonsBlock';
import MicrophoneButton from './components/buttons/MicrophoneButton';
import Preloader from '../../preloader/Preloader';
import Vocabulary from '../../vocabulary/Vocabulary';
import StatisticsBlock from './components/statistics/StatisticsBlock';
import Statistics from '../../statistics/Statistics';
import StartPage from './components/pages/StartPage';

const {
  WORDS_IMAGES_URL,
  WORDS_AUDIOS_URL,
  DEAFAULT_SPEAKIT_WORD_IMAGE_URL,
  CORRECT_AUDIO_PATH,
  SUCCESS_AUDIO_PATH,
} = urls;

const {
  SELECT_OPTION_LEARNED_WORDS_VALUE,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE,
} = wordsToLearnSelectConstants;

const {
  WORDS_LIMIT_NUMBER,
  SPEAKIT_TITLE,
} = speakItConstants;

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

const {
  SPEAK_IT_GAME_CODE,
} = StatisticsGameCodes;

export default class SpeakIt {
  constructor(miniGameParameters, elementQuery) {
    this.userState = miniGameParameters.user;
    this.closeButton = miniGameParameters.closeButton;
    this.elementQuery = elementQuery;

    this.currentArrayOfWords = [];
    this.words = [];
    this.skippedWords = [];
    this.guessedWords = [];
    this.learnedWords = [];
    this.iDontKnowWords = [];
    this.audio = new Audio();
    this.recognition = SpeakIt.createSpeechRecongnition();

    this.startWindow = new StartPage(this.initMainGamePage.bind(this));
    this.vocabulary = new Vocabulary(this.userState);
    this.statistics = new Statistics(this.userState);
    this.preloader = new Preloader();
    this.preloader.render();
    this.shortTermStatistics = new StatisticsBlock();

    this.state = {
      currentWordsType: SELECT_OPTION_LEARNED_WORDS_VALUE,
      gameStarted: false,
      currentPage: 0,
      groupOfWords: 0,
      correct: 0,
      isMicroDisabled: true,
      userState: this.userState,
    };
    this.recognition.addEventListener('end', this.recognition.start);
    this.recognition.start();
  }

  async run() {
    await this.vocabulary.init();
    await this.renderStartGamePage(this.elementQuery);
    this.createMainContainerWrapper();
    this.activateAllHanlders();
  }

  activateAllHanlders() {
    this.startGame();
    this.wordCardClickEvent();
    this.activateContinueButton();
    this.activateRestartButton();
    this.activateMicroButton();
    this.activateNavigation();
    this.activateStatisticsBlock();
    this.activateSkipButtons();
    this.activateStatisticsButtons();
  }

  async renderStartGamePage() {
    this.learnedWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
    const isShowLearnedWordsOption = this.learnedWords.length >= WORDS_LIMIT_NUMBER;
    const startWindowHTML = this.startWindow.render(
      SPEAKIT_TITLE, this.startWindow.renderExplanations(), isShowLearnedWordsOption,
    );
    this.activateSelectLevelOnStartPage();
    await this.activateWordsToLearnSelect();
    this.startWindowContainer = create('div', 'start-window-container', startWindowHTML);

    document.querySelector(this.elementQuery).append(this.startWindowContainer);
  }

  async goToTheStartPageHandler() {
    document.querySelector('.speak-it__main').classList.remove('in-game');
    this.closeButton.exitButton.classList.remove('speak-it__exit-button');
    this.shortTermStatistics.buttonsBlock.remove();
    this.startWindow.gameWindow.remove();
    await this.renderStartGamePage();
  }

  createMainContainerWrapper() {
    const container = document.querySelector(this.elementQuery);
    const wrapper = create('div', 'main-container__wrapper');
    create('div', 'speak-it__main', wrapper, container);
  }

  async initMainGamePage() {
    this.shortTermStatistics.modalClose.addEventListener('click', this.goToTheStartPageHandler.bind(this));
    this.createMainContainerWrapper();
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    this.startWindow.gameWindow.remove();
    this.startWindowContainer.remove();
    mainContainerWrapper.innerHTML = '';
    document.querySelector('.speak-it__main').classList.add('in-game');

    mainContainerWrapper.append(create('div', 'score hidden'));
    mainContainerWrapper.append(create('div', 'overlay hidden'));
    this.preloader.show();

    await this.statistics.init();
    await this.renderWordsOnThePage();
    this.acitavateRecognition();
    this.selectWordsGroupBeforeRender();
  }

  renderNavigation(isPrepand = false) {
    this.navigation = new Navigation();
    const navigationHTML = this.navigation.render();
    const navigationContainer = create('div', 'navigation');
    const microphone = new MicrophoneButton();
    navigationContainer.append(microphone.render());
    microphone.HTML.classList.remove('hidden');

    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    if (isPrepand) {
      navigationContainer.append(navigationHTML);
      mainContainerWrapper.prepend(navigationContainer);
    } else {
      navigationContainer.append(navigationHTML);
      mainContainerWrapper.append(navigationContainer);
    }

    if (this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS_VALUE) {
      this.navigation.hide();
    } else {
      this.navigation.show();
    }

    this.closeButton.addCloseCallbackFn(this.goToTheStartPageHandler.bind(this));
    this.closeButton.show();
    this.closeButton.exitButton.classList.add('speak-it__exit-button');
    navigationContainer.append(this.closeButton.render());
  }

  async getColectionWords() {
    this.state.currentPage = getRandomInteger();
    this.words = await getWords(this.state.currentPage, this.state.groupOfWords);
  }

  removeGamePage() {
    this.gamePageHTML = document.querySelector('.game-page');
    if (this.gamePageHTML) {
      this.gamePageHTML.remove();
    }
  }

  renderWords() {
    this.removeGamePage();
    const container = create('div', 'game-page');
    const wordsContainer = create('div', 'game-page__words', '', container);

    this.imageBlock = new ImageBlock();
    container.prepend(this.imageBlock.render());

    this.currentArrayOfWords.forEach((word) => {
      this.wordCard = new WordCard(word.id || word._id, word.word, word.transcription);
      wordsContainer.append(this.wordCard.render());
    });

    document.querySelector('.navigation').after(container);
  }

  async renderWordsOnThePage() {
    this.preloader.show();
    const learnedWordsLength = this.vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE);

    if ((this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS_VALUE)
      && (learnedWordsLength > WORDS_LIMIT_NUMBER)
    ) {
      this.renderNavigation();
      this.renderLearnedWords();
    } else {
      this.renderNavigation();
      this.renderSpeacifiedWordsType();
    }
    this.preloader.hide();
  }

  renderSpeacifiedWordsType() {
    this.renderWords();
    const buttonsHTML = document.querySelector('.buttons-container');
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    if (!buttonsHTML) {
      mainContainerWrapper.append(new ButtonsBlock().render());
    }
  }

  renderLearnedWords() {
    this.learnedWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
    const buttonsHTML = document.querySelector('.buttons-container');
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');

    this.currentArrayOfWords = this.learnedWords.map((word) => word.optional.allData);
    this.currentArrayOfWords = this.currentArrayOfWords.slice(0, WORDS_LIMIT_NUMBER);
    this.iDontKnowWords = this.currentArrayOfWords;
    this.renderWords();
    this.shortTermStatistics.render(this.iDontKnowWords, []);
    this.shortTermStatistics.hide();
    if (!buttonsHTML) {
      mainContainerWrapper.append(new ButtonsBlock().render());
    }
  }

  playWordAudio(source) {
    this.audio = new Audio(source);
    this.audio.play();
  }

  wordCardClickEvent() {
    document.querySelector('.speak-it__main').addEventListener('click', (event) => {
      const target = event.target.closest('.word-card');

      if (target && !this.state.gameStarted) {
        SpeakIt.selectSingleElementFromList(target, 'word-card_selected');
        const clickedWord = this.currentArrayOfWords
          .find((word) => (word.id || word._id) === target.dataset.wordId);

        const translation = clickedWord.wordTranslate;
        this.playWordAudio(`${WORDS_AUDIOS_URL}${clickedWord.audio}`);

        let currentImage = DEAFAULT_SPEAKIT_WORD_IMAGE_URL;
        currentImage = `${WORDS_IMAGES_URL}${clickedWord.image}`;
        this.imageBlock.update(currentImage, translation);
      }
    });
  }

  async selectWordsToLearn() {
    this.learnedWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);

    if (this.learnedWords.length < WORDS_LIMIT_NUMBER) {
      this.state.currentWordsType = SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE;
      this.startWindow.wordsToLearnSelect.selectIndexByValue(SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE);
      await this.selectCollectionWords();
    } else {
      this.state.currentWordsType = SELECT_OPTION_LEARNED_WORDS_VALUE;
      this.currentArrayOfWords = this.learnedWords.map((word) => word.optional.allData);
      this.currentArrayOfWords = this.currentArrayOfWords.slice(0, WORDS_LIMIT_NUMBER);
      this.iDontKnowWords = this.currentArrayOfWords;
      this.shortTermStatistics.render(this.iDontKnowWords, []);
      this.shortTermStatistics.hide();
    }
  }

  async selectCollectionWords() {
    await this.getColectionWords();
    this.currentArrayOfWords = this.words;
    this.currentArrayOfWords = this.currentArrayOfWords.slice(0, WORDS_LIMIT_NUMBER);
    this.iDontKnowWords = this.currentArrayOfWords;
    this.shortTermStatistics.render(this.iDontKnowWords, []);
    this.shortTermStatistics.hide();
  }

  async activateWordsToLearnSelect() {
    await this.selectWordsToLearn();

    const { select } = this.startWindow.wordsToLearnSelect;
    select.addEventListener('change', async (event) => {
      const { options, selectedIndex } = event.target;
      const selectedValue = options[selectedIndex].value;

      this.preloader.show();
      switch (selectedValue) {
        case SELECT_OPTION_LEARNED_WORDS_VALUE:
        default: {
          await this.selectWordsToLearn();
          this.state.currentWordsType = SELECT_OPTION_LEARNED_WORDS_VALUE;
          break;
        }
        case SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE: {
          await this.selectCollectionWords();
          this.state.currentWordsType = SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE;
          break;
        }
      }
      this.preloader.hide();
    });
  }

  static selectSingleElementFromList(target, selectedClass) {
    Array.from(document.querySelectorAll(`.${selectedClass}`)).forEach((elem) => {
      elem.classList.remove(selectedClass);
    });

    if (target) {
      target.classList.add(selectedClass);
    }
  }

  activateSkipButtons() {
    document.querySelector('.speak-it__main').addEventListener('click', async (event) => {
      const target = event.target.closest('.word-card__skip-word-button');

      if (target) {
        const wordCardHTML = target.closest('.word-card');
        const { wordId } = wordCardHTML.dataset;
        wordCardHTML.classList.add('word-card_skipped');

        const wordObject = this.currentArrayOfWords
          .find((word) => (word.id || word._id) === wordId);
        this.skippedWords.push(wordObject);
        await this.checkIsGameEnded();
      }
    });
  }

  async addSkippedWordsToTheWordsToLearn() {
    const arrayOfPromises = this.skippedWords
      .map((word) => this.vocabulary.addWordToTheVocabulary(word, WORDS_TO_LEARN_TITLE));
    await Promise.all(arrayOfPromises);
  }

  startGame() {
    document.querySelector('.speak-it__main').addEventListener('click', (event) => {
      const target = event.target.closest('.speak-it__start-game-button');
      if (!this.state.gameStarted && target) {
        const wordCardsHTML = document.querySelectorAll('.word-card');
        this.state.gameStarted = true;
        wordCardsHTML.forEach((wordHTML) => {
          wordHTML.classList.add('word-card_in-game');
        });

        document.querySelector('.microphone-button').classList.remove('microphone-button_disabled');
        document.querySelector('.microphone-button i').className = 'fas fa-microphone';
        this.state.isMicroDisabled = false;

        document.querySelector('.word-info__speech-recognition').classList.remove('hidden');
        document.querySelector('.word-info__translation').classList.add('hidden');
        document.querySelector('.word-info__image').src = DEAFAULT_SPEAKIT_WORD_IMAGE_URL;

        Array.from(document.querySelectorAll('.word-card_selected')).forEach((elem) => {
          elem.classList.remove('word-card_selected');
        });
      }
    });
  }

  static createSpeechRecongnition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    return recognition;
  }

  acitavateRecognition() {
    const listOfWords = this.currentArrayOfWords.map((word) => {
      const item = word.word.toLowerCase();
      return item;
    });

    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const recognitionList = new SpeechGrammarList();
    const grammar = `#JSGF V1.0; grammar words; public <words> = ${listOfWords.join(' | ')} ;`;
    recognitionList.addFromString(grammar, 1);
    this.recognition.grammars = recognitionList;
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', async (event) => {
      if (!this.state.gameStarted) return;
      if (this.state.isMicroDisabled) return;

      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      const resultHTML = document.querySelector('.word-info__speech-recognition span');
      const wordInfoHTML = document.querySelector('.game-page__word-info');
      const scoreHTML = document.querySelector('.score');

      if (resultHTML) {
        resultHTML.textContent = transcript;
      }
      const pronouncedWords = transcript.trim().toLowerCase().split(' ');
      const guessedWord = listOfWords.find((word) => pronouncedWords.includes(word));
      const guessedWordObject = this.currentArrayOfWords.find((word) => word.word === guessedWord);
      const currentWordHTML = document.querySelector(`[data-word="${(guessedWord) || ''}"]`);

      if (
        guessedWord && currentWordHTML
        && !currentWordHTML.classList.contains('word-card_guessed')
        && !currentWordHTML.classList.contains('word-card_skipped')
      ) {
        currentWordHTML.classList.add('word-card_guessed');
        this.playWordAudio(CORRECT_AUDIO_PATH);
        wordInfoHTML.remove();
        const currentImage = `${WORDS_IMAGES_URL}${guessedWordObject.image}`;
        const imageBlock = new ImageBlock(currentImage, guessedWord, '', false);
        document.querySelector('.game-page').prepend(imageBlock.render());
        resultHTML.textContent = guessedWord;

        scoreHTML.textContent = `+${this.state.correct += 1}`;
        scoreHTML.classList.remove('hidden');
        this.guessedWords.push(guessedWordObject);
        this.iDontKnowWords = this.iDontKnowWords
          .filter((word) => (word.id || word._id) !== guessedWordObject.id);
        this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);

        await this.checkIsGameEnded();
      }
    });
  }

  activateContinueButton() {
    document.querySelector('.speak-it-statistics__buttons').addEventListener('click', (event) => {
      const target = event.target.closest('.continue-button');

      if (target && this.shortTermStatistics) {
        this.shortTermStatistics.hide();
      }
    });
  }

  async checkIsGameEnded() {
    const numberOfCorrectWords = this.currentArrayOfWords.length - this.skippedWords.length;

    if (this.state.correct === numberOfCorrectWords) {
      setTimeout(() => {
        this.playWordAudio(SUCCESS_AUDIO_PATH);
        this.shortTermStatistics.update(this.skippedWords, this.guessedWords);
        this.shortTermStatistics.show();
        this.shortTermStatistics.modalClose.removeAttribute('disabled');
        this.shortTermStatistics.continueButton.classList.add('hidden');
      }, 1000);
      await this.addSkippedWordsToTheWordsToLearn();
      await this.statistics.saveGameStatistics(
        SPEAK_IT_GAME_CODE, this.guessedWords.length, this.skippedWords.length,
      );
    }
  }

  activateSelectLevelOnStartPage() {
    const { selectLevel } = this.startWindow.wordsToLearnSelect;

    selectLevel.addEventListener('change', async (event) => {
      this.preloader.show();
      const { target } = event;
      const { options } = target;
      const targetValue = Number(options[target.selectedIndex].value);
      await this.setCollectionWordsData(targetValue);
      this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);
      this.preloader.hide();
    });
  }

  selectWordsGroupBeforeRender() {
    const optionsHTML = document.querySelector('.navigation__group-select').options;
    Array.from(optionsHTML).forEach((option) => {
      option.removeAttribute('selected');
    });
    Array.from(optionsHTML)[this.state.groupOfWords].setAttribute('selected', '');
  }

  activateNavigation() {
    document.querySelector('.speak-it__main').addEventListener('change', async (event) => {
      const target = event.target.closest('.navigation__group-select');

      if (target) {
        const { options } = target;
        const targetValue = Number(options[target.selectedIndex].value);
        this.switchOnTrainingMode();
        await this.renderMainGamePage(targetValue);
        this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);
        this.shortTermStatistics.hide();
      }
    });
  }

  async setCollectionWordsData(groupNumber) {
    const randomPage = getRandomInteger();
    this.preloader.show();
    this.state.groupOfWords = groupNumber;
    this.state.currentPage = randomPage;
    const wordsData = await getWords(this.state.currentPage, groupNumber);
    this.currentArrayOfWords = wordsData.slice(0, WORDS_LIMIT_NUMBER);
    this.iDontKnowWords = this.currentArrayOfWords;
    this.guessedWords = [];
  }

  async renderMainGamePage(groupNumber) {
    await this.setCollectionWordsData(groupNumber);
    document.querySelector('.game-page').remove();
    this.renderWords();

    this.acitavateRecognition();
    this.preloader.hide();
  }

  switchOnTrainingMode() {
    document.querySelector('.word-info__image').src = DEAFAULT_SPEAKIT_WORD_IMAGE_URL;
    document.querySelector('.word-info__translation').textContent = '';
    document.querySelector('.word-info__speech-recognition span').textContent = '';

    document.querySelector('.word-info__speech-recognition').classList.add('hidden');
    document.querySelector('.word-info__translation').classList.remove('hidden');

    document.querySelector('.score').classList.add('hidden');
    document.querySelector('.score').textContent = '';

    Array.from(document.querySelectorAll('.word-card')).forEach((elem) => {
      elem.classList.remove('word-card_guessed');
      elem.classList.remove('word-card_selected');
      elem.classList.remove('word-card_skipped');
      elem.classList.remove('word-card_in-game');
    });

    this.disableMicro();
    this.state.correct = 0;
    this.state.gameStarted = false;
  }

  disableMicro() {
    this.state.isMicroDisabled = true;
    const micro = document.querySelector('.microphone-button');
    micro.classList.add('microphone-button_disabled');
    micro.querySelector('i').className = 'fas fa-microphone-slash';
  }

  activateStatisticsBlock() {
    document.querySelector('.speak-it__main').addEventListener('click', (event) => {
      const target = event.target.closest('.speak-it__result-button');

      if (target) {
        this.shortTermStatistics.show();
      }
    });
  }

  async renderNewGameWithCollectionWords() {
    this.shortTermStatistics.hide();
    this.guessedWords = [];
    this.skippedWords = [];
    this.switchOnTrainingMode();
    await this.renderMainGamePage(this.state.groupOfWords);
    this.shortTermStatistics.continueButton.classList.remove('hidden');
    this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);
  }

  async renderNewGameWithLearnedWords() {
    await this.vocabulary.addWordToTheVocabulary();
    this.guessedWords = [];
    this.skippedWords = [];
    this.switchOnTrainingMode();
    this.renderLearnedWords();
    this.shortTermStatistics.continueButton.classList.remove('hidden');
    this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);
  }

  static removeNavigationHTML() {
    const navigationHTML = document.querySelector('.navigation');
    if (navigationHTML) {
      navigationHTML.remove();
    }
  }

  activateStatisticsButtons() {
    document.querySelector('.speak-it-statistics__buttons').addEventListener('click', async (event) => {
      const target = event.target.closest('.new-game-button');

      if (target && this.state.currentWordsType === SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE) {
        await this.renderNewGameWithCollectionWords();
        SpeakIt.removeNavigationHTML();
        this.renderNavigation(true);
      }

      if (target && this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS_VALUE) {
        const words = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
        SpeakIt.removeNavigationHTML();

        if (words.length < WORDS_LIMIT_NUMBER) {
          await this.renderNewGameWithCollectionWords();
        } else {
          await this.renderNewGameWithLearnedWords();
        }
        this.renderNavigation(true);
      }
    });
  }

  activateRestartButton() {
    document.querySelector('.speak-it__main').addEventListener('click', (event) => {
      const target = event.target.closest('.speak-it__restart-button');

      if (target) {
        this.switchOnTrainingMode();
      }
    });
  }

  activateMicroButton() {
    document.querySelector('.speak-it__main').addEventListener('click', (event) => {
      const target = event.target.closest('.microphone-button');
      if (target) {
        this.state.isMicroDisabled = !this.state.isMicroDisabled;

        if (this.state.isMicroDisabled) {
          target.classList.add('microphone-button_disabled');
          target.querySelector('i').className = 'fas fa-microphone-slash';
        } else {
          target.classList.remove('microphone-button_disabled');
          target.querySelector('i').className = 'fas fa-microphone';
        }
      }
    });
  }
}
