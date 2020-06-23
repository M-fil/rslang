import create, { speakItConstants } from '../../pathes';

const {
  START_GAME_DESCRIPTION_1,
  START_GAME_DESCRIPTION_2,
  START_GAME_DESCRIPTION_3,
  START_GAME_DESCRIPTION_4,
  START_PAGE_BUTTON_TEXT,
  SPEAKIT_TITLE,
  SKIP_BUTTON,
} = speakItConstants;

export default class StartGamePage {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'start-page');

    create('h1', 'start-page__title', SPEAKIT_TITLE, this.container);
    this.renderExplanations();
    create('button', 'start-page__button-start', START_PAGE_BUTTON_TEXT, this.container);

    return this.container;
  }

  renderExplanations() {
    const explantionHTML = create('div', 'start-page__explanation', null, this.container);
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_1, explantionHTML);
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_2, explantionHTML);

    const skipButtonHTML = create(
      'button', 'word-card__skip-word-button word-card__skip-word-button_start-page', SKIP_BUTTON
    );
    const spanDescriptionStart =  create('span', '', START_GAME_DESCRIPTION_3);
    create(
      'p', 'start-page__paragraph',
      [spanDescriptionStart, skipButtonHTML],
      explantionHTML,
    );
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_4, explantionHTML);

    this.container.append(explantionHTML);
  }
}
