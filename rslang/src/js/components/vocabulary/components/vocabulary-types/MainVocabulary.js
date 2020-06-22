import create, { vocabularyConstants } from '../../pathes';
import VocabularyItem from '../vocabulary-item/VocabularyItem';

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
    this.container.append(
      this.renderVocabularyTitle(),
      this.renderVocabularyItems(),
    );

    return this.container;
  }

  renderVocabularyTitle() {
    const titleContainer = create('div', 'vocabulary__title-container');
    create('div', 'vocabulary__title', this.vacabularyTitle, titleContainer);
    create('div', 'vocabulary__words-count', `${NUMBER_OF_WORDS_TEXT}${this.words.length}(10)`, titleContainer);

    return titleContainer;
  }

  renderVocabularyItems() {
    const wordsHTML = this.words.map((word) => {
      const wordItem = new VocabularyItem(
        word.id,
        word.word,
        word.wordTranslate,
        word.transcription,
        word.textMeaning,
        word.textExample,
        word.image,
      );
      return wordItem.render();
    });
    const container = create('div', 'vocabulary__words-list', wordsHTML);

    return container;
  }
}

export default MainVocabulary;
