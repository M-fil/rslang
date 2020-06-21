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
    create('div', 'start-page__explanation',
      `<p>${START_GAME_DESCRIPTION_1}</p>
      <p>${START_GAME_DESCRIPTION_2}</p>`,
      this.container,
    );
    create('button', 'start-page__button-start', START_PAGE_BUTTON_TEXT, this.container);

    return this.container;
  }
}
