import create, {
  vocabularyConstants,
  getAllUserWords,
  updateUserWord,
  playAudio,
  urls,
} from './pathes';

import VocabularyHeader from './components/vocabulary-header/VocabularyHeader';
import WordsToLearnVocabulary from './components/vocabulary-types/WordsToLearnVocabulary';
import LearnedWordsVocabulary from './components/vocabulary-types/LearnedWordsVocabulary';
import RemovedWords from './components/vocabulary-types/RemovedWords';
import DifficultWordsVocabulary from './components/vocabulary-types/DifficultWordsVocabulary';
import MainGame from '../main-game/MainGame';
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
      vocabularies: {
        wordsToLearn: [],
        learnedWords: [],
        removedWords: [],
        difficultWords: [],
      },
      userState,
    };
  }

  render() {
    this.container = create('div', 'vocabulary');
    const vocabularyHeader = new VocabularyHeader();
    this.container.append(vocabularyHeader.render());
    this.mainContentHTML = create('div', 'vocabulary__main-content', '', this.container);

    this.sortWordsInVocabularies();
    this.activateVocabularyHeaderButtons();
    this.activateAudioButtons();
    this.activateRestoreButtons();

    return this.container;
  }

  updateWords(words) {
    this.state.allUserWords = words;
    this.sortWordsInVocabularies();
  }

  async sortWordsInVocabularies() {
    const { userId, token } = this.getUserDataForAuthorization();
    const allWords = await getAllUserWords(userId, token);
    this.state.allUserWords = allWords;

    this.state.vocabularies.wordsToLearn = this.getWordByVocabularyType(WORDS_TO_LEARN_TITLE);
    this.state.vocabularies.learnedWords = this.getWordByVocabularyType(LEARNED_WORDS_TITLE);
    this.state.vocabularies.removedWords = this.getWordByVocabularyType(REMOVED_WORDS_TITLE);
    this.state.vocabularies.difficultWords = this.getWordByVocabularyType(DIFFUCULT_WORDS_TITLE);

    const vocabulary = new WordsToLearnVocabulary(this.state.vocabularies.wordsToLearn);
    this.renderVocabulary(vocabulary);
  }

  getWordByVocabularyType(vocabularyType) {
    return this.state.allUserWords.filter((word) => word.optional.vocabulary === vocabularyType);
  }

  renderVocabulary(vocabularyClass) {
    const vocabulary = vocabularyClass;
    this.mainContentHTML.innerHTML = '';
    this.mainContentHTML.append(vocabulary.render());
  }

  activateVocabularyHeaderButtons() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.vocabulary__header-item');
      if (target) {
        const targetVocabularyType = target.dataset.vocabularyType;
        const {
          wordsToLearn, learnedWords, removedWords, difficultWords,
        } = this.state.vocabularies;

        switch (targetVocabularyType) {
          case WORDS_TO_LEARN_TITLE:
          default: {
            const vocabulary = new WordsToLearnVocabulary(wordsToLearn);
            this.renderVocabulary(vocabulary);
            break;
          }
          case LEARNED_WORDS_TITLE: {
            const vocabulary = new LearnedWordsVocabulary(learnedWords);
            this.renderVocabulary(vocabulary);
            break;
          }
          case REMOVED_WORDS_TITLE: {
            const vocabulary = new RemovedWords(removedWords);
            this.renderVocabulary(vocabulary);
            break;
          }
          case DIFFUCULT_WORDS_TITLE: {
            const vocabulary = new DifficultWordsVocabulary(difficultWords);
            this.renderVocabulary(vocabulary);
            break;
          }
        }
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
          const dataToUpdate = await MainGame.createWordDataForBackend(
            allData, difficulty, true, WORDS_TO_LEARN_TITLE,
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

      if (target) {
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
