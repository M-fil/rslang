import {
  getAllUserWords,
  getAggregatedWordsByFilter,
  updateStatistics,
  getStatistics,
} from '../../service/service';
import create from '../../utils/сreate';
import {
  urls,
  mainGameConstants,
  wordsToLearnOptions,
  estimateButtonsTypes,
  vocabularyConstants,
} from '../../constants/constants';
import {
  checkIsManyMistakes,
  addDaysToTheDate,
  calculatePercentage,
} from '../../utils/calculations';

import {
  addWordToTheVocabulary,
} from '../../utils/words-functions';

import WordCard from './components/word-card/WordCard';
import SettingsControls from './components/settings-controls/SettingsControls';
import EstimateButtonsBlock from './components/estimate-buttons/EstimateButtonsBlock';
import WordsSelectList from './components/words-select-list/WordsSelectList';
import ProgressBar from './components/progress-bar/ProgressBar';
import Preloader from '../preloader/Preloader';
import FormControll from './components/form-control/FormControl';
import Authentication from '../authentication/Authentication';
import DailyStatistics from './components/daily-statistics/DailyStatistics';

const {
  REMOVE_WORD_BUTTON,
  ADD_TO_DIFFICULT_WORDS,
  EMPTY_WORD_LIST,
  DAILY_NORM_IS_COMPLETED,
  ADD_TO_DIFFICULT_WORDS_CLICKED,
  REMOVE_WORD_BUTTON_CLICKED,
} = mainGameConstants;

const {
  MIXED,
  ONLY_NEW_WORDS,
  ONLY_WORDS_TO_REPEAT,
  ONLY_DIFFICULT_WORDS,
} = wordsToLearnOptions;

const {
  AGAIN, HARD, GOOD, EASY,
} = estimateButtonsTypes;

const {
  WORDS_AUDIOS_URL,
} = urls;

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
  REMOVED_WORDS_TITLE,
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

class MainGame {
  constructor(userState) {
    this.state = {
      currentWordIndex: 0,
      mistakesInCurrentWord: 0,
      allNumberOfMistakes: 0,
      learnedWordsToday: 0,
      longestSeriesOfAnswers: 0,
      longestSeriesIndicator: 0,
      correctAnswersNumber: 0,
      currentWordsType: MIXED,
      isNormCompleted: false,
      lastGameWinDate: null,
      userWords: [],
      wordsToLearn: [],
      currentWordsArray: [],
      newWords: [],
      audio: new Audio(),
      audios: [],
      isAudioEnded: true,
      difficultWordsState: {
        learnedWordsNumber: 0,
      },
      gameSetting: {
        isAudioPlaybackEnabled: true,
        isTranslationsEnabled: true,
      },
      userState,
      settings: {
        newWordsPerDay: 3,
        wordsPerDay: 3,
      },
    };
  }

