import {
  getAllUserWords,
  getAggregatedWordsByFilter,
  updateStatistics,
  getStatistics,
  getUserSettings,
} from '../../service/service';
import create from '../../utils/сreate';
import {
  urls,
  mainGameConstants,
  wordsToLearnOptions,
  estimateButtonsTypes,
  vocabularyConstants,
  checkIsManyMistakes,
  addDaysToTheDate,
  calculatePercentage,
  addWordToTheVocabulary,
} from './pathes';

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
      learnedWordsToday: 0,
      longestSeriesOfAnswers: 0,
      longestSeriesIndicator: 0,
      correctAnswersNumber: 0,
      currentWordsType: MIXED,
      isNormCompleted: false,
      lastGameWinDate: null,
      currentInputValue: '',
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

    try {
      const { userId, token } = this.getUserDataForAuthorization();
      this.preloader = new Preloader();
      this.preloader.render();
      this.preloader.show();
      this.state.settings = await getUserSettings(userId, token);
      await this.resetStatisticsIfNewDay();
      await this.getStatisticsData();
      this.state.userWords = await this.getAllUserWordsFromBackend();
      this.state.userWords = this.parseUserWordsData();

      if (!this.state.isNormCompleted) {
        this.state.currentWordIndex = this.state.learnedWordsToday;
        await this.setNewWords();
        this.state.wordsToLearn = await this.selectWordsToLearn();
        await this.addWordsToLearnToTheVocabulary();
        this.state.currentWordsArray = this.state.wordsToLearn;
        this.setAudiosForWords(this.state.currentWordsArray[currentWordIndex]);

        const { learnedWordsToday } = this.state;
        const { wordsPerDay } = this.state.settings;
        const currentWord = this.state.currentWordsArray[currentWordIndex].word;
        const { showButtonShowAnswer } = this.state.settings.optional.main;

        const wordCard = this.createWordCard(this.state.currentWordsArray[currentWordIndex]);
        const mainGameControls = this.renderMainGameControls();
        this.formControl = new FormControll(currentWord, showButtonShowAnswer);
        this.progressBar = new ProgressBar(learnedWordsToday, wordsPerDay);
        const mainGameMainContainer = create(
          'div', 'main-game__main-container', [wordCard.render(), this.formControl.render()],
        );
        mainGameHTML.append(
          mainGameControls,
          mainGameMainContainer,
          this.progressBar.render(),
        );
        this.formControl.inputHTML.focus();

        this.activateGameSettingsEvents();
        this.activateNextButton();
        this.activateShowAnswerButton();
        MainGame.activateInputWordsHandler();
        this.activateVocabularyButtons();
        this.activateWordsToLearnSelect();
        this.activateEstimateButtons();
        this.activateContinueButton();
        this.toggleVocabularyButtons(false);
      } else {
        const { learnedWordsToday } = this.state;
        const { wordsPerDay } = this.state.settings;
        const mainGameMainContainer = create('div', 'main-game__main-container');
        const mainGameControls = this.renderMainGameControls();
        this.progressBar = new ProgressBar(learnedWordsToday, wordsPerDay);
        const message = MainGame.showMessage(DAILY_NORM_IS_COMPLETED);
        mainGameMainContainer.append(message);
        mainGameHTML.append(
          mainGameControls,
          mainGameMainContainer,
          this.progressBar.render(),
        );
        this.activateWordsToLearnSelect();
        this.toggleVocabularyButtons(false);
      }
      this.preloader.hide();
    } catch (error) {
      Authentication.createErrorBlock(error.message);
    }
  }

  async addWordsToLearnToTheVocabulary() {
    const { wordsPerDay } = this.state.settings;
    const { learnedWordsToday } = this.state;
    const filteredUserWords = this.state.userWords
      .filter((word) => word.optional.vocabulary === WORDS_TO_LEARN_TITLE);
    const wordsToLearnLength = filteredUserWords.length + learnedWordsToday;
    if (wordsToLearnLength < wordsPerDay) {
      const arrayOfPromises = this.state.wordsToLearn
        .map((word) => this.addWordToTheVocabulary(WORDS_TO_LEARN_TITLE, GOOD.text, word));
      await Promise.all(arrayOfPromises);
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
    const { wordsPerDay } = this.state.settings;
    const { newCardsPerDay } = this.state.settings.optional.main;
    const { learnedWordsToday } = this.state;

    const wordsToGet = wordsToRevise.length ? newCardsPerDay : wordsPerDay;
    const filter = `{"userWord.optional.vocabulary":"${WORDS_TO_LEARN_TITLE}"}`;
    const newWordLength = wordsToRevise.length
      ? newCardsPerDay - learnedWordsToday
      : wordsToGet - learnedWordsToday;

    let newWords = await getAggregatedWordsByFilter(userId, token, wordsToGet, filter);
    if (!newWords[0].paginatedResults.length) {
      newWords = await getAggregatedWordsByFilter(userId, token, wordsToGet);
    }

    this.state.newWords = newWords[0].paginatedResults
      .slice(0, newWordLength);
  }

  async selectWordsToLearn() {
    const wordsToRevise = this.getWordsToRevise();
    const { wordsPerDay } = this.state.settings;
    const { newCardsPerDay } = this.state.settings.optional.main;
    const wordsToReviseLength = wordsPerDay - newCardsPerDay;

    return [...this.state.newWords, ...wordsToRevise.slice(0, wordsToReviseLength)];
  }

  async getAllUserWordsFromBackend() {
    const { userId, token } = this.getUserDataForAuthorization();
    const data = await getAllUserWords(userId, token);
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

  renderMainGameControls() {
    const container = create('div', 'main-game__controls');
    const gameSettingsBlock = new SettingsControls();
    const vocabularyButtons = this.renderVocabularyButtons();
    this.wordsSelectList = new WordsSelectList();
    const exitButton = create('button', 'main-game__exit-button', '<i class="fas fa-times"></i>');
    container.append(
      gameSettingsBlock.render(),
      vocabularyButtons,
      this.wordsSelectList.render(),
      exitButton,
    );

    return container;
  }

  renderDailyStatistics() {
    const { wordsPerDay } = this.state.settings;
    const {
      newWords, longestSeriesOfAnswers, currentWordsArray,
    } = this.state;

    if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
      const { learnedWordsNumber } = this.state.difficultWordsState;
      const percentOfCorrectAnswers = calculatePercentage(
        learnedWordsNumber, currentWordsArray.length,
      );
      this.dailyStatistics = new DailyStatistics(
        currentWordsArray.length, percentOfCorrectAnswers, null, longestSeriesOfAnswers,
      );
    } else {
      const correctAnswers = wordsPerDay - (currentWordsArray.length - wordsPerDay);
      const percentOfCorrectAnswers = calculatePercentage(correctAnswers, wordsPerDay);
      this.dailyStatistics = new DailyStatistics(
        wordsPerDay, percentOfCorrectAnswers, newWords.length, longestSeriesOfAnswers,
      );
    }

    this.activateDailyStatisticsButton();
    return this.dailyStatistics.render();
  }

  renderWordCard(currentWordCard) {
    const wordCard = this.createWordCard(currentWordCard);
    this.setAudiosForWords(currentWordCard);
    document.querySelector('.main-game__main-container').prepend(wordCard.render());

    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.formControl.updateInputWidth(currentWordCard.word);
    this.toggleWordCardTranslation();
  }

  renderVocabularyButtons() {
    const {
      showButtonDelete,
      showButtonHard,
    } = this.state.settings.optional.main;

    const container = create('div', 'word-card__vocabulary-buttons');
    if (showButtonDelete) {
      const removeWordButton = FormControll.renderButton('remove-word', REMOVE_WORD_BUTTON);
      container.append(removeWordButton);
    }
    if (showButtonHard) {
      const addToDifficultButton = FormControll.renderButton('add-to-difficult', ADD_TO_DIFFICULT_WORDS);
      container.append(addToDifficultButton);
    }

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
        case (selectedOptionValue === MIXED) && !isNormCompleted:
        default: {
          this.state.userWords = await this.getAllUserWordsFromBackend();
          selectedArrayType = await this.selectWordsToLearn();
          break;
        }
        case (selectedOptionValue === ONLY_NEW_WORDS) && !isNormCompleted: {
          this.state.userWords = await this.getAllUserWordsFromBackend();
          await this.setNewWords();
          selectedArrayType = this.state.newWords;
          break;
        }
        case (selectedOptionValue === ONLY_WORDS_TO_REPEAT) && !isNormCompleted: {
          this.state.userWords = await this.getAllUserWordsFromBackend();
          selectedArrayType = this.getWordsToRevise();
          break;
        }
        case (selectedOptionValue === ONLY_DIFFICULT_WORDS): {
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
      const wordCardHTML = document.querySelector('.main-game__word-card');
      const mainGameContainer = document.querySelector('.main-game__main-container');
      const mainGameMessage = document.querySelector('.main-game__message');

      if (!wordCardHTML) {
        if (this.state.currentWordsArray.length) {
          let { currentWordIndex } = this.state;
          currentWordIndex = currentWordIndex < 0 ? 0 : currentWordIndex;
          const currentWordObject = this.state.currentWordsArray[currentWordIndex];
          const currentWord = (currentWordObject && currentWordObject.word)
            || currentWordObject.optional.word;
          const wordCard = this.createWordCard(this.state.currentWordsArray[currentWordIndex]);
          const { showButtonShowAnswer } = this.state.settings.optional.main;
          this.formControl = new FormControll(currentWord, showButtonShowAnswer);

          mainGameContainer.append(wordCard.render(), this.formControl.render());
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
    const { showTranslateWord } = this.state.settings.optional.main;
    if (!showTranslateWord) return;

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
    const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;
    userAnswerHTML.classList.remove('word-card__user-answer_visible');

    if (currentWordIndex !== currentWordsArray.length) {
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
        const { showButtons } = this.state.settings.optional.main;
        sentencesWords.forEach((word) => {
          word.classList.add('word-card__sentence-word_visible');
        });
        inputHTML.value = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
        userAnswerHTML.classList.add('word-card__user-answer_visible');
        this.toggleControlElements();
        this.toggleVocabularyButtons();

        if (mistakesInCurrentWord > 0) {
          this.addWordToTheCurrentTraining();
          this.state.longestSeriesIndicator += 1;
        } else {
          if (this.state.longestSeriesIndicator === 0) {
            this.state.longestSeriesOfAnswers += 1;
            this.state.longestSeriesIndicator = 0;
          }
          this.state.longestSeriesIndicator = 0;
          this.state.correctAnswersNumber += 1;
          this.state.learnedWordsToday += 1;
          this.wordsSelectList.disable();
          userAnswerHTML.classList.remove('word-card__user-answer_translucent');
          const { wordsPerDay } = this.state.settings;
          const { learnedWordsToday } = this.state;

          if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
            this.state.difficultWordsState.learnedWordsNumber += 1;
            const { learnedWordsNumber } = this.state.difficultWordsState;
            this.progressBar.updateSize(learnedWordsNumber, currentWordsArray.length);
          } else {
            this.progressBar.updateSize(learnedWordsToday, wordsPerDay);
          }
          if (!showButtons && this.formControl) {
            this.formControl.renderContinueButton();
          }
        }

        if (showButtons) {
          const { main } = this.state.settings.optional;
          this.estimateWords = new EstimateButtonsBlock(main);
          mainContainer.append(this.estimateWords.render());
        }
      } else {
        userAnswerHTML.classList.add('word-card__user-answer_visible');
        this.state.mistakesInCurrentWord += 1;
        this.state.longestSeriesIndicator += 1;
        inputHTML.value = '';
        setTimeout(() => {
          userAnswerHTML.classList.add('word-card__user-answer_translucent');
        }, 1000);
      }
    }
  }

  activateContinueButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.main-game__continue-button');

      if (target) {
        const continueButton = document.querySelector('.main-game__continue-button');
        this.addWordToTheVocabulary(LEARNED_WORDS_TITLE);
        this.wordsSelectList.enable();
        this.renderNextWordCard();
        this.state.audio.pause();
        continueButton.remove();
      }
    });
  }

  toggleControlElements(isToDisable = true) {
    const { showButtonShowAnswer } = this.state.settings.optional.main;
    const inputHTML = document.querySelector('.word-card__input');
    const nextButtonHTML = document.querySelector('.main-game__next-button');
    const showAnswerButtonHTML = document.querySelector('.main-game__show-answer-button');

    if (isToDisable) {
      inputHTML.setAttribute('disabled', 'disabled');
      nextButtonHTML.setAttribute('disabled', 'disabled');
      if (showButtonShowAnswer) {
        showAnswerButtonHTML.setAttribute('disabled', 'disabled');
      }
    } else {
      inputHTML.removeAttribute('disabled', 'disabled');
      nextButtonHTML.removeAttribute('disabled', 'disabled');
      if (showButtonShowAnswer) {
        showAnswerButtonHTML.removeAttribute('disabled', 'disabled');
      }
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
    const { learnedWordsToday, currentWordsArray } = this.state;
    const { wordsPerDay } = this.state.settings;

    return learnedWordsToday === wordsPerDay || learnedWordsNumber === currentWordsArray.length - 1;
  }

  activateEstimateButtons() {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('main-game__estimate-button')) {
        await this.checkIfDailyNormCompleted();

        const { currentWordIndex, currentWordsArray } = this.state;
        if (currentWordIndex !== currentWordsArray.length) {
          const targetElementAppraisal = event.target.dataset.buttonAprraisal;

          switch (targetElementAppraisal) {
            case AGAIN.text: {
              const { learnedWordsToday, mistakesInCurrentWord } = this.state;
              if (mistakesInCurrentWord === 0) {
                this.state.learnedWordsToday = (learnedWordsToday - 1 < 0)
                  ? 0
                  : learnedWordsToday - 1;
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

          this.wordsSelectList.enable();
          this.renderNextWordCard();
          this.state.audio.pause();
        }

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
    MainGame.removeWordCardFromDOM();
    if (this.estimateWords) {
      this.estimateWords.removeFromDOM();
    }
    this.state.isAudioEnded = true;
    this.toggleVocabularyButtons(false);

    const { currentWordsArray, currentWordIndex } = this.state;
    if (
      !currentWordsArray.length || currentWordIndex === currentWordsArray.length - 1
    ) {
      const mainContainer = document.querySelector('.main-game__main-container');
      const message = this.state.isNormCompleted
      && this.state.currentWordsType !== ONLY_DIFFICULT_WORDS
        ? DAILY_NORM_IS_COMPLETED
        : EMPTY_WORD_LIST;
      mainContainer.append(MainGame.showMessage(message));
      if (this.formControl) {
        this.formControl.hide();
      }
    } else {
      this.toggleControlElements(false);
      userAnswerHTML.innerHTML = '';
      userAnswerHTML.classList.remove('word-card__user-answer_translucent');

      this.state.currentWordIndex += 1;
      this.progressBar.show();
      this.renderWordCard(currentWordsArray[this.state.currentWordIndex]);
    }
  }

  activateNextButton() {
    document.addEventListener('submit', async (event) => {
      if (event.target.classList.contains('main-game__form')) {
        event.preventDefault();
        this.switchToTheNextWordCard();
        await this.setStatisticsData();
      }
    });
  }

  static activateExitButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.main-game__exit-button');
      if (target) {}
    });
  }

  activateShowAnswerButton() {
    const { showButtonShowAnswer } = this.state.settings.optional.main;
    if (!showButtonShowAnswer) return;

    document.addEventListener('click', async (event) => {
      const target = event.target.closest('.main-game__show-answer-button');

      if (target) {
        this.switchToTheNextWordCard(true);
        await this.setStatisticsData();
      }
    });
  }

  toggleVocabularyButtons(isToShow = true) {
    const {
      showButtonDelete,
      showButtonHard,
    } = this.state.settings.optional.main;
    const removeWordButton = document.querySelector('.main-game__remove-word');
    const addToDifficultsButton = document.querySelector('.main-game__add-to-difficult');

    if (isToShow) {
      if (showButtonDelete) {
        removeWordButton.removeAttribute('disabled');
      }
      if (showButtonHard) {
        addToDifficultsButton.removeAttribute('disabled');
      }
    } else {
      if (showButtonDelete) {
        removeWordButton.setAttribute('disabled', 'disabled');
      }
      if (showButtonHard) {
        addToDifficultsButton.setAttribute('disabled', 'disabled');
      }
    }
  }

  activateVocabularyButtons() {
    document.addEventListener('click', async (event) => {
      const {
        showButtonDelete,
        showButtonHard,
      } = this.state.settings.optional.main;
      const removeWordTarget = event.target.closest('.main-game__remove-word');
      const addToDifficultTarget = event.target.closest('.main-game__add-to-difficult');

      if (removeWordTarget && showButtonDelete) {
        await this.renderWordAfterVocabularyButtonClick(
          removeWordTarget, REMOVED_WORDS_TITLE,
          REMOVE_WORD_BUTTON, REMOVE_WORD_BUTTON_CLICKED,
        );
      }
      if (addToDifficultTarget && showButtonHard) {
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
    this.toggleVocabularyButtons(false);
    await this.checkIfDailyNormCompleted();
    target.textContent = activeButtonText;
    const buttonType = this.getButtonTypeOfCurrentWord();
    await this.addWordToTheVocabulary(vocbularyType, buttonType);
    this.renderNextWordCard();
    await this.setStatisticsData();
    this.wordsSelectList.enable();
    this.state.audio.pause();

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

  async addWordToTheVocabulary(
    vocabularyType = WORDS_TO_LEARN_TITLE, buttonType = GOOD.text, wordToAdd,
  ) {
    const { main } = this.state.settings.optional;
    const currentWord = wordToAdd || this.state.currentWordsArray[this.state.currentWordIndex];
    const { userId, token } = this.getUserDataForAuthorization();

    await addWordToTheVocabulary(
      vocabularyType, buttonType, currentWord, { userId, token }, main,
    );
    this.state.userWords = await this.getAllUserWordsFromBackend();
    this.state.mistakesInCurrentWord = 0;
  }

  static checkWord(word) {
    const correctLetters = word.toLowerCase().split('');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const inputValueLetters = document.querySelector('.word-card__input').value.trim().toLowerCase().split('');

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
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');

    document.addEventListener('click', (event) => {
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

  createWordCard(currentWord) {
    const {
      showTranslateWord,
      showWordMeaning,
      showWordExample,
      showTranscription,
      showImageAssociations,
    } = this.state.settings.optional.main;
    const wordCardSettings = {
      showTranslateWord,
      showWordMeaning,
      showWordExample,
      showTranscription,
      showImageAssociations,
    };
    const wordCard = new WordCard(
      currentWord.id || currentWord._id,
      currentWord.word,
      currentWord.wordTranslate,
      currentWord.textMeaning,
      currentWord.textMeaningTranslate,
      currentWord.textExample,
      currentWord.textExampleTranslate,
      currentWord.transcription,
      currentWord.audio,
      currentWord.image,
      wordCardSettings,
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
