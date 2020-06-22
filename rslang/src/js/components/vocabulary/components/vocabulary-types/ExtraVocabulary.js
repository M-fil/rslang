import create from '../../pathes';
import MainVocabulary from './MainVocabulary';
import ShortenVocabularyItem from '../vocabulary-item/ShortenVocabularyItem';

class ExtraVocabulary extends MainVocabulary {
  constructor(title, words) {
    super(title, words);
    this.title = title;
  }

  render() {
    this.container = create('div', 'vocabulary');
    this.container.append(
      this.renderVocabularyTitle(),
      this.renderVocabularyItems(),
    );

    return this.container;
  }

  renderVocabularyItems() {
    const wordsHTML = this.words.map((word) => {
      const wordItem = new ShortenVocabularyItem(
        word.id,
        word.word,
        word.wordTranslate,
        word.transcription,
      );
      return wordItem.render();
    });
    const container = create('div', 'vocabulary__words-list', wordsHTML);

    return container;
  }
}

export default ExtraVocabulary;