  async render(elementQuery) {
    const { currentWordIndex } = this.state;

    const mainGameHTML = create('div', 'main-game');
    document.querySelector(elementQuery).append(mainGameHTML);
    this.preloader = new Preloader();

    try {
      this.preloader.render();
      this.preloader.show();

      await this.resetStatisticsIfNewDay();
      await this.getStatisticsData();
      this.state.userWords = await this.getAllUserWordsFromBackend();
      this.state.userWords = this.parseUserWordsData();
      console.log(this.state.userWords);

      console.log('this.state.learnedWordsToday', this.state.learnedWordsToday);
      if (!this.state.isNormCompleted) {
        await this.setNewWords();
        this.state.wordsToLearn = await this.selectWordsToLearn();
        this.state.currentWordsArray = this.state.wordsToLearn;
        this.setAudiosForWords(this.state.currentWordsArray[currentWordIndex]);

        const { learnedWordsToday } = this.state;
        const { wordsPerDay } = this.state.settings;
        const currentWord = this.state.currentWordsArray[currentWordIndex].word;

        const wordCard = MainGame.createWordCard(this.state.currentWordsArray[currentWordIndex]);
        const mainGameControls = MainGame.renderMainGameControls();
        this.formControl = new FormControll(currentWord);
        this.progressBar = new ProgressBar(learnedWordsToday, wordsPerDay);
        const mainGameMainContainer = create(
          'div', 'main-game__main-container', [wordCard.render(), this.formControl.render()],
        );

        mainGameHTML.append(
          mainGameControls,
          mainGameMainContainer,
          this.progressBar.render(),
        );

        const wordCardInput = document.querySelector('.word-card__input');
        wordCardInput.focus();
        this.activateGameSettingsEvents();
        this.activateNextButton();
        this.activateShowAnswerButton();
        MainGame.activateInputWordsHandler();
        this.activateVocabularyButtons();
        this.activateWordsToLearnSelect();
        this.activateEstimateButtons();
        MainGame.toggleVocabularyButtons(false);
        this.preloader.hide();
      } else {
        const { learnedWordsToday } = this.state;
        console.log('learnedWordsToday', learnedWordsToday);
        const { wordsPerDay } = this.state.settings;
        const mainGameMainContainer = create('div', 'main-game__main-container');
        const mainGameControls = MainGame.renderMainGameControls();
        this.progressBar = new ProgressBar(learnedWordsToday, wordsPerDay);
        const message = MainGame.showMessage(DAILY_NORM_IS_COMPLETED);
        mainGameMainContainer.append(message);
        mainGameHTML.append(
          mainGameControls,
          mainGameMainContainer,
          this.progressBar.render(),
        );
        this.activateWordsToLearnSelect();
        MainGame.toggleVocabularyButtons(false);
      }
    } catch (error) {
      Authentication.createErrorBlock(error.message);
      this.preloader.hide();
    }
  }

  parseUserWordsData() {
    return this.state.userWords.map((item) => ({
      ...item,
      optional: {
        ...item.optional,
        valuationDate: new Date(item.optional.valuationDate),
        daysInterval: parseInt(item.optional.daysInterval, 10),
        allData: JSON.parse(item.optional.allData),
      },
    }));
  }

  getWordsToRevise() {
    const currentTime = new Date();
    const { userWords } = this.state;
    const wordsToRevise = userWords.filter((word) => {
      const { valuationDate, daysInterval } = word.optional;
      const elapsedTime = addDaysToTheDate(daysInterval);
      const isNeedToRevise = elapsedTime < currentTime;
      return isNeedToRevise && valuationDate && daysInterval;
    });

    return wordsToRevise;
  }

  async getStatisticsData() {
    try {
      const { userId, token } = this.getUserDataForAuthorization();
      const statistics = await getStatistics(userId, token);
      console.log('statistics', statistics);
      const {
        learnedWordsToday,
        correctAnswersNumber,
        isNormCompleted,
      } = JSON.parse(statistics.optional.mainGame);
      this.state.learnedWordsToday = parseInt(learnedWordsToday, 10);
      this.state.correctAnswersNumber = parseInt(correctAnswersNumber, 10);
      this.state.isNormCompleted = JSON.parse(isNormCompleted);
    } catch (error) {
      this.state.correctAnswersNumber = 0;
    }
  }

  async setStatisticsData() {
    const { userId, token } = this.getUserDataForAuthorization();
    const mainGame = JSON.stringify({
      learnedWordsToday: this.state.learnedWordsToday,
      correctAnswersNumber: this.state.correctAnswersNumber,
      lastGameWinDate: this.state.lastGameWinDate,
      isNormCompleted: this.state.isNormCompleted,
    });
    const body = {
      learnedWords: 0,
      optional: {
        mainGame,
      },
    };
    await updateStatistics(userId, token, body);
  }

  async resetStatistics() {
    this.state.isNormCompleted = true;
    this.state.lastGameWinDate = null;
    this.state.correctAnswersNumber = 0;
    this.state.learnedWordsToday = 0;

    await this.setStatisticsData();
  }

