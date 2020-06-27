import create, {
  vocabularyConstants,
  getAllUserWords,
  updateUserWord,
  playAudio,
  urls,
  createWordDataForBackend,
  getUserSettings,
} from './pathes';

import VocabularyHeader from './components/vocabulary-header/VocabularyHeader';
import WordsToLearnVocabulary from './components/vocabulary-types/WordsToLearnVocabulary';
import LearnedWordsVocabulary from './components/vocabulary-types/LearnedWordsVocabulary';
import RemovedWords from './components/vocabulary-types/RemovedWords';
import DifficultWordsVocabulary from './components/vocabulary-types/DifficultWordsVocabulary';
import Preloader from '../preloader/Preloader';

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
  REMOVED_WORDS_TITLE,
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

const {
  WORDS_AUDIOS_URL,
} = urls;

class Vocabulary {
  constructor(userState) {
    this.container = null;
    this.audio = new Audio();

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
      settings: {},
    };
  }

  async render() {
    this.container = create('div', 'vocabulary');
    const vocabularyHeader = new VocabularyHeader();
    this.container.append(vocabularyHeader.render());
    this.mainContentHTML = create('div', 'vocabulary__main-content', '', this.container);

    await this.setSettings();
    await this.sortWordsInVocabularies();
    this.activateVocabularyHeaderButtons();
    this.activateAudioButtons();
    this.activateRestoreButtons();

    return this.container;
  }

  async setSettings() {
    const { id, token } = this.state.userState;
    this.state.settings = await getUserSettings(id, token);
  }

  updateWords(words) {
    this.state.allUserWords = words;
    this.sortWordsInVocabularies();
  }

  async sortWordsInVocabularies() {
    const { userId, token } = this.getUserDataForAuthorization();
    const allWords = await getAllUserWords(userId, token);
    this.state.allUserWords = allWords;

    this.state.vocabularies.wordsToLearn = this.getWordsByVocabularyType(WORDS_TO_LEARN_TITLE);
    this.state.vocabularies.learnedWords = this.getWordsByVocabularyType(LEARNED_WORDS_TITLE);
    this.state.vocabularies.removedWords = this.getWordsByVocabularyType(REMOVED_WORDS_TITLE);
    this.state.vocabularies.difficultWords = this.getWordsByVocabularyType(DIFFUCULT_WORDS_TITLE);

    const { dictionary } = this.state.settings.optional;
    const { wordsToLearn } = this.state.vocabularies;
    const vocabulary = new WordsToLearnVocabulary(wordsToLearn, dictionary);
    this.renderVocabulary(vocabulary);
  }

  getWordsByVocabularyType(vocabularyType) {
    return this.state.allUserWords.filter((word) => word.optional.vocabulary === vocabularyType);
  }

  renderVocabulary(vocabularyClass) {
    const vocabulary = vocabularyClass;
    this.mainContentHTML.innerHTML = '';
    this.mainContentHTML.append(vocabulary.render());
  }

  activateVocabularyHeaderButtons() {
    document.addEventListener('click', async (event) => {
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
        const { dictionary } = this.state.settings.optional;
        console.log('dictionary', dictionary)
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
    document.addEventListener('click', async (event) => {
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
          const { difficulty, wordId } = targetWordObject;
          const allData = JSON.parse(targetWordObject.optional.allData);

          const { id, token } = this.state.userState;
          const dataToUpdate = await createWordDataForBackend(
            allData, difficulty, true, WORDS_TO_LEARN_TITLE, this.state.settings,
          );
          await updateUserWord(id, wordId, dataToUpdate, token);
          this.state.allUserWords = await getAllUserWords(id, token);

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
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word-item__audio');
      const { showAudioExample } = this.state.settings.optional.dictionary;

      if (target && showAudioExample) {
        const { targetWordObject } = this.getWordObjectByTargetElement(target);
        const allData = JSON.parse(targetWordObject.optional.allData);
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
}

export default Vocabulary;
