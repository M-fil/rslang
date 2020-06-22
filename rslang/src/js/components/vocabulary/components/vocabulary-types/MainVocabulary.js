import create from '../../pathes';
import { vocabularyConstants } from '../../pathes';

const {
  NUMBER_OF_WORDS_TEXT,
} = vocabularyConstants;

class MainVocabulary {
  constructor(vacabularyTitle, words) {
    this.container = null;
    this.vacabularyTitle = vacabularyTitle;
    this.words = words;
  }

  render() {
    this.container = create('div', 'vocabulary');
  }

  renderVocabularyTitle() {
    const titleContainer = create('div', 'vocabulary__title-container');
    create('div', 'vocabulary__title', this.vacabularyTitle, titleContainer);
    create('div', 'vocabulary__words-count', `${NUMBER_OF_WORDS_TEXT}${this.words.length}(10)`, titleContainer);

    return titleContainer;
  }
}

export default MainVocabulary;
