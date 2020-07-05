import {
  create,
  gamesInfo,
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

class MainBlock {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'main-page__main-block');
    this.mainGameContainer = create('div', 'main-block__main-game-container');
    this.miniGameContainer = create('div', 'main-block__mini-games-container');

    this.mainGameContainer.append(
      MainBlock.renderGameButton(...Object.values(mainGame), ' main-gape__main-game-button');
    );
    this.miniGameContainer.append(
      MainBlock.renderGameButton(...Object.values(savannah));
      MainBlock.renderGameButton(...Object.values(speakIt)),
      MainBlock.renderGameButton(...Object.values(findAPair)),
      MainBlock.renderGameButton(...Object.values(sprint)),
      MainBlock.renderGameButton(...Object.values(audioGame)),
    );

    return this.HTML;
  }

  static renderGameButton(gameCode, gameName, gameDescription, extraClassName = '') {
    const container = create(
      'div', `main-page__game-button${extraClassName}`, '', null, ['gameCode', gameCode],
    );
    create('div', 'game-button__name', gameName, container);
    create('div', 'game-button__description', gameDescription, container);

    return container;
  }
}

export default MainBlock;