  async resetStatisticsIfNewDay() {
    try {
      const { userId, token } = this.getUserDataForAuthorization();
      const statistics = await getStatistics(userId, token);
      const data = JSON.parse(statistics.optional.mainGame);
      let date = new Date(data.lastGameWinDate).setHours(0, 0, 0);
      const currentDate = new Date();
      date = addDaysToTheDate(1, new Date(date));

      if ((currentDate > new Date(date)) && data.lastGameWinDate) {
        await this.resetStatistics();
      }
    } catch (error) {
      this.state.isNormCompleted = false;
      await this.setStatisticsData();
    }
  }

  async setNewWords() {
    const wordsToRevise = this.getWordsToRevise();
    const { userId, token } = this.getUserDataForAuthorization();
    const { newWordsPerDay, wordsPerDay } = this.state.settings;
    const { learnedWordsToday } = this.state;

    const wordsToGet = wordsToRevise.length ? newWordsPerDay : wordsPerDay;
    const newWords = await getAggregatedWordsByFilter(userId, token, wordsToGet);
    const newWordLength = wordsToRevise.length
      ? newWordsPerDay - learnedWordsToday
      : wordsToGet - learnedWordsToday;

    this.state.newWords = newWords[0].paginatedResults
      .slice(0, newWordLength);
    console.log('this.state.newWords', this.state.newWords);
  }

  async selectWordsToLearn() {
    const wordsToRevise = this.getWordsToRevise();
    const { wordsPerDay, newWordsPerDay } = this.state.settings;
    const wordsToReviseLength = wordsPerDay - newWordsPerDay;

    return [...this.state.newWords, ...wordsToRevise.slice(0, wordsToReviseLength)];
  }

  async getAllUserWordsFromBackend() {
    const { userId, token } = this.getUserDataForAuthorization();
    const data = await getAllUserWords(userId, token);
    console.log(data);
    return data;
  }

  selectUserWordsByType(wordsType) {
    return this.state.userWords
      .filter((word) => word.optional.vocabulary === wordsType)
      .map((word) => (word.optional ? word.optional.allData : word));
  }

  getUserDataForAuthorization() {
    const savedUserData = localStorage.getItem('user-data');
    if (savedUserData) {
      return JSON.parse(savedUserData);
    }

    return {
      userId: this.userState.id,
      token: this.userState.token,
    };
  }

  static renderMainGameControls() {
    const container = create('div', 'main-game__controls');
    const gameSettingsBlock = new SettingsControls();
    const vocabularyButtons = MainGame.renderVocabularyButtons();
    const wordsSelectList = new WordsSelectList();
    container.append(
      gameSettingsBlock.render(),
      vocabularyButtons,
      wordsSelectList.render(),
    );

    return container;
  }

  renderDailyStatistics() {
    const { wordsPerDay } = this.state.settings;
    const {
      newWords, longestSeriesOfAnswers, correctAnswersNumber, currentWordsArray,
    } = this.state;

    if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
      const { learnedWordsNumber } = this.state.difficultWordsState;
      const percentOfCorrectAnswers = calculatePercentage(learnedWordsNumber, currentWordsArray.length);
      this.dailyStatistics = new DailyStatistics(
        currentWordsArray.length, percentOfCorrectAnswers, null, longestSeriesOfAnswers,
      );
    } else {
      const percentOfCorrectAnswers = calculatePercentage(correctAnswersNumber, wordsPerDay);
      this.dailyStatistics = new DailyStatistics(
        wordsPerDay, percentOfCorrectAnswers, newWords.length, longestSeriesOfAnswers,
      );
    }

