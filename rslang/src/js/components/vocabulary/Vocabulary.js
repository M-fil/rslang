import create, { vocabularyConstants } from './pathes';

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
  constructor(words) {
    this.words = words;
    this.container = null;
    this.state = {
      vacabularies: {
        wordsToLearn: [],
        learnedWords: [],
        removedWords: [],
        difficultWords: [],
      },
    };
  }

  render() {
    this.container = create('div', 'vocabulary');
    const vocabularyHeader = new VocabularyHeader();
    this.container.append(vocabularyHeader.render());
    this.mainContentHTML = create('div', 'vocabulary__main-content', '', this.container);
    this.activateVocabularyHeaderButtons();

    return this.container;
  }

  activateVocabularyHeaderButtons() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.vocabulary__header-item')
      if (target) {
        const targetVocabularyType = target.dataset.vocabularyType;
        switch (targetVocabularyType) {
          case WORDS_TO_LEARN_TITLE:
          default: {
            const vocabulary = new WordsToLearnVocabulary(this.words);
            this.mainContentHTML.innerHTML = '';
            this.mainContentHTML.append(vocabulary.render());
            break;
          }
          case LEARNED_WORDS_TITLE: {
            const vocabulary = new LearnedWordsVocabulary(this.words);
            this.mainContentHTML.innerHTML = '';
            this.mainContentHTML.append(vocabulary.render());
            break;
          }
          case REMOVED_WORDS_TITLE: {
            const vocabulary = new RemovedWords(this.words);
            this.mainContentHTML.innerHTML = '';
            this.mainContentHTML.append(vocabulary.render());
            break;
          }
          case DIFFUCULT_WORDS_TITLE: {
            const vocabulary = new DifficultWordsVocabulary(this.words);
            this.mainContentHTML.innerHTML = '';
            this.mainContentHTML.append(vocabulary.render());
            break;
          }
        }
      }
    });
  }
}

export default Vocabulary;
