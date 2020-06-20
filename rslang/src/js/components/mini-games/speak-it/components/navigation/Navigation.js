import create, { speakItConstants } from '../../pathes';

const {
  GAME_COMPLEXITY,
  DESCRIPTION_OF_LEVELS,
} = speakItConstants;

export default class Navigation {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('ul', 'navigation__list');

    for (let i = 0; i < 6; i += 1) {
      create(
        'li', 'navigation__item',
        `${i + 1}`, this.container,
        ['navNumber', i + 1],
        ['title', `${GAME_COMPLEXITY}: ${i + 1}.\n${DESCRIPTION_OF_LEVELS}`],
      );
    }

    return this.container;
  }
}
