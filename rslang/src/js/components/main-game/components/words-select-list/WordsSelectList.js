import create from '../../../../utils/сreate';
import { mainGameConstants, wordsToLearnOptions } from '../../../../constants/constants';

const {
  WORDS_TYPES_SELECT_TITLE,
} = mainGameConstants;

class WordsSelectList {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'main-game__select-container');
    create('div', 'main-game__select-title', WORDS_TYPES_SELECT_TITLE, this.HTML);
    this.select = create(
      'select', 'main-game__words-type-select',
      Object.values(wordsToLearnOptions).map((item) => WordsSelectList.renderOption(item)),
      this.HTML,
    );

    return this.HTML;
  }

  static renderOption(value) {
    return create(
      'option', 'main-game__select-option', value, null, ['value', value],
    );
  }

  disable() {
    this.select.setAttribute('disabled', 'disabled');
  }

  enable() {
    this.select.removeAttribute('disabled');
  }
}

export default WordsSelectList;
