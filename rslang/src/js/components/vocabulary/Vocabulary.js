import create, {
  vocabularyConstants,
  getAllUserWords,
  updateUserWord,
  createUserWord,
  playAudio,
  urls,
  estimateButtonsTypes,
  addDaysToTheDate,
  dateFormat,
} from './pathes';

import VocabularyHeader from './components/vocabulary-header/VocabularyHeader';
import WordsToLearnVocabulary from './components/vocabulary-types/WordsToLearnVocabulary';
import LearnedWordsVocabulary from './components/vocabulary-types/LearnedWordsVocabulary';
import RemovedWords from './components/vocabulary-types/RemovedWords';
import DifficultWordsVocabulary from './components/vocabulary-types/DifficultWordsVocabulary';
import Preloader from '../preloader/Preloader';
import Settings from '../settings/Settings';

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
  REMOVED_WORDS_TITLE,
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

const {
  WORDS_AUDIOS_URL,
} = urls;

const {
  GOOD, EASY, HARD,
} = estimateButtonsTypes;

class Vocabulary {
  constructor(userState) {
    if (typeof Vocabulary.instance === 'object') {
      return Vocabulary.instance;
    }
    this.container = null;
    this.audio = new Audio();
    this.settings = new Settings(userState);

    Vocabulary.instance = this;
    this.state = {
      allUserWords: [],
      currentVocabulary: WORDS_TO_LEARN_TITLE,
      vocabularies: {
        wordsToLearn: [],
        learnedWords: [],
        removedWords: [],
        difficultWords: [],
      },
      userState,
    };
    return this;
  }

  async init() {
    await this.settings.init();
    await this.sortWordsInVocabularies();
  }

  async render() {
    this.container = create('div', 'vocabulary-container');
    const vocabularyHeader = new VocabularyHeader();
    this.container.append(vocabularyHeader.render());
    this.mainContentHTML = create('div', 'vocabulary__main-content', '', this.container);

    this.renderInitialVocabulary();
    this.activateVocabularyHeaderButtons();
    this.activateAudioButtons();
    this.activateRestoreButtons();
    this.actionsOnListComponent();

    return this.container;
  }

  getDaysIntervalByEstimation(estimation) {
    const {
      intervalEasy,
      intervalNormal,
      intervalDifficult,
    } = this.settings.getSettingsByGroup('main');

    switch (estimation) {
      case EASY:
      default:
        return intervalEasy;
      case GOOD:
        return intervalNormal;
      case HARD:
        return intervalDifficult;
    }
  }

