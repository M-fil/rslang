import {
  create,
  gamesInfo,
  mainPageConstants,
  mainPageUrls,
} from '../pathes';

const {
  mainGame,
  savannah,
  speakIt,
  findAPair,
  sprint,
  audioGame,
  englishPuzzle,
} = gamesInfo;

const {
  GAME_TITLE_TEXT,
} = mainPageConstants;

const {
  INFO_BUTTON_URL,
} = mainPageUrls;

class MainBlock {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'main-page__main-block');
    this.wrapper = create('div', 'main-block__wrapper', '', this.HTML);
    this.titleHTML = create('div', 'main-block__title', GAME_TITLE_TEXT, this.wrapper);
    this.mainGameContainer = create('div', 'main-block__main-game-container', '', this.wrapper);
    this.miniGameContainer = create('div', 'main-block__mini-games-container', '', this.wrapper);

    this.mainGameContainer.append(
      MainBlock.renderGameButton(...Object.values(mainGame), ' main-gape__main-game-button'),
    );
    this.miniGameContainer.append(
      MainBlock.renderGameButton(...Object.values(savannah)),
      MainBlock.renderGameButton(...Object.values(speakIt)),
      MainBlock.renderGameButton(...Object.values(findAPair)),
      MainBlock.renderGameButton(...Object.values(sprint)),
      MainBlock.renderGameButton(...Object.values(audioGame)),
      MainBlock.renderGameButton(...Object.values(englishPuzzle)),
    );

    return this.HTML;
  }

  static renderGameButton(gameCode, gameName, gameDescription, imageSrc, extraClassName = '') {
    const container = create(
      'div', `main-page__game-button${extraClassName}`, '', null, ['gameCode', gameCode],
    );
    this.infoIcon = create('img', 'game-button__info-icon', '', null, ['src', INFO_BUTTON_URL]);
    this.gameButtonIcon = create('img', 'game-button__game-image', '', null, ['src', imageSrc]);
    create('div', 'game-button__info-button', this.infoIcon, container);
    create('div', 'game-button__name', gameName, container);
    create('div', 'game-button__icon-container', this.gameButtonIcon, container);
    create('div', 'game-button__description', gameDescription, container);

    return container;
  }
}

export default MainBlock;
