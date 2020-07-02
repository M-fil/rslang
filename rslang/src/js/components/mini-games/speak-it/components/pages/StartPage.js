import create, { speakItConstants } from '../../pathes';

import StartWindow from '../../../common/StartWindow';

const {
  START_GAME_DESCRIPTION_1,
  START_GAME_DESCRIPTION_2,
  START_GAME_DESCRIPTION_3,
  START_GAME_DESCRIPTION_4,
  SKIP_BUTTON,
} = speakItConstants;

class StartPage extends StartWindow {
  renderExplanations() {
    this.explantionHTML = create('div', 'start-page__explanation');
    create(
      'p', 'start-page__paragraph',
      `${START_GAME_DESCRIPTION_1} ${START_GAME_DESCRIPTION_2}`,
      this.explantionHTML,
    );

    const skipButtonHTML = create(
      'button', 'word-card__skip-word-button word-card__skip-word-button_start-page', SKIP_BUTTON
    );
    const spanDescriptionStart = create('span', '', START_GAME_DESCRIPTION_3);
    create(
      'p', 'start-page__paragraph',
      [spanDescriptionStart, skipButtonHTML],
      this.explantionHTML,
    );
    create('p', 'start-page__paragraph', START_GAME_DESCRIPTION_4, this.explantionHTML);

    return this.explantionHTML;
  }
}

export default StartPage;
