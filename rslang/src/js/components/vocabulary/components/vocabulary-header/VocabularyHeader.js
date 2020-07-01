import create, { vocabularyConstants } from '../../pathes';

const {
  LEARNED_WORDS_TITLE,
  WORDS_TO_LEARN_TITLE,
  REMOVED_WORDS_TITLE,
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

class VocabularyHeader {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'vocabulary__header');
    this.renderHeaderItem(LEARNED_WORDS_TITLE);
    this.renderHeaderItem(WORDS_TO_LEARN_TITLE);
    this.renderHeaderItem(REMOVED_WORDS_TITLE);
    this.renderHeaderItem(DIFFUCULT_WORDS_TITLE);

    return this.container;
  }

  renderHeaderItem(innerText) {
    create(
      'button', 'vocabulary__header-item', innerText, this.container,
      ['type', 'button'], ['vocabularyType', innerText],
    );
  }
}

export default VocabularyHeader;
