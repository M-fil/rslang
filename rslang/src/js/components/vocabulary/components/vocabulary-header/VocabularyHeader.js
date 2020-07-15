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
    this.container.append(this.renderExitButton());

    return this.container;
  }

  renderExitButton() {
    this.exitButton = create(
      'span', 'vocabulary__exit-button',
      null, null,
      ['id', 'button-go-to-main-page'],
    );
    return this.exitButton;
  }

  renderHeaderItem(innerText) {
    create(
      'button', 'vocabulary__header-item', innerText, this.container,
      ['type', 'button'], ['vocabularyType', innerText],
    );
  }
}

export default VocabularyHeader;
