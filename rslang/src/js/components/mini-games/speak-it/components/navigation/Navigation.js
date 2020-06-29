import create, { speakItConstants } from '../../pathes';

const {
  GAME_COMPLEXITY,
  DESCRIPTION_OF_LEVELS,
  NUMBER_OF_GROUPS,
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

    return this.container;
  }

  hide() {
    this.container.classList.add('hidden');
  }

  show() {
    this.container.classList.remove('hidden');
  }
}
