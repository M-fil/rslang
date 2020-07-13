import {
  getAllUserWords,
  getAggregatedWordsByFilter,
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
  StatisticsGameCodes,
} from './pathes';

import WordCard from './components/word-card/WordCard';
import SettingsControls from './components/settings-controls/SettingsControls';
import EstimateButtonsBlock from './components/estimate-buttons/EstimateButtonsBlock';
import WordsSelectList from './components/words-select-list/WordsSelectList';
import ProgressBar from './components/progress-bar/ProgressBar';
import Preloader from '../preloader/Preloader';
import FormControll from './components/form-control/FormControl';
import Authentication from '../authentication/Authentication';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';
import Statistics from '../statistics/Statistics';

import DailyStatistics from './components/daily-statistics/DailyStatistics';
import DifficultWordsDailyStatistics from './components/daily-statistics/DifficultWordsDailyStatistics';

const {
  MAIN_GAME_CODE,
} = StatisticsGameCodes;

const {
  REMOVE_WORD_BUTTON,
  ADD_TO_DIFFICULT_WORDS,
  EMPTY_WORD_LIST,
  DAILY_NORM_IS_COMPLETED,
  ADD_TO_DIFFICULT_WORDS_CLICKED,
  REMOVE_WORD_BUTTON_CLICKED,
  LOGO_PATH,
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

const defaultStatisticsAdditional = {
  longestSeriesOfAnswers: 0,
  currentLongestSeriesOfAnswers: 0,
  longestSeriesIndicator: 0,
  mistakesInCurrentWord: 0,
  wordsWithMistakes: [],
  correctWords: [],
};

class MainGame {
  constructor(parameters) {
    this.vocabulary = null;
    this.settings = null;
    this.statistics = null;
    this.preloader = new Preloader();
    this.exitButton = parameters.closeButton;

    this.state = {
      stats: {
        learnedWordsToday: 0,
        correctAnswersNumber: 0,
        commonMistakesNumber: 0,
        additional: defaultStatisticsAdditional,
      },
      currentWordIndex: 0,
      currentWordsType: MIXED,
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
      userState: parameters.user,
    };
  }

  addWordToTheMistaken(wordText) {
    const { wordsWithMistakes } = this.state.stats.additional;
    const findedWord = wordsWithMistakes.find((word) => word === wordText);
    if (!findedWord) {
      this.state.stats.additional.wordsWithMistakes.push(wordText);
    }
  }

  addWordToTheCorrect(wordText) {
    const { wordsWithMistakes } = this.state.stats.additional;
    const findedWord = wordsWithMistakes.find((word) => word === wordText);
    if (!findedWord) {
      this.state.stats.additional.correctWords.push(wordText);
    }
  }

  async render(elementQuery) {
    const { currentWordIndex } = this.state;

    const mainGameHTML = create('div', 'main-game');
    document.querySelector(elementQuery).append(mainGameHTML);

    try {
      this.preloader.show();

      await this.initSettings();
      await this.initVocabulary();
      await this.initStatistics();

      await this.getStatisticsData();
      await this.setStatisticsData(false);
      this.state.userWords = await this.getAllUserWordsFromBackend();
      this.state.userWords = this.parseUserWordsData();

      const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
      let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
      learnedWords = learnedWords || 0;

      if (learnedWords < maxCardsPerDay) {
        this.state.currentWordIndex = 0;
        await this.setNewWords();
        this.state.wordsToLearn = await this.selectWordsToLearn();
        await this.addWordsToLearnToTheVocabulary();
        this.state.currentWordsArray = this.state.wordsToLearn;
        this.setAudiosForWords(this.state.currentWordsArray[currentWordIndex]);

        const { showButtonShowAnswer } = this.settings.getSettingsByGroup('main');
        const currentWord = this.state.currentWordsArray[currentWordIndex].word;

        const wordCard = this.createWordCard(this.state.currentWordsArray[currentWordIndex]);
        const mainGameControls = this.renderMainGameControls();
        this.formControl = new FormControll(currentWord, showButtonShowAnswer);
        this.progressBar = new ProgressBar(learnedWords, maxCardsPerDay);
        const mainGameMainContainer = create(
          'div', 'main-game__main-container', [wordCard.render(), this.formControl.render()],
        );

        mainGameHTML.append(
          this.renderMainGameHeader(),
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
        this.activateReviseAgainButton();
        this.toggleVocabularyButtons(false);
      } else if (learnedWords === maxCardsPerDay) {
        const mainGameMainContainer = create('div', 'main-game__main-container');
        const mainGameControls = this.renderMainGameControls();
        this.progressBar = new ProgressBar(learnedWords, maxCardsPerDay);
        const message = MainGame.showMessage(DAILY_NORM_IS_COMPLETED);
        mainGameMainContainer.append(message);
        mainGameHTML.append(
          this.renderMainGameHeader(),
          mainGameControls,
          mainGameMainContainer,
          this.progressBar.render(),
        );
        this.activateGameSettingsEvents();
        this.activateNextButton();
        this.activateShowAnswerButton();
        MainGame.activateInputWordsHandler();
        this.activateVocabularyButtons();
        this.activateWordsToLearnSelect();
        this.activateEstimateButtons();
        this.activateContinueButton();
        this.activateReviseAgainButton();
        this.toggleVocabularyButtons(false);
      }
      this.preloader.hide();
    } catch (error) {
      this.preloader.hide();
      Authentication.createErrorBlock(error.message);
    }
  }

  async initVocabulary() {
    this.vocabulary = new Vocabulary(this.state.userState);
    await this.vocabulary.init();
  }

  async initSettings() {
    this.settings = new Settings(this.state.userState);
    await this.settings.init();
  }

  async initStatistics() {
    this.statistics = new Statistics(this.state.userState);
    await this.statistics.init();
  }

  async addWordsToLearnToTheVocabulary() {
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    const { learnedWordsToday } = this.state.stats;
    const filteredUserWords = this.state.userWords
      .filter((word) => word.optional.vocabulary === WORDS_TO_LEARN_TITLE);
    const wordsToLearnLength = filteredUserWords.length + learnedWordsToday;

    if (wordsToLearnLength < maxCardsPerDay) {
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
    const statisticsData = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    const { correctAnswers, wrongAnswers } = statisticsData;
    const learnedWords = statisticsData.learnedWords || 0;

    if (!statisticsData.additional) {
      await this.setStatisticsData(false);
    } else {
      const {
        longestSeriesOfAnswers,
        longestSeriesIndicator,
        mistakesInCurrentWord,
        wordsWithMistakes,
        correctWords,
        currentLongestSeriesOfAnswers,
      } = JSON.parse(statisticsData.additional);

      this.state.stats = {
        learnedWordsToday: parseInt(learnedWords, 10) || 0,
        correctAnswersNumber: parseInt(correctAnswers, 10) || 0,
        commonMistakesNumber: parseInt(wrongAnswers, 10) || 0,
        additional: {
          longestSeriesOfAnswers: parseInt(longestSeriesOfAnswers, 10) || 0,
          currentLongestSeriesOfAnswers: parseInt(currentLongestSeriesOfAnswers, 10) || 0,
          longestSeriesIndicator: parseInt(longestSeriesIndicator, 10) || 0,
          mistakesInCurrentWord: parseInt(mistakesInCurrentWord, 10) || 0,
          wordsWithMistakes: wordsWithMistakes || [],
          correctWords: correctWords || [],
        },
      };
    }
  }

  async setStatisticsData(isIncrementValues = true) {
    if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) return;

    const mainGameAdditional = JSON.stringify(this.state.stats.additional);
    const { wordsWithMistakes, correctWords } = this.state.stats.additional;

    const wrong = wordsWithMistakes.length;
    const correct = correctWords.length;
    const learned = wordsWithMistakes.length + correctWords.length;

    const { learnedWordsToday } = this.state.stats;
    const isIncrementPlayingCount = learnedWordsToday === 1;

    if (isIncrementValues) {
      await this.statistics.saveMainGameStatistics(
        isIncrementPlayingCount,
        correct,
        wrong,
        learned,
        mainGameAdditional,
        true,
      );
    } else {
      await this.statistics.saveMainGameStatistics(
        isIncrementPlayingCount, 0, 0, 0, mainGameAdditional, true,
      );
    }
  }

  async setNewWords() {
    const wordsToRevise = this.getWordsToRevise();
    const { maxCardsPerDay, newCardsPerDay } = this.settings.getSettingsByGroup('main');
    const { learnedWordsToday } = this.state.stats;

    const wordsToGet = wordsToRevise.length ? newCardsPerDay : maxCardsPerDay;
    const newWordLength = wordsToRevise.length
      ? newCardsPerDay - learnedWordsToday
      : wordsToGet - learnedWordsToday;

    let newWords = this.vocabulary.getWordsByVocabularyType(WORDS_TO_LEARN_TITLE);

    if (!newWords.length) {
      const { userId, token } = this.state.userState;
      const words = await getAggregatedWordsByFilter(userId, token, wordsToGet);
      newWords = words[0].paginatedResults;
    } else {
      newWords = newWords.map((word) => word.optional.allData);
    }
    this.state.newWords = newWords.slice(0, newWordLength);
  }

  async selectWordsToLearn() {
    const wordsToRevise = this.getWordsToRevise();
    const { maxCardsPerDay, newCardsPerDay } = this.settings.getSettingsByGroup('main');
    const wordsToReviseLength = maxCardsPerDay - newCardsPerDay;

    const wordsToLearn = [...this.state.newWords, ...wordsToRevise.slice(0, wordsToReviseLength)];
    return wordsToLearn;
  }

  async getAllUserWordsFromBackend() {
    const { userId, token } = this.state.userState;
    const data = await getAllUserWords(userId, token);
    return data;
  }

  renderExitButton() {
    const { modalClose } = this.exitButton.modalWindow;
    modalClose.id = 'button-go-to-main-page';
    this.exitButton.exitButton.classList.add('main-game__exit-button');
    this.exitButton.show();

    return this.exitButton.render();
  }

  renderMainGameControls() {
    const container = create('div', 'main-game__controls');
    const gameSettingsBlock = new SettingsControls();
    const vocabularyButtons = this.renderVocabularyButtons();
    this.wordsSelectList = new WordsSelectList();
    container.append(
      gameSettingsBlock.render(),
      vocabularyButtons,
      this.wordsSelectList.render(),
    );

    return container;
  }

  async renderDailyStatistics() {
    const { maxCardsPerDay, newCardsPerDay } = this.settings.getSettingsByGroup('main');
    const { correctAnswersNumber } = this.state.stats;
    const { longestSeriesOfAnswers } = this.state.stats.additional;
    const { currentWordsType } = this.state;

    if (currentWordsType === ONLY_DIFFICULT_WORDS) {
      const difficultWordsLength = this.vocabulary.getVocabularyWordsLength(DIFFUCULT_WORDS_TITLE);

      this.dailyStatistics = new DifficultWordsDailyStatistics(difficultWordsLength);
    } else {
      const percentOfCorrectAnswers = calculatePercentage(correctAnswersNumber, maxCardsPerDay);
      this.dailyStatistics = new DailyStatistics(
        maxCardsPerDay, percentOfCorrectAnswers, newCardsPerDay, longestSeriesOfAnswers,
      );
    }

    this.activateDailyStatisticsButton();
    await this.setStatisticsData(false);
    document.querySelector('.main-game').append(this.dailyStatistics.render());
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

  renderMainGameHeader() {
    const container = create('div', 'main-game__header');
    this.logoHTML = create('img', 'main-game__logo-image', '', container, ['src', LOGO_PATH]);
    container.append(this.renderExitButton());

    return container;
  }

  renderVocabularyButtons() {
    const { showButtonDelete, showButtonHard } = this.settings.getSettingsByGroup('main');

    const container = create('div', 'word-card__vocabulary-buttons');
    if (showButtonDelete) {
      const removeWordButton = FormControll.renderButton('remove-word', REMOVE_WORD_BUTTON);
      removeWordButton.classList.add('main-game__vocabulary-button');
      container.append(removeWordButton);
    }
    if (showButtonHard) {
      const addToDifficultButton = FormControll.renderButton('add-to-difficult', ADD_TO_DIFFICULT_WORDS);
      addToDifficultButton.classList.add('main-game__vocabulary-button');
      container.append(addToDifficultButton);
    }

    return container;
  }

  activateDailyStatisticsButton() {
    document.querySelector('.main-game').addEventListener('click', (event) => {
      if (event.target.closest('.daily-statistics__button')) {
        if (this.dailyStatistics) {
          this.dailyStatistics.removeFromDOM();
        }
      }
    });
  }

  activateReviseAgainButton() {
    document.querySelector('.main-game').addEventListener('click', async (event) => {
      const target = event.target.closest('.daily-statistics__revise-button');

      if (target) {
        this.preloader.show();
        this.state.difficultWordsState.learnedWordsNumber = 0;
        this.state.userWords = await this.getAllUserWordsFromBackend();
        this.state.userWords = this.parseUserWordsData();
        this.state.currentWordsArray = this.vocabulary
          .getWordsByVocabularyType(DIFFUCULT_WORDS_TITLE)
          .map((word) => word.optional.allData);
        this.dailyStatistics.removeFromDOM();

        const { learnedWordsNumber } = this.state.difficultWordsState;
        this.state.currentWordIndex = -1;
        this.renderAgainWordCard();
        this.renderNextWordCard();
        this.progressBar.updateSize(learnedWordsNumber, this.state.currentWordsArray.length);
        this.preloader.hide();
      }
    });
  }

  async renderMixedWords() {
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    learnedWords = learnedWords || 0;

    if (learnedWords < maxCardsPerDay) {
      this.state.userWords = await this.getAllUserWordsFromBackend();
      await this.setNewWords();
      const result = await this.selectWordsToLearn();
      return result;
    }
  }

  async renderNewWords() {
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    learnedWords = learnedWords || 0;

    if (learnedWords < maxCardsPerDay) {
      this.state.userWords = await this.getAllUserWordsFromBackend();
      await this.setNewWords();
      return this.state.newWords;
    }
  }

  async renderWordsToRepeat() {
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    learnedWords = learnedWords || 0;

    if (learnedWords < maxCardsPerDay) {
      this.state.userWords = await this.getAllUserWordsFromBackend();
      const wordsToRevise = this.getWordsToRevise();
      return wordsToRevise;
    }
  }

  activateWordsToLearnSelect() {
    const selectHTML = document.querySelector('.main-game__words-type-select');
    selectHTML.addEventListener('change', async (event) => {
      const { options } = event.target;
      const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');

      const selectedOptionValue = options[options.selectedIndex].value;
      let selectedArrayType = [];
      let numberOfWords = maxCardsPerDay;
      let completedWordsNumber = this.state.stats.learnedWordsToday;
      this.state.currentWordsType = selectedOptionValue;
      let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
      learnedWords = learnedWords || 0;
      this.state.currentIndex = 0;

      this.preloader.show();
      switch (selectedOptionValue) {
        case MIXED:
        default: {
          selectedArrayType = await this.renderMixedWords();
          completedWordsNumber = learnedWords;
          break;
        }
        case ONLY_NEW_WORDS: {
          selectedArrayType = await this.renderNewWords();
          completedWordsNumber = learnedWords;
          break;
        }
        case ONLY_WORDS_TO_REPEAT: {
          selectedArrayType = await this.renderWordsToRepeat();
          completedWordsNumber = learnedWords;
          break;
        }
        case ONLY_DIFFICULT_WORDS: {
          this.state.userWords = await this.getAllUserWordsFromBackend();
          this.state.userWords = this.parseUserWordsData();
          const { learnedWordsNumber } = this.state.difficultWordsState;
          const difficultWordsLength = this.vocabulary
            .getVocabularyWordsLength(DIFFUCULT_WORDS_TITLE);
          this.progressBar.updateSize(learnedWordsNumber, difficultWordsLength);
          selectedArrayType = this.vocabulary.getWordsByVocabularyType(DIFFUCULT_WORDS_TITLE)
            .map((word) => word.optional.allData);
          numberOfWords = selectedArrayType.length;
          completedWordsNumber = learnedWordsNumber;
          break;
        }
      }
      this.state.currentWordsArray = selectedArrayType;

      this.preloader.hide();
      this.renderAgainWordCard();
      this.state.currentWordIndex = -1;
      this.renderNextWordCard();
      this.progressBar.updateSize(completedWordsNumber, numberOfWords);
    });
  }

  renderAgainWordCard() {
    const wordCardHTML = document.querySelector('.main-game__word-card');
    const mainGameContainer = document.querySelector('.main-game__main-container');
    const mainGameMessage = document.querySelector('.main-game__message');

    if (!wordCardHTML && this.state.currentWordsArray.length) {
      let { currentWordIndex } = this.state;
      currentWordIndex = currentWordIndex < 0 ? 0 : currentWordIndex;
      const currentWordObject = this.state.currentWordsArray[currentWordIndex];
      const currentWord = (currentWordObject && currentWordObject.word)
        || (currentWordObject && currentWordObject.optional.word);
      const wordCard = this.createWordCard(this.state.currentWordsArray[currentWordIndex]);
      const { showButtonShowAnswer } = this.settings.getSettingsByGroup('main');
      this.formControl = new FormControll(currentWord, showButtonShowAnswer);

      mainGameContainer.append(wordCard.render(), this.formControl.render());
      mainGameMessage.remove();
    }
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
    const { showTranslateWord } = this.settings.getSettingsByGroup('main');
    if (!showTranslateWord) return;

    const wordTransaltionHTML = document.querySelector('.word-card__translation');
    if (this.state.gameSetting.isTranslationsEnabled) {
      wordTransaltionHTML.classList.remove('word-card__translation_hidden');
    } else {
      wordTransaltionHTML.classList.add('word-card__translation_hidden');
    }
  }

  increaseLongestSeriesValues() {
    const { currentLongestSeriesOfAnswers, longestSeriesOfAnswers } = this.state.stats.additional;

    if (this.state.stats.additional.longestSeriesIndicator === 0) {
      if (currentLongestSeriesOfAnswers >= longestSeriesOfAnswers) {
        this.state.stats.additional.longestSeriesOfAnswers += 1;
      }
      this.state.stats.additional.currentLongestSeriesOfAnswers += 1;
      this.state.stats.correctAnswersNumber += 1;
      this.state.stats.additional.longestSeriesIndicator = 0;
    }
  }

  switchToTheNextWordCard(isForShowAnswerButton = false) {
    const inputHTML = document.querySelector('.word-card__input');
    const sentencesWords = document.querySelectorAll('.word-card__sentence-word');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');

    const { currentWordIndex, currentWordsArray } = this.state;
    const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;
    userAnswerHTML.classList.remove('word-card__user-answer_visible');
    const currentWordText = currentWordsArray[currentWordIndex].word;

    if (currentWordIndex !== currentWordsArray.length) {
      const { mistakesInCurrentWord } = this.state.stats.additional;
      const trimedValue = inputHTML.value.trim().toLowerCase();
      const numberOfMistakes = MainGame.checkWord(currentWordText);

      if (isAudioPlaybackEnabled && this.state.isAudioEnded) {
        this.playAudiosInTurns(0);
      }
      if (isTranslationsEnabled) {
        MainGame.toggleTranslations();
      }

      if ((numberOfMistakes === 0 && trimedValue.length) || isForShowAnswerButton) {
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
          this.state.stats.additional.longestSeriesIndicator += 1;
        } else {
          this.increaseLongestSeriesValues();
          this.addWordToTheCorrect(currentWordText);
          this.state.stats.additional.longestSeriesIndicator = 0;
          this.state.stats.learnedWordsToday += 1;
          this.state.difficultWordsState.learnedWordsNumber += 1;
          this.state.stats.additional.mistakesInCurrentWord = 0;
          this.wordsSelectList.disable();
          userAnswerHTML.classList.remove('word-card__user-answer_translucent');
          this.updateProgressBar();
        }

        this.renderAppropriateSwitchToTheNextWordButton();
      } else {
        userAnswerHTML.classList.add('word-card__user-answer_visible');
        this.state.stats.additional.mistakesInCurrentWord += 1;
        this.state.stats.additional.longestSeriesIndicator += 1;
        this.state.stats.additional.currentLongestSeriesOfAnswers = 0;
        if (mistakesInCurrentWord === 1) {
          this.state.stats.commonMistakesNumber += 1;
        }
        this.addWordToTheMistaken(currentWordText);
        inputHTML.value = '';
        setTimeout(() => {
          userAnswerHTML.classList.add('word-card__user-answer_translucent');
        }, 1000);
      }
    }
  }

  activateContinueButton() {
    document.querySelector('.main-game').addEventListener('click', async (event) => {
      const target = event.target.closest('.main-game__continue-button');

      if (target) {
        const { currentWordsType } = this.state;
        const vocabulary = currentWordsType === ONLY_DIFFICULT_WORDS
          ? DIFFUCULT_WORDS_TITLE
          : LEARNED_WORDS_TITLE;
        const continueButton = document.querySelector('.main-game__continue-button');
        this.addWordToTheVocabulary(vocabulary);
        this.wordsSelectList.enable();
        this.renderNextWordCard();
        this.state.audio.pause();
        continueButton.remove();

        if (this.checkIfCurrentWordIsNotLast()) {
          await this.renderDailyStatistics();
        }
      }
    });
  }

  toggleControlElements(isToDisable = true) {
    if (isToDisable) {
      this.enableControlButtons();
    } else {
      this.disableControlButtons();
    }
  }

  disableControlButtons() {
    const inputHTML = document.querySelector('.word-card__input');
    const nextButtonHTML = document.querySelector('.main-game__next-button');
    const showAnswerButtonHTML = document.querySelector('.main-game__show-answer-button');
    const { showButtonShowAnswer } = this.settings.getSettingsByGroup('main');

    if (inputHTML) {
      inputHTML.removeAttribute('disabled', 'disabled');
    }
    if (nextButtonHTML) {
      nextButtonHTML.removeAttribute('disabled', 'disabled');
    }
    if (showButtonShowAnswer && showAnswerButtonHTML) {
      showAnswerButtonHTML.removeAttribute('disabled', 'disabled');
    }
  }

  enableControlButtons() {
    const inputHTML = document.querySelector('.word-card__input');
    const nextButtonHTML = document.querySelector('.main-game__next-button');
    const showAnswerButtonHTML = document.querySelector('.main-game__show-answer-button');
    const { showButtonShowAnswer } = this.settings.getSettingsByGroup('main');

    if (inputHTML) {
      inputHTML.setAttribute('disabled', 'disabled');
    }
    if (nextButtonHTML) {
      nextButtonHTML.setAttribute('disabled', 'disabled');
    }
    if (showButtonShowAnswer && showAnswerButtonHTML) {
      showAnswerButtonHTML.setAttribute('disabled', 'disabled');
    }
  }

  addWordToTheCurrentTraining() {
    const { currentWordsArray, currentWordIndex } = this.state;

    const currentWord = currentWordsArray[currentWordIndex];
    this.state.currentWordsArray.push(currentWord);
    this.updateProgressBar();
  }

  updateProgressBar() {
    if (this.state.currentWordsType === ONLY_DIFFICULT_WORDS) {
      const { learnedWordsNumber } = this.state.difficultWordsState;
      const difficultWordsLength = this.vocabulary.getVocabularyWordsLength(DIFFUCULT_WORDS_TITLE);
      this.progressBar.updateSize(learnedWordsNumber, difficultWordsLength);
    } else {
      const { correctWords } = this.state.stats.additional;
      const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
      this.progressBar.updateSize(correctWords.length, maxCardsPerDay);
    }
  }

  renderAppropriateSwitchToTheNextWordButton() {
    const { showButtons } = this.settings.getSettingsByGroup('main');
    const { currentWordsType } = this.state;
    const mainContainer = document.querySelector('.main-game__main-container');

    if ((!showButtons || currentWordsType === ONLY_DIFFICULT_WORDS) && this.formControl) {
      this.formControl.renderContinueButton();
    }

    if (showButtons && currentWordsType !== ONLY_DIFFICULT_WORDS) {
      const main = this.settings.getSettingsByGroup('main');
      this.estimateWords = new EstimateButtonsBlock(main);
      mainContainer.append(this.estimateWords.render());
    }
  }

  checkIfCurrentWordIsNotLast() {
    const { learnedWordsNumber } = this.state.difficultWordsState;
    const { currentWordsType } = this.state;
    let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    learnedWords = learnedWords || 0;
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    const difficultWordsLength = this.vocabulary.getVocabularyWordsLength(DIFFUCULT_WORDS_TITLE);

    return (learnedWords === maxCardsPerDay && currentWordsType !== ONLY_DIFFICULT_WORDS)
      || (learnedWordsNumber === difficultWordsLength);
  }

  activateEstimateButtons() {
    document.querySelector('.main-game').addEventListener('click', async (event) => {
      if (event.target.classList.contains('main-game__estimate-button')) {
        this.preloader.show();

        const { currentWordIndex, currentWordsArray } = this.state;
        if (currentWordIndex !== currentWordsArray.length) {
          const targetElementAppraisal = event.target.dataset.buttonAprraisal;

          switch (targetElementAppraisal) {
            case AGAIN.text: {
              const { learnedWordsToday } = this.state.stats;
              const { mistakesInCurrentWord } = this.state.stats.additional;
              if (mistakesInCurrentWord === 0) {
                this.state.learnedWordsToday = (learnedWordsToday - 1 < 0)
                  ? 0
                  : learnedWordsToday - 1;
              }
              this.addWordToTheCurrentTraining();
              this.state.stats.additional.mistakesInCurrentWord = 0;
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

          await this.setStatisticsData();
          await this.checkIfDailyNormCompleted();
          this.preloader.hide();
          this.wordsSelectList.enable();
          this.renderNextWordCard();
          this.state.audio.pause();
        }
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
      const message = this.getMessageForWords();
      mainContainer.append(MainGame.showMessage(message));
      if (this.formControl) {
        this.formControl.hide();
      }
    } else {
      this.toggleControlElements(false);
      if (userAnswerHTML) {
        userAnswerHTML.innerHTML = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
      }

      this.state.currentWordIndex += 1;
      this.progressBar.show();
      this.renderWordCard(currentWordsArray[this.state.currentWordIndex]);
    }
  }

  getMessageForWords() {
    const { maxCardsPerDay } = this.settings.getSettingsByGroup('main');
    let { learnedWords } = this.statistics.getGameStatistics(MAIN_GAME_CODE);
    learnedWords = learnedWords || 0;
    const { currentWordsType } = this.state;

    const message = (maxCardsPerDay === learnedWords
      && currentWordsType !== ONLY_DIFFICULT_WORDS)
      ? DAILY_NORM_IS_COMPLETED
      : EMPTY_WORD_LIST;
    return message;
  }

  activateNextButton() {
    document.querySelector('.main-game').addEventListener('submit', async (event) => {
      if (event.target.classList.contains('main-game__form')) {
        event.preventDefault();
        this.switchToTheNextWordCard();
      }
    });
  }

  activateShowAnswerButton() {
    const { showButtonShowAnswer } = this.settings.getSettingsByGroup('main');
    if (!showButtonShowAnswer) return;

    document.querySelector('.main-game').addEventListener('click', async (event) => {
      const target = event.target.closest('.main-game__show-answer-button');

      if (target) {
        this.switchToTheNextWordCard(true);
        await this.setStatisticsData();
      }
    });
  }

  toggleVocabularyButtons(isToShow = true) {
    const { showButtonDelete, showButtonHard } = this.settings.getSettingsByGroup('main');
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
    document.querySelector('.main-game').addEventListener('click', async (event) => {
      const { showButtonDelete, showButtonHard } = this.settings.getSettingsByGroup('main');
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
    this.preloader.show();
    this.toggleVocabularyButtons(false);
    await this.checkIfDailyNormCompleted();
    target.textContent = activeButtonText;
    const buttonType = this.getButtonTypeOfCurrentWord();
    await this.addWordToTheVocabulary(vocbularyType, buttonType);
    this.updateProgressBar();
    this.renderNextWordCard();
    await this.setStatisticsData();
    this.wordsSelectList.enable();
    this.state.audio.pause();
    this.preloader.hide();

    setTimeout(() => {
      target.textContent = buttonText;
    }, 1500);
  }

  async checkIfDailyNormCompleted() {
    if (this.checkIfCurrentWordIsNotLast()) {
      await this.renderDailyStatistics();
    }
  }

  getButtonTypeOfCurrentWord() {
    const currentWord = this.state.currentWordsArray[this.state.currentWordIndex];
    const wordFromBackend = this.state.userWords.length
      && this.state.userWords.find((word) => word.wordId === currentWord.id);
    return wordFromBackend && wordFromBackend.difficulty;
  }

  async addWordToTheVocabulary(
    vocabularyType = WORDS_TO_LEARN_TITLE, estimation = GOOD.text, wordToAdd,
  ) {
    const currentWord = wordToAdd || this.state.currentWordsArray[this.state.currentWordIndex];
    const wordForVocabulary = ('optinal' in currentWord) ? currentWord.optional.allData : currentWord;

    await this.vocabulary.addWordToTheVocabulary(wordForVocabulary, vocabularyType, estimation);
    this.state.userWords = await this.getAllUserWordsFromBackend();
    this.state.stats.additional.mistakesInCurrentWord = 0;
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
    document.querySelector('.main-game').addEventListener('click', (event) => {
      const inputHTML = document.querySelector('.word-card__input');
      const target = event.target.closest('.word-card__user-answer');
      if (target && inputHTML) {
        inputHTML.focus();
      }
    });

    document.querySelector('.main-game').addEventListener('input', (event) => {
      const userAnswerHTML = document.querySelector('.word-card__user-answer');
      const target = event.target.closest('.word-card__input');
      if (target && userAnswerHTML && userAnswerHTML.childElementCount > 0) {
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
      const audioFile = this.state.audios[firstAudioIndex];
      if (audioFile) {
        this.playAudio(audioFile);
      }

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
    } = this.settings.getSettingsByGroup('main');
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
    const {
      showWordMeaning,
      showWordExample,
    } = this.settings.getSettingsByGroup('main');

    const audioMeaning = showWordMeaning
      ? `${WORDS_AUDIOS_URL}${currentWord.audioMeaning}` : null;
    const audioExample = showWordExample
      ? `${WORDS_AUDIOS_URL}${currentWord.audioExample}` : null;
    if (currentWord) {
      this.state.audios = [
        `${WORDS_AUDIOS_URL}${currentWord.audio}`,
        audioMeaning,
        audioExample,
      ];
    }
  }
}

export default MainGame;
