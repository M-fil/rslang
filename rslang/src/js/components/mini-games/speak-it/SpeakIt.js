import create, {
  getWords,
  wordsToLearnSelectConstants,
  urls,
  speakItConstants,
  getRandomInteger,
  getAggregatedWordsByFilter,
  vocabularyConstants,
} from './pathes';

import WordCard from './components/words/WordCard';
import StartGamePage from './components/pages/StartGamePage';
import ImageBlock from './components/imageBlock/ImageBlock';
import Navigation from './components/navigation/Navigation';
import ButtonsBlock from './components/buttons/ButtonsBlock';
import MicrophoneButton from './components/buttons/MicrophoneButton';
import StatisticsBlock from './components/statistics/StatisticsBlock';
import WordsToLearnSelect from '../common/WordsToLearnSelect';
import Preloader from '../../preloader/Preloader';
import Settings from '../../settings/Settings';
import Vocabulary from '../../vocabulary/Vocabulary';

const {
  WORDS_IMAGES_URL,
  WORDS_AUDIOS_URL,
  DEAFAULT_SPEAKIT_WORD_IMAGE_URL,
  CORRECT_AUDIO_PATH,
  SUCCESS_AUDIO_PATH,
} = urls;

const {
  SELECT_OPTION_LEARNED_WORDS,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS,
} = wordsToLearnSelectConstants;

const {
  WORDS_LIMIT_NUMBER,
} = speakItConstants;

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

export default class SpeakIt {
  constructor(userState) {
    this.currentArrayOfWords = [];
    this.words = [];
    this.skippedWords = [];
    this.learnedWords = [];
    this.audio = new Audio();
    this.recognition = SpeakIt.createSpeechRecongnition();
    this.settings = new Settings(userState);
    this.vocabulary = new Vocabulary(userState);

    this.state = {
      currentWordsType: SELECT_OPTION_LEARNED_WORDS,
      gameStarted: false,
      currentPage: 0,
      groupOfWords: 0,
      correct: 0,
      isMicroDisabled: true,
      isNavSwitched: false,
      userState,
    };
  }

  run() {
    SpeakIt.renderStartGamePage();
    this.initMainGamePage();
  }

  static renderStartGamePage() {
    const main = create('div', 'speak-it__main', '', document.body);
    const startGamePage = new StartGamePage();
    create('div', 'main-container__wrapper', [startGamePage.render()], main);
  }

  playAudio(source) {
    if (this.audio.src === '' || this.audio.src !== source || this.audio.ended) {
      this.audio.src = source;
      this.audio.play();
    }
  }

  initMainGamePage() {
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');

    document.querySelector('.start-page__button-start').addEventListener('click', async () => {
      mainContainerWrapper.innerHTML = '';
      document.querySelector('.speak-it__main').classList.add('in-game');

      const microphone = new MicrophoneButton();
      mainContainerWrapper.append(microphone.render());
      mainContainerWrapper.append(create('div', 'score hidden'));
      mainContainerWrapper.append(create('div', 'overlay hidden'));
      this.preloader = new Preloader();
      this.preloader.render();
      this.preloader.show();

      await this.settings.init();
      await this.vocabulary.init();
      await this.renderWordsOnThePage();
      this.wordCardClickEvent();
      this.startGame();
      this.activateRestartButton();
      this.activateMicroButton();

      this.activateNavigation();
      this.activateStatisticsBlock();
      this.acitavateRecognition();
      this.activateSoundForStatisticsWords();
      this.activateSkipButtons();
      this.activateWordsToLearnSelect();

      this.recognition.addEventListener('end', this.recognition.start);
      this.recognition.start();
    });
  }

  renderNavigation() {
    const { currentWordsType } = this.state;
    this.wordToLearnSelect = new WordsToLearnSelect('speak-it');
    this.navigation = new Navigation();

    create(
      'div', 'navigation',
      [this.wordToLearnSelect.render(), this.navigation.render()],
      document.querySelector('.main-container__wrapper'),
    );

    if (currentWordsType === SELECT_OPTION_LEARNED_WORDS) {
      this.navigation.hide();
    }
  }

