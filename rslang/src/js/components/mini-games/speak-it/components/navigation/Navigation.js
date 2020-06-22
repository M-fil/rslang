import create, { speakItConstants } from '../../pathes';

const {
  GAME_COMPLEXITY,
  DESCRIPTION_OF_LEVELS,
  NUMBER_OF_GROUPS,
  NUMBER_OF_PAGES,
} = speakItConstants;

export default class Navigation {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'navigation__list');

    for (let i = 0; i < NUMBER_OF_GROUPS; i += 1) {
      create(
        'div', 'navigation__item',
        `${i + 1}`, this.container,
        ['navNumber', i + 1],
        ['title', `${GAME_COMPLEXITY}: ${i + 1}.\n${DESCRIPTION_OF_LEVELS}`],
      );
    }
    this.renderSelectOfPages();

    return this.container;
  }

  renderSelectOfPages() {
    const arrayOfPagesOptions = Array.from({ length: NUMBER_OF_PAGES })
      .map((_, index) => index + 1)
      .map((option) => create('option', 'navigation__option', String(option), null, ['value', option]));
    create('select', 'navigation__pages-list', arrayOfPagesOptions, this.container);
  }

  hide() {
    this.container.classList.add('hidden');
  }

  show() {
    this.container.classList.remove('hidden');
  }
}
