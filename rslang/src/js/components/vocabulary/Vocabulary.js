import create, { vocabularyConstants } from './pathes';
import VocabularyHeader from './components/vocabulary-header/VocabularyHeader';

class Vocabulary {
  constructor() {
    this.container = null;
    this.state = {
      vacabularies: {
        wordsToLearn: [],
        learnedWords: [],
        removedWords: [],
        difficultWords: [],
      };
    }
  }

  render() {
    this.container = create('div', 'vocabulary');
    const vocabularyHeader = new VocabularyHeader();
    this.container.append(vocabularyHeader.render());
  }
}

export default Vocabulary;