  async getColectionWords() {
    this.state.currentPage = getRandomInteger();
    this.state.groupOfWords = 0;
    this.words = await getWords(this.state.currentPage, this.state.groupOfWords);
    this.words = this.words.slice(0, WORDS_LIMIT_NUMBER);
  }

  renderWords() {
    const gamePageHTML = document.querySelector('.game-page');
    const container = create('div', 'game-page');
    const wordsContainer = create('div', 'game-page__words', '', container);

    if (gamePageHTML) {
      gamePageHTML.remove();
    }
    this.imageBlock = new ImageBlock();
    container.prepend(this.imageBlock.render());

    this.currentArrayOfWords.forEach((word) => {
      if (word.optional) {
        const { transcription } = word.optional.allData;
        this.wordCard = new WordCard(word.wordId, word.optional.word, transcription);
      } else {
        this.wordCard = new WordCard(word.id || word._id, word.word, word.transcription);
      }
      wordsContainer.append(this.wordCard.render());
    });

    document.querySelector('.navigation').after(container);
  }

  async renderWordsOnThePage() {
    const wordsType = localStorage.getItem('speak-it-words-type');
    this.saveCurrentWordsType(wordsType);
    this.preloader.show();
    switch (wordsType) {
      case SELECT_OPTION_LEARNED_WORDS:
      default: {
        this.renderNavigation();
        this.renderLearnedWords();
        this.wordToLearnSelect.selectIndexByValue(SELECT_OPTION_LEARNED_WORDS);
        break;
      }
      case SELECT_OPTION_WORDS_FROM_COLLECTIONS: {
        await this.getColectionWords();
        this.currentArrayOfWords = this.words;
        this.renderNavigation();
        this.wordToLearnSelect.selectIndexByValue(SELECT_OPTION_WORDS_FROM_COLLECTIONS);
        this.renderSpeacifiedWordsType();
        break;
      }
    }
    console.log('this.currentArrayOfWords', this.currentArrayOfWords);
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    mainContainerWrapper.append(new ButtonsBlock().render());
    this.preloader.hide();
  }

  renderSpeacifiedWordsType() {
    this.renderWords();
    const statistics = new StatisticsBlock(this.currentArrayOfWords);
    document.body.append(statistics.render());

    const currentNavItem = document.querySelector(`[data-nav-number="${this.state.groupOfWords + 1}"]`);
    SpeakIt.selectSingleElementFromList(currentNavItem, 'navigation__item_selected');

    document.querySelector('.microphone-button').classList.remove('hidden');
  }

  renderLearnedWords() {
    this.learnedWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
    this.currentArrayOfWords = this.learnedWords;
    this.renderWords(this.learnedWords);
    const statistics = new StatisticsBlock(this.currentArrayOfWords);
    document.body.append(statistics.render());
  }

  wordCardClickEvent() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word-card');

