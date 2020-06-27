import create, { vocabularyConstants } from '../../pathes';

import VocabularyItem from './VocabularyItem';

const {
  RESTORE_BUTTON_TEXT,
} = vocabularyConstants;

class ShortenVocabularyItem extends VocabularyItem {
  constructor(id, word, wordTranslate, transcription, vocabularyType) {
    super(id, word, wordTranslate, transcription, vocabularyType);
    this.HTML = null;
  }

  render() {
    this.HTML = create(
      'div', 'vocabulary__extra-word-item', '', null,
      ['vocabularyWordId', this.id], ['vocabularyType', this.vocabularyType],
    );
    const [audioBlock, mainHTML] = this.renderMainContent();
    const restoreButtonHTML = create('button', 'word-item__restore-button', RESTORE_BUTTON_TEXT);
    this.HTML.append(audioBlock, mainHTML, restoreButtonHTML);

    return this.HTML;
  }
}

export default ShortenVocabularyItem;