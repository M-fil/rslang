import create, {
  vocabularyConstants,
  dateFormat,
} from '../../pathes';
import VocabularyItem from '../vocabulary-item/VocabularyItem';
import { addDaysToTheDate } from '../../../main-game/pathes';

const {
  NUMBER_OF_WORDS_TEXT,
  EMPTY_VOCABULARY_MESSAGE,
} = vocabularyConstants;

class MainVocabulary {
  constructor(vacabularyTitle, words, settings) {
    this.container = null;
    this.vacabularyTitle = vacabularyTitle;
    this.words = words;
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

  renderVocabularyTitle() {
    const titleContainer = create('div', 'vocabulary__title-container');
    create('div', 'vocabulary__title', this.vacabularyTitle, titleContainer);
    this.numberOfWordsText = create(
      'div', 'vocabulary__words-count',
      `${NUMBER_OF_WORDS_TEXT}: ${this.words.length}`,
      titleContainer,
    );

    return titleContainer;
  }

  updateVocabularyTextLength(newWordsLength) {
    this.numberOfWordsText.innerHTML = `${NUMBER_OF_WORDS_TEXT}: ${newWordsLength}`;
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
      .forEach((word) => {
        const { allData } = word.optional;
        const { daysInterval, valuationDate } = word.optional;
        const date = addDaysToTheDate(daysInterval, valuationDate);
        const nextTimeOfReivise = MainVocabulary.createStandardDateFormat(new Date(date));
        const wordItem = new VocabularyItem(
          allData.id || allData._id,
          allData.word,
          allData.wordTranslate,
          allData.transcription,
          allData.textMeaning,
          allData.textExample,
          allData.image,
          nextTimeOfReivise,
          this.vacabularyTitle,
          this.settings,
        );
        container.append(wordItem.render());
      });

    return container;
  }

  static createStandardDateFormat(date) {
    return dateFormat(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }
}

export default MainVocabulary;
