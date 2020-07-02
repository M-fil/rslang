import create, {
  getWords,
  wordsToLearnSelectConstants,
  urls,
  speakItConstants,
  getRandomInteger,
  vocabularyConstants,
  playAudio,
} from './pathes';

import WordCard from './components/words/WordCard';
import ImageBlock from './components/imageBlock/ImageBlock';
import Navigation from './components/navigation/Navigation';
import ButtonsBlock from './components/buttons/ButtonsBlock';
import MicrophoneButton from './components/buttons/MicrophoneButton';
import Preloader from '../../preloader/Preloader';
import Settings from '../../settings/Settings';
import Vocabulary from '../../vocabulary/Vocabulary';
import StatisticsBlock from './components/statistics/StatisticsBlock';
import Statistics from '../../statistics/Statistics';

import ModalWindow from '../common/ModalWindow';
import StartPage from './components/pages/StartPage';

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
  SPEAKIT_TITLE,
} = wordsToLearnSelectConstants;

const {
  WORDS_LIMIT_NUMBER,
  START_PAGE_BUTTON_TEXT,
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
    this.guessedWords = [];
    this.learnedWords = [];
    this.iDontKnowWords = [];
    this.audio = new Audio();
    this.recognition = SpeakIt.createSpeechRecongnition();

    this.startWindow = new StartPage();
    this.settings = new Settings(userState);
    console.log(userState)
    this.vocabulary = new Vocabulary(userState);
    this.statistics = new Statistics(userState);
    this.modalWindow = new ModalWindow('speak-it__modal');
    this.preloader = new Preloader();
    this.shortTermStatistics = new StatisticsBlock();

    this.state = {
      currentWordsType: SELECT_OPTION_LEARNED_WORDS,
      gameStarted: false,
      currentPage: 0,
      groupOfWords: 0,
      correct: 0,
      isMicroDisabled: true,
      userState,
    };
  }

  async run() {
    await this.renderStartGamePage();
  }

  async renderStartGamePage() {
    const startWindowHTML = this.startWindow.render(
      SPEAKIT_TITLE, this.startWindow.renderExplanations(), this.initMainGamePage,
    );
    document.body.append(startWindowHTML, this.startWindow.closeButton.show());
    this.preloader.render();
    await this.activateWordsToLearnSelect();
  }

  activateExitButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.speak-it__exit-button');

      if (target) {
        this.modalWindow.show();
      }
    });
  }

  static createMainContainerWrapper() {
    const wrapper = create('div', 'main-container__wrapper');
    create('div', 'speak-it__main', wrapper, document.body);
  }

  async initMainGamePage() {
    SpeakIt.createMainContainerWrapper();
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    this.startWindow.container.remove();
    mainContainerWrapper.innerHTML = '';
    document.querySelector('.speak-it__main').classList.add('in-game');

    const microphone = new MicrophoneButton();
    mainContainerWrapper.append(microphone.render());
    mainContainerWrapper.append(create('div', 'score hidden'));
    mainContainerWrapper.append(create('div', 'overlay hidden'));
    this.preloader.show();

    await this.statistics.init();
    await this.settings.init();
    await this.renderWordsOnThePage();
    this.wordCardClickEvent();
    this.startGame();
    this.activateExitButton();
    this.activateContinueButton();
    this.activateRestartButton();
    this.activateMicroButton();

    this.activateNavigation();
    this.activateStatisticsBlock();
    this.acitavateRecognition();
    this.activateSoundForStatisticsWords();
    this.activateSkipButtons();
    this.activateStatisticsButtons();

    this.recognition.addEventListener('end', this.recognition.start);
    this.recognition.start();
  }

  renderNavigation() {
    this.navigation = new Navigation();
    create(
      'div', 'navigation',
      this.navigation.render(),
      document.querySelector('.main-container__wrapper'),
    );

    console.log('this.currentWordsType', this.state.currentWordsType);
    if (this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS) {
      console.log('hide')
      this.navigation.hide();
    } else {
      console.log('show')
      this.navigation.show(); 
    }
  }

  async getColectionWords() {
    this.state.currentPage = getRandomInteger();
    this.state.groupOfWords = 0;
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

    console.log('ToRender', this.currentArrayOfWords);
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
    this.preloader.show();
    const learnedWordsLength = this.vocabulary.getVocabularyWordsLength(LEARNED_WORDS_TITLE);

    if ((this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS) && (learnedWordsLength > WORDS_LIMIT_NUMBER)) {
      this.renderNavigation();
      this.renderLearnedWords();
    } else {
      await this.getColectionWords();
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

    if (this.learnedWords.length < WORDS_LIMIT_NUMBER) {
      // ToDo
      this.removeGamePage();
    } else {
      console.log('renderLearnedWords else')
      this.currentArrayOfWords = this.learnedWords.map((word) => word.optional.allData);
      this.currentArrayOfWords = this.currentArrayOfWords.slice(0, WORDS_LIMIT_NUMBER);
      this.iDontKnowWords = this.currentArrayOfWords;
      console.log(this.currentArrayOfWords);
      this.renderWords();
      this.shortTermStatistics.render(this.iDontKnowWords, []);
      this.shortTermStatistics.hide();
      if (!buttonsHTML) {
        mainContainerWrapper.append(new ButtonsBlock().render());
      }
    }
  }

  wordCardClickEvent() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word-card');

      if (target && !this.state.gameStarted) {
        SpeakIt.selectSingleElementFromList(target, 'word-card_selected');
        const clickedWord = this.currentArrayOfWords
          .find((word) => (word.id || word._id) === target.dataset.wordId);

        const translation = clickedWord.wordTranslate;
        playAudio(`${WORDS_AUDIOS_URL}${clickedWord.audio}`, this.audio);

        let currentImage = DEAFAULT_SPEAKIT_WORD_IMAGE_URL;
        currentImage = `${WORDS_IMAGES_URL}${clickedWord.image}`;
        this.imageBlock.update(currentImage, translation);
      }
    });
  }

  toggleLearnedWordsOption(isToEnable = true) {
    const { options } = this.startWindow.wordsToLearnSelect.select;

    if (isToEnable) {
      Array.from(options)
        .find((option) => option.value === SELECT_OPTION_LEARNED_WORDS)
        .removeAttribute('disabled');
    } else {
      Array.from(options)
        .find((option) => option.value === SELECT_OPTION_LEARNED_WORDS)
        .setAttribute('disabled', 'disabled');
    }
  }

  async selectWordsToLearn() {
    await this.vocabulary.init();
    console.log(this.vocabulary.getAllUserWordsLength());
    this.learnedWords = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);

    if (this.learnedWords.length < WORDS_LIMIT_NUMBER) {
      this.state.currentWordsType = SELECT_OPTION_WORDS_FROM_COLLECTIONS;
      console.log('this.startWindow.wordsToLearnSelect', this.startWindow)
      this.startWindow.wordsToLearnSelect.selectIndexByValue(SELECT_OPTION_WORDS_FROM_COLLECTIONS);
      this.toggleLearnedWordsOption(false);
      await this.selectCollectionWords();
    } else {
      this.state.currentWordsType = SELECT_OPTION_LEARNED_WORDS;
      this.toggleLearnedWordsOption();
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

    document.addEventListener('change', async (event) => {
      const target = event.target.closest('.select__item');

      if (target) {
        const { options, selectedIndex } = event.target;
        const selectedValue = options[selectedIndex].value;
  
        this.preloader.show();
        switch (selectedValue) {
          case SELECT_OPTION_LEARNED_WORDS:
          default: {
            await this.selectWordsToLearn();
            this.state.currentWordsType = SELECT_OPTION_LEARNED_WORDS;
            break;
          }
          case SELECT_OPTION_WORDS_FROM_COLLECTIONS: {
            await this.selectCollectionWords();
            this.state.currentWordsType = SELECT_OPTION_WORDS_FROM_COLLECTIONS;
            break;
          }
        }
        console.log('currentArrayOfWords', this.currentArrayOfWords);
        this.preloader.hide();
      }
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
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('.word-card__skip-word-button');

      if (target) {
        const wordCardHTML = target.closest('.word-card');
        const { wordId } = wordCardHTML.dataset;
        wordCardHTML.classList.add('word-card_skipped');

        const wordObject = this.currentArrayOfWords.find((word) => (word.id || word._id) === wordId);
        this.skippedWords.push(wordObject);
        await this.checkIsGameEnded();
        await this.vocabulary.addWordToTheVocabulary(wordObject, WORDS_TO_LEARN_TITLE);
      }
    });
  }

  startGame() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.start-game-button');
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

    this.recognition.addEventListener('result', async (event) => {
      if (!this.state.gameStarted) return;
      if (this.state.isMicroDisabled) return;

      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);

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
        playAudio(CORRECT_AUDIO_PATH, this.audio);
        wordInfoHTML.remove();
        const currentImage = `${WORDS_IMAGES_URL}${guessedWordObject.image}`;
        const imageBlock = new ImageBlock(currentImage, guessedWord, '', false);
        document.querySelector('.game-page').prepend(imageBlock.render());
        resultHTML.textContent = guessedWord;

        scoreHTML.textContent = `+${this.state.correct += 1}`;
        scoreHTML.classList.remove('hidden');
        this.guessedWords.push(guessedWordObject);
        this.iDontKnowWords = this.iDontKnowWords.filter((word) => (word.id || word._id) !== guessedWordObject.id);
        this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);

        await this.checkIsGameEnded();
      }
    });
  }

  activateContinueButton() {
    document.addEventListener('click', (event) => {
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
        playAudio(SUCCESS_AUDIO_PATH, this.audio);
        this.shortTermStatistics.update(this.skippedWords, this.guessedWords);
        console.log('this.iDontKnowWords', this.iDontKnowWords);
        this.shortTermStatistics.show();
        this.shortTermStatistics.modalClose.removeAttribute('disabled');
        this.shortTermStatistics.continueButton.classList.add('hidden');
      }, 1000);
      await this.statistics.saveGameStatistics(
        'speakit', this.guessedWords.length, this.skippedWords.length,
      );
    }
  }

  activateNavigation() {
    document.addEventListener('change', (event) => {
      const target = event.target.closest('.navigation__group-select');

      if (target) {
        const options = target.options;
        this.state.groupOfWords = Number(options[target.selectedIndex].value);
        this.switchOnTrainingMode();
        this.renderMainGamePage(this.state.groupOfWords);
        this.shortTermStatistics.hide();
      }
    });
  }

  async renderMainGamePage(groupNumber) {
    const randomPage = getRandomInteger();
    this.preloader.show();
    this.state.groupOfWords = groupNumber;
    this.state.currentPage = randomPage;
    const wordsData = await getWords(this.state.currentPage, groupNumber);
    this.currentArrayOfWords = wordsData.slice(0, WORDS_LIMIT_NUMBER);
    this.iDontKnowWords = this.currentArrayOfWords;
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
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.result-button');

      if (target) {
        this.shortTermStatistics.show();
      }
    });
  }

  activateStatisticsButtons() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.new-game-button');
      if (target && this.state.currentWordsType === SELECT_OPTION_WORDS_FROM_COLLECTIONS) {
        this.shortTermStatistics.hide();

        this.guessedWords = [];
        this.skippedWords = [];
        this.switchOnTrainingMode();
        this.renderMainGamePage(this.state.groupOfWords);
        this.shortTermStatistics.continueButton.classList.remove('hidden');
        this.shortTermStatistics.update(this.iDontKnowWords, this.guessedWords);
      }

      if (target && this.state.currentWordsType === SELECT_OPTION_LEARNED_WORDS) {
        const words = this.vocabulary.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
        console.log('words', words);
        // HERE
      }
    });
  }

  activateSoundForStatisticsWords() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.statistics__word');
      if (target) {
        const wordObject = this.currentArrayOfWords.find((word) => word.word === target.dataset.scoreWord);
        playAudio(`${WORDS_AUDIOS_URL}${wordObject.audio}`, this.audio);
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