      if (target && !this.state.gameStarted) {
        SpeakIt.selectSingleElementFromList(target, 'word-card_selected');
        const clickedWord = this.currentArrayOfWords
          .find((word) => (word.wordId || word.id || word._id) === target.dataset.wordId);
        const { wordTranslate, audio, image } = clickedWord.optional.allData;
        const translation = clickedWord.wordTranslate || wordTranslate;
        this.playAudio(`${WORDS_AUDIOS_URL}${audio || clickedWord.audio}`);

        let currentImage = DEAFAULT_SPEAKIT_WORD_IMAGE_URL;

        currentImage = `${WORDS_IMAGES_URL}${image || clickedWord.image}`;
        this.imageBlock.update(currentImage, translation);
      }
    });
  }

  activateWordsToLearnSelect() {
    const select = document.querySelector('.speak-it__learn-words-select');
    const defaultSelectValue = select.options[select.options.selectedIndex].value;

    if (defaultSelectValue === SELECT_OPTION_LEARNED_WORDS && this.navigation) {
      this.navigation.hide();
    }

    select.addEventListener('change', async (event) => {
      const { options, selectedIndex } = event.target;
      const selectedValue = options[selectedIndex].value;

      this.preloader.show();
      this.saveCurrentWordsType(selectedValue);
      switch (selectedValue) {
        case SELECT_OPTION_LEARNED_WORDS:
        default: {
          await this.renderLearnedWords();
          this.navigation.hide();
          break;
        }
        case SELECT_OPTION_WORDS_FROM_COLLECTIONS: {
          await this.getColectionWords();
          this.currentArrayOfWords = this.words;
          this.renderSpeacifiedWordsType();
          this.navigation.show();
          break;
        }
      }
      this.preloader.hide();
    });
  }

  saveCurrentWordsType(selectedValue) {
    this.state.currentWordsType = selectedValue;
    localStorage.setItem('speak-it-words-type', this.state.currentWordsType);
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
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('.word-card__skip-word-button');

      if (target) {
        const wordCardHTML = target.closest('.word-card');
        const wordId = Number(wordCardHTML.dataset.wordId);
        wordCardHTML.classList.add('word-card_skipped');

        const wordObject = this.currentArrayOfWords.find((word) => word.id === wordId);
        this.skippedWords.push(wordObject);
        this.checkIsGameEnded();
        await this.vocabulary.addWordToTheVocabulary(wordObject, WORDS_TO_LEARN_TITLE);
        console.log('WORDS_TO_LEARN_TITLE', this.vocabulary.getWordsByVocabularyType(WORDS_TO_LEARN_TITLE));
      }
    });
  }

  startGame() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.start-game-button');
      if (!this.state.gameStarted && target) {
        const wordCardsHTML = document.querySelectorAll('.word-card');
        const wordsToLearnSelectHTML = document.querySelector('.speak-it__learn-words-select');
        this.state.gameStarted = true;
        wordsToLearnSelectHTML.setAttribute('disabled', 'disabled');
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
      const item = (word.word && word.word.toLowerCase())
       || word.optional.word.toLowerCase();
      return item;
    });
    console.log('this.listOfWords', listOfWords);

    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const recognitionList = new SpeechGrammarList();
    const grammar = `#JSGF V1.0; grammar words; public <words> = ${listOfWords.join(' | ')} ;`;
    recognitionList.addFromString(grammar, 1);
    this.recognition.grammars = recognitionList;
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', (event) => {
      if (!this.state.gameStarted) return;
      if (this.state.isMicroDisabled) return;

      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      const resultHTML = document.querySelector('.word-info__speech-recognition span');
      const wordInfoHTML = document.querySelector('.game-page__word-info');
      const scoreHTML = document.querySelector('.score');

      const pronouncedWords = transcript.trim().toLowerCase().split(' ');
      const guessedWord = this.currentArrayOfWords.find((word) => pronouncedWords.includes(word.word));
      const currentWordHTML = document.querySelector(`[data-word="${(guessedWord && guessedWord.word) || ''}"]`);
      if (resultHTML) {
        resultHTML.textContent = transcript;
      }

      if (
        guessedWord && currentWordHTML
        && !currentWordHTML.classList.contains('word-card_guessed')
        && !currentWordHTML.classList.contains('word-card_skipped')
      ) {
        currentWordHTML.classList.add('word-card_guessed');
        this.playAudio(CORRECT_AUDIO_PATH);
        wordInfoHTML.remove();
        const currentImage = `${WORDS_IMAGES_URL}${guessedWord.image}`;
        const imageBlock = new ImageBlock(currentImage, guessedWord.word, '', false);
        document.querySelector('.game-page').prepend(imageBlock.render());
        resultHTML.textContent = guessedWord.word;

        scoreHTML.textContent = `+${this.state.correct += 1}`;
        scoreHTML.classList.remove('hidden');
        SpeakIt.updateStatistics(guessedWord.word);
        this.checkIsGameEnded();
      }
    });
  }

  checkIsGameEnded() {
    const statisticsHTML = document.querySelector('.statistics');
    const overlayHTML = document.querySelector('.overlay');
    const numberOfCorrectWords = this.currentArrayOfWords.length - this.skippedWords.length;

    if (this.state.correct === numberOfCorrectWords) {
      setTimeout(() => {
        this.playAudio(SUCCESS_AUDIO_PATH);
        statisticsHTML.classList.remove('hidden');
        overlayHTML.classList.remove('hidden');
        this.activateStatisticsButtons();
      }, 1500);
    }
  }

  static updateStatistics(target) {
    const correctContainer = document.querySelector('.statistics__correct');
    const mistakesContainer = document.querySelector('.statistics__mistakes');

    const wordElement = document.querySelector(`[data-score-word="${target}"]`);

    if (mistakesContainer.contains(wordElement)) {
      const word = mistakesContainer.removeChild(wordElement);
      correctContainer.append(word);
    }
  }

  activateNavigation() {
    const navigationHTML = document.querySelector('.navigation');

    navigationHTML.addEventListener('click', (event) => {
      if (event.target.classList.contains('navigation__item')) {
        this.state.isNavSwitched = true;
        this.state.groupOfWords = event.target.dataset.navNumber;
        this.switchOnTrainingMode();

        const statisticsBlock = document.querySelector('.statistics');
        if (statisticsBlock) statisticsBlock.remove();

        SpeakIt.selectSingleElementFromList(event.target, 'navigation__item_selected');
        const randomPage = getRandomInteger();
        console.log('randomPage', randomPage);
        this.renderMainGamePage(this.state.groupOfWords - 1, randomPage);
      }
    });
  }

  async renderMainGamePage(groupNumber, pageNumber) {
    this.preloader.show();
    this.state.groupOfWords = groupNumber;
    this.state.currentPage = pageNumber;
    const wordsData = await getWords(pageNumber, groupNumber);
    this.currentArrayOfWords = wordsData.slice(0, WORDS_LIMIT_NUMBER);
    document.querySelector('.game-page').remove();
    this.renderWords();
    const statistics = new StatisticsBlock(this.currentArrayOfWords);
    document.body.append(statistics.render());
    this.activateStatisticsBlock();
    this.acitavateRecognition();
    this.preloader.hide();
  }

  switchOnTrainingMode() {
    document.querySelector('.speak-it__learn-words-select').removeAttribute('disabled');
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
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.result-button');

      if (target) {
        document.querySelector('.statistics').classList.remove('hidden');
        document.querySelector('.overlay').classList.remove('hidden');
        this.activateStatisticsButtons();
      }
    });
  }

  activateStatisticsButtons() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.back-button');
      if (target) {
        document.querySelector('.statistics').classList.add('hidden');
        document.querySelector('.overlay').classList.add('hidden');
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.new-game-button');
      if (target) {
        const overlayHTML = document.querySelector('.overlay');
        const statisticsHTML = document.querySelector('.statistics');

        overlayHTML.classList.add('hidden');
        document.body.style.overflow = 'auto';

        this.switchOnTrainingMode();
        SpeakIt.selectSingleElementFromList(document.querySelector('[data-nav-number="1"]'), 'navigation__item_selected');
        this.renderMainGamePage(this.state.groupOfWords);
        if (statisticsHTML) {
          statisticsHTML.remove();
        }
      }
    });
  }

  activateSoundForStatisticsWords() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.statistics__word');
      if (target) {
        const wordObject = this.currentArrayOfWords.find((word) => word.word === target.dataset.scoreWord);
        this.playAudio(`${WORDS_AUDIOS_URL}${wordObject.audio}`);
      }
    });
  }

  activateRestartButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.restart-button');

      if (target) {
        this.switchOnTrainingMode();
      }
    });
  }

  activateMicroButton() {
    document.addEventListener('click', (event) => {
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
