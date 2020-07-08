import create, { speakItConstants, wordsToLearnSelectConstants } from '../../pathes';

const {
  DESCRIPTION_OF_LEVELS,
  NUMBER_OF_GROUPS,
} = speakItConstants;

const {
  SELECT_GROUP_OPTIONS_TITLE_LIST,
  SELECT_GROUP_TITLE,
} = wordsToLearnSelectConstants;

export default class Navigation {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'navigation__list');
    const selectContainer = create('div', 'navigation__select-container', '', this.container);
    create('label', 'navigation__select-label', SELECT_GROUP_TITLE, selectContainer);
    this.select = create('select', 'navigation__group-select', '', selectContainer, ['title', DESCRIPTION_OF_LEVELS]);
    Array.from({ length: NUMBER_OF_GROUPS })
      .map((_, index) => index)
      .map((item) => create(
        'option', 'navigation__option',
        SELECT_GROUP_OPTIONS_TITLE_LIST[item],
        this.select, ['value', item],
      ));

    return this.container;
  }

  hide() {
    this.container.classList.add('hidden');
  }

  show() {
    this.container.classList.remove('hidden');
  }
}
