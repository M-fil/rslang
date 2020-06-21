import create from '../../../utils/сreate';
import {
  wordsToLearnSelectConstants,
} from '../../../constants/constants';

const {
  SELECT_TITLE,
  SELECT_OPTION_1,
  SELECT_OPTION_2,
} = wordsToLearnSelectConstants; 

class WordsToLearnSelect {
  constructor(containerClassNameType) {
    this.containerClassNameType = containerClassNameType;
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', `select__container ${this.containerClassNameType}__container`);
    create('div', `select__title ${this.containerClassNameType}`, SELECT_TITLE, this.HTML);
    create(
      'select', 'select__item',
      [
        this.renderOption(SELECT_OPTION_1),
        this.renderOption(SELECT_OPTION_2),
      ],
      this.HTML,
    );

    return this.HTML;
  }

  renderOption(optionText) {
    return create(
      'option',
      `select__option ${this.containerClassNameType}`, optionText, '',
      ['optionType', optionText],
    );
  }
}

export default WordsToLearnSelect;
