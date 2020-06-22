import create, { vocabularyConstants } from '../../pathes';
import VocabularyItem from '../vocabulary-item/VocabularyItem';

const {
  NUMBER_OF_WORDS_TEXT,
  EMPTY_VOCABULARY_MESSAGE,
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

  static getEmptyVocabularyMessage() {
    return create('div', 'vocbulary__message', EMPTY_VOCABULARY_MESSAGE);
  }

  renderVocabularyItems() {
    const container = create('div', 'vocabulary__words-list');

    if (!this.words.length) {
      const messageHTML = MainVocabulary.getEmptyVocabularyMessage();
      container.append(messageHTML);
      return container;
    }

    this.words
      .map((word) => JSON.parse(word.optional.allData))
      .forEach((word) => {
        const wordItem = new VocabularyItem(
          word.id,
          word.word,
          word.wordTranslate,
          word.transcription,
          word.textMeaning,
          word.textExample,
          word.image,
        );
        container.append(wordItem.render());
      });

    return container;
  }
}

export default MainVocabulary;
