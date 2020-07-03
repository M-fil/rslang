import create from '../../../utils/сreate';
import {
  wordsToLearnSelectConstants,
} from '../../../constants/constants';

const {
  SELECT_TITLE,
  SELECT_OPTION_LEARNED_WORDS,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS,
  SELECT_OPTION_LEARNED_WORDS_VALUE,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE,
  SELECT_GROUP_TITLE,
  SELECT_GROUP_OPTIONS_TITLE_LIST,
} = wordsToLearnSelectConstants;

class WordsToLearnSelect {
  constructor(containerClassNameType) {
    this.containerClassNameType = containerClassNameType;
    this.HTML = null;
  }

  render(showUserCollection = true) {
    this.HTML = create('div', `select__container ${this.containerClassNameType}__container`);
    const optionsArr = [];
    if (showUserCollection) {
      optionsArr.push(this.renderOption(SELECT_OPTION_LEARNED_WORDS, SELECT_OPTION_LEARNED_WORDS_VALUE));
    }
    optionsArr.push(this.renderOption(SELECT_OPTION_WORDS_FROM_COLLECTIONS, SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE));

    create('div', `select__title ${this.containerClassNameType}__select-title`, SELECT_TITLE, this.HTML);
    this.select = create(
      'select', `select__item ${this.containerClassNameType}__learn-words-select`,
      optionsArr,
      this.HTML, ['id', 'selectWords'],
    );

    this.select.addEventListener('click', (this.selectClickHandler).bind(this));

    this.titleLevel = create('div', `select__title ${this.containerClassNameType}__select-title`, SELECT_GROUP_TITLE, this.HTML);
    const groupOptionsArr = [];
    SELECT_GROUP_OPTIONS_TITLE_LIST.forEach((grouptitle, index) => {
      groupOptionsArr.push(this.renderOption(grouptitle, index));
    });
    this.selectLevel = create(
      'select', `select__item ${this.containerClassNameType}__learn-words-select`,
      groupOptionsArr,
      this.HTML, ['id', 'selectGroup'],
    );

    this.selectClickHandler();

    return this.HTML;
  }

  renderOption(optionText, valueText, ...attributes) {
    return create(
      'option',
      `select__option ${this.containerClassNameType}`, optionText, '',
      ['value', valueText], ...attributes,
    );
  }

  selectIndexByValue(value) {
    const options = Array.from(this.select.options);
    const item = options.find((option) => option.value === value);
    options.forEach((option) => option.removeAttribute('selected'));
    item.setAttribute('selected', '');
  }

  selectClickHandler() {
    if (this.select.value === SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE) {
      this.titleLevel.classList.remove('select_hidden');
      this.selectLevel.classList.remove('select_hidden');
    } else {
      this.titleLevel.classList.add('select_hidden');
      this.selectLevel.classList.add('select_hidden');
    }
  }
}

export default WordsToLearnSelect;
