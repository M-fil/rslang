import create, {
  vocabularyConstants,
  getAllUserWords,
} from './pathes';

import VocabularyHeader from './components/vocabulary-header/VocabularyHeader';
import WordsToLearnVocabulary from './components/vocabulary-types/WordsToLearnVocabulary';
import LearnedWordsVocabulary from './components/vocabulary-types/LearnedWordsVocabulary';
import RemovedWords from './components/vocabulary-types/RemovedWords';
import DifficultWordsVocabulary from './components/vocabulary-types/DifficultWordsVocabulary';

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
  REMOVED_WORDS_TITLE,
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

class Vocabulary {
  constructor(userState) {
    this.container = null;

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

    return this.container;
  }

  async sortWordsInVocabularies() {
    const { userId, token } = Vocabulary.getUserDataForAuthorization();
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
    const vocabulary = vocabularyClass
    this.mainContentHTML.innerHTML = '';
    this.mainContentHTML.append(vocabulary.render());
  }

  activateVocabularyHeaderButtons() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.vocabulary__header-item')
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

  static getUserDataForAuthorization() {
    const savedUserData = localStorage.getItem('user-data');
    if (savedUserData) {
      return JSON.parse(savedUserData);
    }

    return {
      userId: this.userState.userId,
      token: this.userState.token,
    };
  }
}

export default Vocabulary;
