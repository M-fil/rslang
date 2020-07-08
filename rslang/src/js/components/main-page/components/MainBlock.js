import {
  create,
  gamesInfo,
  mainPageConstants,
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

class MainBlock {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'main-page__main-block', '', null, ['scrollId', 'games-block']);
    this.wrapper = create('div', 'main-block__wrapper', '', this.HTML);
    this.titleHTML = create('div', 'main-block__title', GAME_TITLE_TEXT, this.wrapper);
    this.gamesContainer = create('div', 'main-block__games-container', '', this.wrapper);

    this.gameFirstLine = create('div', 'main-block__games-first-line main-block__game-line', [
      MainBlock.renderGameButton(...Object.values(speakIt)),
      MainBlock.renderGameButton(...Object.values(mainGame), ' main-game__main-game-button'),
      MainBlock.renderGameButton(...Object.values(sprint)),
    ], this.gamesContainer);
    this.gameSecondLine = create('div', 'main-block__games-second-line main-block__game-line', [
      MainBlock.renderGameButton(...Object.values(englishPuzzle)),
      MainBlock.renderGameButton(...Object.values(findAPair)),
    ], this.gamesContainer);
    this.gameThirdLine = create('div', 'main-block__games-third-line main-block__game-line', [
      MainBlock.renderGameButton(...Object.values(savannah)),
      MainBlock.renderGameButton(...Object.values(audioGame)),
    ], this.gamesContainer);

    return this.HTML;
  }

  static renderGameButton(gameCode, gameName, gameDescription, imageSrc, extraClassName = '') {
    const container = create(
      'div', `main-page__game-button${extraClassName}`, '', null, ['gameCode', gameCode],
    );
    this.infoIcon = create('i', 'fas fa-info-circle game-button__info-icon', '', null);
    this.gameButtonIcon = create('img', 'game-button__game-image', '', null, ['src', imageSrc]);
    create('div', 'game-button__info-button', this.infoIcon, container);
    create('div', 'game-button__name', gameName, container);
    create('div', 'game-button__icon-container', this.gameButtonIcon, container);
    create('div', 'game-button__description', gameDescription, container);

    return container;
  }
}

export default MainBlock;