  static createStandardDateFormat(date) {
    return dateFormat(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  createWordDataForBackend(
    currentWord, estimation, vocabulary = WORDS_TO_LEARN_TITLE,
  ) {
    const daysInterval = this.getDaysIntervalByEstimation(estimation);
    const nextTimeOfReivise = addDaysToTheDate(daysInterval, new Date());
    const wordData = {
      id: currentWord.id || currentWord._id,
      word: currentWord.word,
      difficulty: estimation.text || GOOD.text,
      vocabulary,
      daysInterval,
      valuationDate: new Date(),
      nextTimeOfReivise,
      allData: currentWord,
    };
    const {
      id: wordId, word, difficulty, valuationDate, allData,
    } = wordData;
    const dataToRecieve = {
      difficulty,
      optional: {
        wordId,
        word,
        daysInterval,
        vocabulary,
        valuationDate: valuationDate.toString(),
        allData: JSON.stringify(allData),
      },
    };

    return dataToRecieve;
  }

  async addWordToTheVocabulary(
    word, vocabularyType = WORDS_TO_LEARN_TITLE, estimation = GOOD.text,
  ) {
    const { userId, token } = this.state.userState;
    try {
      const data = await this.createWordDataForBackend(word, estimation, vocabularyType);
      const { wordId } = data.optional;
      await updateUserWord(userId, wordId, data, token);
      await this.sortWordsInVocabularies();
    } catch (error) {
      const data = await this.createWordDataForBackend(word, estimation, vocabularyType);
      const { wordId } = data.optional;
      await createUserWord(userId, wordId, data, token);
      await this.sortWordsInVocabularies();
    }
  }

  updateWords(words) {
    this.state.allUserWords = words;
    this.sortWordsInVocabularies();
  }

  async sortWordsInVocabularies() {
    const { userId, token } = this.state.userState;
    const allWords = await getAllUserWords(userId, token);
    this.state.allUserWords = allWords;
    this.state.allUserWords = this.parseUserWordsData();

    this.state.vocabularies.wordsToLearn = this.getWordsByVocabularyType(WORDS_TO_LEARN_TITLE);
    this.state.vocabularies.learnedWords = this.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
    this.state.vocabularies.removedWords = this.getWordsByVocabularyType(REMOVED_WORDS_TITLE);
    this.state.vocabularies.difficultWords = this.getWordsByVocabularyType(DIFFUCULT_WORDS_TITLE);
  }

  parseUserWordsData() {
    return this.state.allUserWords.map((item) => ({
      ...item,
      optional: {
        ...item.optional,
        valuationDate: new Date(item.optional.valuationDate),
        daysInterval: parseInt(item.optional.daysInterval, 10),
        allData: JSON.parse(item.optional.allData),
      },
    }));
  }

  renderInitialVocabulary() {
    const dictionary = this.settings.getSettingsByGroup('dictionary');
    const { wordsToLearn } = this.state.vocabularies;
    const vocabulary = new WordsToLearnVocabulary(wordsToLearn, dictionary);
    this.renderVocabulary(vocabulary);
  }

  getWordsByVocabularyType(vocabularyType, getNormalObject = false) {
    const wordsArr = this.state.allUserWords
      .filter((word) => word.optional.vocabulary === vocabularyType);
    return (getNormalObject) ? wordsArr.map((word) => word.optional.allData) : wordsArr;
  }

  getAllVocabulariesData(getNormalObjects = false) {
    let vocabulariesWordsObject;
    if (getNormalObjects) {
      vocabulariesWordsObject = {
        wordsToLearn: this.state.vocabularies.wordsToLearn.map((word) => word.optional.allData),
        learnedWords: this.state.vocabularies.learnedWords.map((word) => word.optional.allData),
        removedWords: this.state.vocabularies.removedWords.map((word) => word.optional.allData),
        difficultWords: this.state.vocabularies.difficultWords.map((word) => word.optional.allData),
      };
    } else {
      vocabulariesWordsObject = this.state.vocabularies;
    }
    return vocabulariesWordsObject;
  }

  getAllVocabulariesData(getNormalObjects = false) {
    let vocabulariesWordsObject;
    if (getNormalObjects) {
      vocabulariesWordsObject = {
        wordsToLearn: this.state.vocabularies.wordsToLearn.map((word) => word.optional.allData),
        learnedWords: this.state.vocabularies.learnedWords.map((word) => word.optional.allData),
        removedWords: this.state.vocabularies.removedWords.map((word) => word.optional.allData),
        difficultWords: this.state.vocabularies.difficultWords.map((word) => word.optional.allData),
      };
    } else {
      vocabulariesWordsObject = this.state.vocabularies;
    }
    return vocabulariesWordsObject;
  }

  getVocabularyWordsLength(vocabularyType) {
    return this.state.allUserWords
      .filter((word) => word.optional.vocabulary === vocabularyType)
      .length;
  }

  getAllUserWordsLength() {
    return this.state.allUserWords.length;
  }

  renderVocabulary(vocabularyClass) {
    const vocabulary = vocabularyClass;
    this.mainContentHTML.innerHTML = '';
    this.mainContentHTML.append(vocabulary.render());
  }

  activateVocabularyHeaderButtons() {
    console.log('this.container');
    this.container.addEventListener('click', async (event) => {
      console.log('addEventListener');
      const target = event.target.closest('.vocabulary__header-item');
      const targetVocabularyType = target && target.dataset.vocabularyType;
      if (target && targetVocabularyType !== this.state.currentVocabulary) {
        const {
          wordsToLearn, learnedWords, removedWords, difficultWords,
        } = this.state.vocabularies;

        this.preloader = new Preloader();
        this.preloader.render();
        this.preloader.show();
        await this.sortWordsInVocabularies();
        const dictionary = this.settings.getSettingsByGroup('dictionary');

        switch (targetVocabularyType) {
          case WORDS_TO_LEARN_TITLE:
          default: {
            const vocabulary = new WordsToLearnVocabulary(wordsToLearn, dictionary);
            this.renderVocabulary(vocabulary);
            break;
          }
          case LEARNED_WORDS_TITLE: {
            const vocabulary = new LearnedWordsVocabulary(learnedWords, dictionary);
            this.renderVocabulary(vocabulary);
            break;
          }
          case REMOVED_WORDS_TITLE: {
            const vocabulary = new RemovedWords(removedWords, dictionary);
            this.renderVocabulary(vocabulary);
            break;
          }
          case DIFFUCULT_WORDS_TITLE: {
            const vocabulary = new DifficultWordsVocabulary(difficultWords, dictionary);
            this.renderVocabulary(vocabulary);
            break;
          }
        }
        this.state.currentVocabulary = targetVocabularyType;
        this.preloader.hide();
      }
    });
  }

  activateRestoreButtons() {
    this.container.addEventListener('click', async (event) => {
      const target = event.target.closest('.word-item__restore-button');

      if (target) {
        try {
          this.preloader = new Preloader();
          this.preloader.render();
          this.preloader.show();
          const {
            targetWordObject,
            targetWordHTML,
          } = this.getWordObjectByTargetElement(target);
          const { valuationDate } = targetWordObject.optional;

          const { userId, token } = this.state.userState;
          await this.addWordToTheVocabulary(targetWordObject, WORDS_TO_LEARN_TITLE, valuationDate);
          this.state.allUserWords = await getAllUserWords(userId, token);

          this.updateVocabularyAfterRestoreButtonClick(targetWordObject);
          targetWordHTML.remove();
          this.preloader.hide();
        } catch (error) {
          this.preloader.hide();
        }
      }
    });
  }

  updateVocabularyAfterRestoreButtonClick(targetWordObject) {
    const { removedWords, difficultWords } = this.state.vocabularies;

    if (targetWordObject.optional.vocabulary === REMOVED_WORDS_TITLE) {
      this.state.vocabularies.removedWords = removedWords
        .filter((word) => word.wordId !== targetWordObject.wordId);
      this.state.vocabularies.wordsToLearn.unshift(targetWordObject);
    }

    if (targetWordObject.optional.vocabulary === DIFFUCULT_WORDS_TITLE) {
      this.state.vocabularies.difficultWords = difficultWords
        .filter((word) => word.wordId !== targetWordObject.wordId);
      this.state.vocabularies.wordsToLearn.unshift(targetWordObject);
    }
  }

  activateAudioButtons() {
    this.container.addEventListener('click', (event) => {
      const target = event.target.closest('.word-item__audio');
      const { showAudioExample } = this.settings.getSettingsByGroup('dictionary');

      if (target && showAudioExample) {
        const { targetWordObject } = this.getWordObjectByTargetElement(target);
        const { allData } = targetWordObject.optional;
        const source = `${WORDS_AUDIOS_URL}${allData.audio}`;

        playAudio(source, this.audio);
      }
    });
  }

  getWordObjectByTargetElement(target) {
    const wordCardHTML = target.closest('.vocabulary__word-item');
    const extraWordCardHTML = target.closest('.vocabulary__extra-word-item');
    const targetWordId = (wordCardHTML && wordCardHTML.dataset.vocabularyWordId)
      || (extraWordCardHTML && extraWordCardHTML.dataset.vocabularyWordId);
    const targetWordObject = this.state.allUserWords.find((word) => word.wordId === targetWordId);

    return { targetWordObject, targetWordHTML: wordCardHTML || extraWordCardHTML };
  }

  actionsOnListComponent() {
    this.container.addEventListener('click', (event) => {
      if (event.target.classList.contains('word-item__main')) {
        const parent = event.target.parentNode;
        event.target.classList.toggle('active-vocword-button');
        parent.childNodes[1].classList.toggle('active-vocword');
      } else if (event.target.parentNode.classList.contains('word-item__main-info')) {
        const parent = event.target.parentNode.parentNode.parentNode;
        event.target.parentNode.parentNode.classList.toggle('active-vocword-button');
        parent.childNodes[1].classList.toggle('active-vocword');
      }
    });
  }
}

export default Vocabulary;
