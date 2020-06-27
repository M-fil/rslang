import create from '../../pathes';
import MainVocabulary from './MainVocabulary';
import ShortenVocabularyItem from '../vocabulary-item/ShortenVocabularyItem';

class ExtraVocabulary extends MainVocabulary {
  constructor(title, words, settings) {
    super(title, words, settings);
    this.word = words;
    this.title = title;
    this.settings = settings;
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
    const container = create('div', 'vocabulary__words-list');

    console.log('this.settings', this.settings);
    if (!this.words.length) {
      const messageHTML = MainVocabulary.getEmptyVocabularyMessage();
      container.append(messageHTML);
      return container;
    }

    this.words.forEach((word) => {
      const allData = JSON.parse(word.optional.allData);
      const wordId = word.wordId || allData.id || allData._id;
      const {
        word: wordText, wordTranslate, transcription,
      } = allData;
      const wordItem = new ShortenVocabularyItem(
        wordId, wordText, wordTranslate,
        transcription, this.title, this.settings,
      );
      container.append(wordItem.render());
    });

    return container;
  }
}

export default ExtraVocabulary;
