import create, { speakItConstants } from '../../pathes';

const {
  START_GAME_DESCRIPTION_1,
  START_GAME_DESCRIPTION_2,
  START_PAGE_BUTTON_TEXT,
  SPEAKIT_TITLE,
} = speakItConstants;

export default class StartGamePage {
  constructor() {
    this.container = null;
  }

  render() {
    this.container = create('div', 'start-page');

    create('h1', 'start-page__title', SPEAKIT_TITLE, this.container);
    const explantionHTML = create('div', 'start-page__explanation', null, this.container);
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_1, explantionHTML);
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_2, explantionHTML);
    create('button', 'start-page__button-start', START_PAGE_BUTTON_TEXT, this.container);

    return this.container;
  }
}
