import create, { speakItConstants } from '../../pathes';

const {
  DESCRIPTION_OF_LEVELS,
  NUMBER_OF_GROUPS,
  GROUPS_OF_WORDS_TEXT,
} = speakItConstants;

export default class Navigation {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'navigation__list');
    const selectContainer = create('div', 'navigation__select-container', '', this.container);
    create('label', 'navigation__select-label', GROUPS_OF_WORDS_TEXT, selectContainer);
    this.select = create('select', 'navigation__group-select', '', selectContainer, ['title', DESCRIPTION_OF_LEVELS]);
    Array.from({ length: NUMBER_OF_GROUPS })
      .map((_, index) => index)
      .map((item) => create('option', 'navigation__option', String(item + 1), this.select, ['value', item]));

    return this.container;
  }

  hide() {
    this.container.classList.add('hidden');
  }

  show() {
    this.container.classList.remove('hidden');
  }
}