    this.activateDailyStatisticsButton();
    return this.dailyStatistics.render();
  }

  renderWordCard(currentWordCard) {
    const wordCard = MainGame.createWordCard(currentWordCard);
    this.setAudiosForWords(currentWordCard);
    document.querySelector('.main-game__main-container').prepend(wordCard.render());

    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.formControl.updateInputWidth(currentWordCard.word);
    this.toggleWordCardTranslation();
  }

  static renderVocabularyButtons() {
    const removeWordButton = FormControll.renderButton('remove-word', REMOVE_WORD_BUTTON);
    const addToDifficultButton = FormControll.renderButton('add-to-difficult', ADD_TO_DIFFICULT_WORDS);
    const container = create('div', 'word-card__vocabulary-buttons', [removeWordButton, addToDifficultButton]);

    return container;
  }

  activateDailyStatisticsButton() {
    document.addEventListener('click', (event) => {
      if (event.target.closest('.daily-statistics__button')) {
        if (this.dailyStatistics) {
          this.dailyStatistics.removeFromDOM();
        }
      }
    });
  }

  activateWordsToLearnSelect() {
    const selectHTML = document.querySelector('.main-game__words-type-select');
    selectHTML.addEventListener('change', async (event) => {
      const { options } = event.target;
      const { isNormCompleted } = this.state;
      const { wordsPerDay } = this.state.settings;
      const selectedOptionValue = options[options.selectedIndex].value;
      let selectedArrayType = [];
      let numberOfWords = wordsPerDay;
      let completedWordsNumber = this.state.learnedWordsToday;
      switch (true) {
        case selectedOptionValue === MIXED && !isNormCompleted:
        default: {
          selectedArrayType = await this.selectWordsToLearn();
          break;
        }
        case selectedOptionValue === ONLY_NEW_WORDS && !isNormCompleted: {
          await this.setNewWords();
          selectedArrayType = this.state.newWords;
          break;
        }
        case selectedOptionValue === ONLY_WORDS_TO_REPEAT && !isNormCompleted: {
          console.log('HRERE');
          this.state.userWords = await this.getAllUserWordsFromBackend();
          console.log(this.state.userWords, 'this.state.userWords');
          selectedArrayType = this.getWordsToRevise();
          console.log('selectedArrayType', selectedArrayType);
          break;
        }
        case selectedOptionValue === ONLY_DIFFICULT_WORDS: {
          this.state.userWords = await this.getAllUserWordsFromBackend();
          this.state.userWords = this.parseUserWordsData();
          const { learnedWordsNumber } = this.state.difficultWordsState;
          selectedArrayType = this.selectUserWordsByType(DIFFUCULT_WORDS_TITLE);
          numberOfWords = selectedArrayType.length;
          completedWordsNumber = learnedWordsNumber;
          break;
        }
      }

      this.state.currentWordsType = selectedOptionValue;
      this.state.currentWordsArray = selectedArrayType;
      console.log('this.state.currentWordsArray', this.state.currentWordsArray);
      const wordCardHTML = document.querySelector('.main-game__word-card');
      const mainGameContainer = document.querySelector('.main-game__main-container');
      const mainGameMessage = document.querySelector('.main-game__message');

      if (!wordCardHTML) {
        if (this.state.currentWordsArray.length) {
          let { currentWordIndex } = this.state;
          currentWordIndex = currentWordIndex < 0 ? 0 : currentWordIndex;
          const currentWordObject = this.state.currentWordsArray[currentWordIndex];
          const currentWord = (currentWordObject && currentWordObject.word) || currentWordObject.optional.word;
          const wordCard = MainGame.createWordCard(this.state.currentWordsArray[currentWordIndex]);
          this.formControl = new FormControll(currentWord);

          mainGameContainer.append(wordCard.render(), this.formControl.render());
          MainGame.activateInputWordsHandler();
          this.activateNextButton();
          this.activateEstimateButtons();
          mainGameMessage.remove();
        }
      }

      this.state.currentWordIndex = -1;
      this.renderNextWordCard();
      this.progressBar.updateSize(completedWordsNumber, numberOfWords);
    });
  }

  activateGameSettingsEvents() {
    const autoplaybackSettingCheckbox = document.querySelector('.main-game__autoplayback');
    const translationSettingCheckbox = document.querySelector('.main-game__translations');

    autoplaybackSettingCheckbox.addEventListener('change', (event) => {
      this.state.gameSetting.isAudioPlaybackEnabled = event.target.checked;
    });

    translationSettingCheckbox.addEventListener('change', (event) => {
      this.state.gameSetting.isTranslationsEnabled = event.target.checked;
      this.toggleWordCardTranslation();
    });
  }

  toggleWordCardTranslation() {
    const wordTransaltionHTML = document.querySelector('.word-card__translation');
    if (this.state.gameSetting.isTranslationsEnabled) {
      wordTransaltionHTML.classList.remove('word-card__translation_hidden');
    } else {
      wordTransaltionHTML.classList.add('word-card__translation_hidden');
    }
  }

  switchToTheNextWordCard(isForShowAnswerButton = false) {
    const inputHTML = document.querySelector('.word-card__input');
    const sentencesWords = document.querySelectorAll('.word-card__sentence-word');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const mainContainer = document.querySelector('.main-game__main-container');

    const { currentWordIndex, currentWordsArray } = this.state;
    console.log('words', currentWordsArray);
    console.log('words2', this.state.currentWordsArray);
    const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;

    if (currentWordIndex !== currentWordsArray.length) {
      console.log(currentWordsArray[currentWordIndex]);
      console.log('currentWordIndex', currentWordIndex);
      const trimedValue = inputHTML.value.trim().toLowerCase();
      const numberOfMistakes = MainGame.checkWord(currentWordsArray[currentWordIndex].word);

      if (isAudioPlaybackEnabled && this.state.isAudioEnded) {
        this.playAudiosInTurns(0);
      }
      if (isTranslationsEnabled) {
        MainGame.toggleTranslations();
      }

      if ((numberOfMistakes === 0 && trimedValue.length) || isForShowAnswerButton) {
        const { mistakesInCurrentWord } = this.state;
        sentencesWords.forEach((word) => {
          word.classList.add('word-card__sentence-word_visible');
        });
        inputHTML.value = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
        MainGame.toggleControlElements();
        MainGame.toggleVocabularyButtons();

        if (mistakesInCurrentWord > 0) {
          this.addWordToTheCurrentTraining();
        } else {
          this.state.longestSeriesIndicator = 0;
          if (this.state.longestSeriesIndicator === 0) {
            this.state.longestSeriesOfAnswers += 1;
          }
          this.state.correctAnswersNumber += 1;
          this.state.learnedWordsToday += 1;
          const { wordsPerDay } = this.state.settings;
          const { learnedWordsToday, currentWordsArray } = this.state;

          if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
            this.state.difficultWordsState.learnedWordsNumber += 1;
            const { learnedWordsNumber } = this.state.difficultWordsState;
            this.progressBar.updateSize(learnedWordsNumber, currentWordsArray.length);
          } else {
            this.progressBar.updateSize(learnedWordsToday, wordsPerDay);
          }
        }
        this.estimateWords = new EstimateButtonsBlock();
        mainContainer.append(this.estimateWords.render());
      } else {
        this.state.mistakesInCurrentWord += 1;
        this.state.allNumberOfMistakes += 1;
        this.state.longestSeriesIndicator += 1;
        inputHTML.value = '';
        setTimeout(() => {
          userAnswerHTML.classList.add('word-card__user-answer_translucent');
        }, 1000);
      }
    }
  }

  static toggleControlElements(isToDisable = true) {
    const inputHTML = document.querySelector('.word-card__input');
    const nextButtonHTML = document.querySelector('.main-game__next-button');
    const showAnswerButton = document.querySelector('.main-game__show-answer-button');

    if (isToDisable) {
      inputHTML.setAttribute('disabled', 'disabled');
      nextButtonHTML.setAttribute('disabled', 'disabled');
      showAnswerButton.setAttribute('disabled', 'disabled');
    } else {
      inputHTML.removeAttribute('disabled', 'disabled');
      nextButtonHTML.removeAttribute('disabled', 'disabled');
      showAnswerButton.removeAttribute('disabled', 'disabled');
    }
  }

  addWordToTheCurrentTraining() {
    const { currentWordsArray, currentWordIndex } = this.state;
    const { wordsPerDay } = this.state.settings;
    const { learnedWordsToday } = this.state;

    const currentWord = currentWordsArray[currentWordIndex];
    this.state.currentWordsArray.push(currentWord);

    if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
      this.state.difficultWordsState.learnedWordsNumber += 1;
      const { learnedWordsNumber } = this.state.difficultWordsState;
      this.progressBar.updateSize(learnedWordsNumber, currentWordsArray.length);
    } else {
      this.progressBar.updateSize(learnedWordsToday, wordsPerDay);
    }
  }

  checkIfCurrentWordIsNotLast() {
    const { learnedWordsNumber } = this.state.difficultWordsState;
    const { learnedWordsToday } = this.state;

    return learnedWordsToday === this.state.currentWordsArray.length
      || learnedWordsNumber === this.state.currentWordsArray.length
  }

  activateEstimateButtons() {
    document.addEventListener('click', async (event) => {
      console.log('click');
      if (event.target.classList.contains('main-game__estimate-button')) {
        console.log('this.state.currentWordIndex', this.state.currentWordIndex);
        console.log('.this.state.currentWordsArray', this.state.currentWordsArray);
        await this.checkIfDailyNormCompleted();
        
        const { currentWordIndex, currentWordsArray } = this.state;
        if (currentWordIndex !== currentWordsArray.length) {
          const targetElementAppraisal = event.target.dataset.buttonAprraisal;

          switch (targetElementAppraisal) {
            case AGAIN.text: {
              const { learnedWordsToday, mistakesInCurrentWord } = this.state;
              if (mistakesInCurrentWord === 0) {
                this.state.learnedWordsToday = (learnedWordsToday - 1 < 0) ? 0 : learnedWordsToday - 1;
              }
              this.addWordToTheCurrentTraining();
              this.state.mistakesInCurrentWord = 0;
              break;
            }
            case HARD.text: {
              await this.addWordToTheVocabulary(LEARNED_WORDS_TITLE, HARD);
              break;
            }
            case GOOD.text: {
              await this.addWordToTheVocabulary(LEARNED_WORDS_TITLE, GOOD);
              break;
            }
            case EASY.text: {
              await this.addWordToTheVocabulary(LEARNED_WORDS_TITLE, EASY);
              break;
            }
            default:
              return;
          }

          this.renderNextWordCard();
        }

        console.log('this.state.learnedWordsToday', this.state.learnedWordsToday);
        await this.setStatisticsData();
      }
    });
  }

  static showMessage(message = EMPTY_WORD_LIST) {
    const mainGameMessage = document.querySelector('.main-game__message');
    if (mainGameMessage) {
      mainGameMessage.remove();
    }

    return create('div', 'main-game__message', message);
  }

  renderNextWordCard() {
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const inputHTML = document.querySelector('.word-card__input');
    const { currentWordsArray, currentWordIndex } = this.state;
    MainGame.removeWordCardFromDOM();
    if (this.estimateWords) {
      this.estimateWords.removeFromDOM();
    }
    this.state.audio.pause();
    this.state.isAudioEnded = true;
    MainGame.toggleVocabularyButtons(false);

    console.log(this.checkIfCurrentWordIsNotLast(), currentWordsArray.length);
    if (!currentWordsArray.length || currentWordIndex === currentWordsArray.length - 1) {
      console.log('HREER')
      const mainContainer = document.querySelector('.main-game__main-container');
      const message = this.state.isNormCompleted && this.state.currentWordsType !== ONLY_DIFFICULT_WORDS
        ? DAILY_NORM_IS_COMPLETED
        : EMPTY_WORD_LIST;
      mainContainer.append(MainGame.showMessage(message));
      if (this.formControl) {
        this.formControl.hide();
      }
    } else {
      console.log('NOOO')
      MainGame.toggleControlElements(false);
      userAnswerHTML.innerHTML = '';
      userAnswerHTML.classList.remove('word-card__user-answer_translucent');

      this.state.currentWordIndex += 1;
      this.progressBar.show();
      this.formControl.show();
      this.renderWordCard(currentWordsArray[this.state.currentWordIndex]);
      inputHTML.focus();
    }
  }

  activateNextButton() {
    const form = document.querySelector('.main-game__form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.switchToTheNextWordCard();
    });
  }

  activateShowAnswerButton() {
    const showAnswerButton = document.querySelector('.main-game__show-answer-button');

    showAnswerButton.addEventListener('click', () => {
      this.switchToTheNextWordCard(true);
    });
  }

  static toggleVocabularyButtons(isToShow = true) {
    const removeWordButton = document.querySelector('.main-game__remove-word');
    const addToDifficultsButton = document.querySelector('.main-game__add-to-difficult');

    if (isToShow) {
      removeWordButton.removeAttribute('disabled');
      addToDifficultsButton.removeAttribute('disabled');
    } else {
      removeWordButton.setAttribute('disabled', 'disabled');
      addToDifficultsButton.setAttribute('disabled', 'disabled');
    }
  }

  activateVocabularyButtons() {
    document.addEventListener('click', async (event) => {
      const removeWordTarget = event.target.closest('.main-game__remove-word');
      const addToDifficultTarget = event.target.closest('.main-game__add-to-difficult');

      if (removeWordTarget) {
        await this.renderWordAfterVocabularyButtonClick(
          removeWordTarget, REMOVED_WORDS_TITLE,
          REMOVE_WORD_BUTTON, REMOVE_WORD_BUTTON_CLICKED,
        );
      }
      if (addToDifficultTarget) {
        await this.renderWordAfterVocabularyButtonClick(
          addToDifficultTarget, DIFFUCULT_WORDS_TITLE,
          ADD_TO_DIFFICULT_WORDS, ADD_TO_DIFFICULT_WORDS_CLICKED,
        );
      }
    });
  }

  async renderWordAfterVocabularyButtonClick(
    target, vocbularyType, buttonText, activeButtonText,
  ) {
    await this.checkIfDailyNormCompleted();
    target.textContent = activeButtonText;
    const buttonType = this.getButtonTypeOfCurrentWord();
    await this.addWordToTheVocabulary(vocbularyType, buttonType);
    this.renderNextWordCard();
    await this.setStatisticsData();

    setTimeout(() => {
      target.textContent = buttonText;
    }, 1500);
  }

  async checkIfDailyNormCompleted() {
    if (this.checkIfCurrentWordIsNotLast()) {
      const { currentWordsType } = this.state;
      const statistics = this.renderDailyStatistics();
      await this.resetStatistics();
      document.body.append(statistics);

      if (currentWordsType !== ONLY_DIFFICULT_WORDS) {
        this.state.isNormCompleted = true;
        this.state.correctAnswersNumber = 0;
        this.state.lastGameWinDate = new Date();
      }
    }
  }

  getButtonTypeOfCurrentWord() {
    const currentWord = this.state.currentWordsArray[this.state.currentWordIndex];
    const wordFromBackend = this.state.userWords.length
      && this.state.userWords.find((word) => word.wordId === currentWord.id);
    return wordFromBackend && wordFromBackend.difficulty;
  }

  async addWordToTheVocabulary(vocabularyType = WORDS_TO_LEARN_TITLE, buttonType = GOOD.text, wordToAdd) {
    const currentWord = wordToAdd || this.state.currentWordsArray[this.state.currentWordIndex];
    const { userId, token } = this.getUserDataForAuthorization();

    await addWordToTheVocabulary(vocabularyType, buttonType, currentWord, { userId, token });
    this.state.userWords = await this.getAllUserWordsFromBackend();
    this.state.mistakesInCurrentWord = 0;
  }

  static checkWord(word) {
    const correctLetters = word.toLowerCase().split('');
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const inputValueLetters = inputHTML.value.trim().toLowerCase().split('');

    userAnswerHTML.innerHTML = '';
    let numberOfMistakes = inputValueLetters
      .filter((letter, index) => letter !== correctLetters[index]).length;
    if (inputValueLetters.length < correctLetters.length) {
      const blankLettersNumber = correctLetters.length - inputValueLetters.length;
      numberOfMistakes += blankLettersNumber;
    }
    const isManyMistakes = checkIsManyMistakes(correctLetters.length, numberOfMistakes);

    correctLetters.forEach((letter, index) => {
      const isLetterCorrect = letter === inputValueLetters[index];
      let extraClassName = null;
      switch (true) {
        case isLetterCorrect:
          extraClassName = 'word-card-letter_correct';
          break;
        case !inputValueLetters.length:
          extraClassName = 'word-card-letter_many-mistakes';
          break;
        case !isLetterCorrect && !isManyMistakes:
        default:
          extraClassName = 'word-card-letter_not-many-mistakes';
          break;
        case !isLetterCorrect && isManyMistakes:
          extraClassName = 'word-card-letter_many-mistakes';
          break;
      }

      const letterHTML = create('span', `word-card-letter ${extraClassName}`, letter);
      userAnswerHTML.append(letterHTML);
    });

    if (numberOfMistakes === 0 && inputValueLetters.length) return 0;

    return numberOfMistakes;
  }

  static activateInputWordsHandler() {
    const formHTML = document.querySelector('.main-game__form');
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');

    formHTML.addEventListener('click', (event) => {
      if (event.target.closest('.word-card__user-answer')) {
        inputHTML.focus();
      }
    });

    inputHTML.addEventListener('input', () => {
      if (userAnswerHTML && userAnswerHTML.childElementCount > 0) {
        userAnswerHTML.innerHTML = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
      }
    });
  }

  static toggleTranslations(isToShow = true) {
    const translationElements = document.querySelectorAll('[data-translation-element]');

    translationElements.forEach((element) => {
      if (isToShow) {
        element.classList.remove('hidden-translation');
      } else {
        element.classList.add('hidden-translation');
      }
    });
  }

  playAudiosInTurns(number) {
    if (number < this.state.audios.length) {
      this.state.isAudioEnded = false;
      let firstAudioIndex = number;
      this.playAudio(this.state.audios[firstAudioIndex]);

      this.state.audio.onended = () => {
        if (firstAudioIndex === this.state.audios.length - 1) {
          this.state.isAudioEnded = true;
        }

        firstAudioIndex += 1;
        this.playAudiosInTurns(firstAudioIndex);
      };
    }
  }

  playAudio(source) {
    const { src, ended } = this.state.audio;

    if (src === '' || src !== source || ended) {
      this.state.audio.src = source;
      this.state.audio.play();
    }
  }

  static createWordCard(currentWord) {
    const wordCard = new WordCard(
      currentWord.id || currentWord._id,
      currentWord.word,
      currentWord.wordTranslate,
      currentWord.textMeaning,
      currentWord.textMeaningTranslate,
      currentWord.textExample,
      currentWord.textExampleTranslate,
      currentWord.audio,
      currentWord.image,
    );

    return wordCard;
  }

  static removeWordCardFromDOM() {
    const wordCardHTML = document.querySelector('.main-game__word-card');
    if (wordCardHTML) {
      wordCardHTML.remove();
    }
  }

  setAudiosForWords(currentWord) {
    this.state.audios = [
      `${WORDS_AUDIOS_URL}${currentWord.audio}`,
      `${WORDS_AUDIOS_URL}${currentWord.audioMeaning}`,
      `${WORDS_AUDIOS_URL}${currentWord.audioExample}`,
    ];
  }
}

export default MainGame;
