import create from '../../../../utils/сreate';
import { mainGameStrings, wordsToLearnOptions } from '../../../../constants/constants';

const {
  WORDS_TYPES_SELECT_TITLE,
} = mainGameStrings;

class WordsSelectList {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'main-game__select-container');
    create('h3', 'main-game__select-title', WORDS_TYPES_SELECT_TITLE, this.HTML);
    create(
      'select', 'main-game__words-type-select',
      Object.values(wordsToLearnOptions).map((item) => WordsSelectList.renderOption(item)),
      this.HTML,
    );

    return this.HTML;
  }

  static renderOption(value) {
    return create(
      'option', 'main-game__select-option', value, null, ['value', value]
    );
  }
}

export default WordsSelectList;
