import {
  GAME_BLOCK,
} from '../../../../constants/constatntsForEP';
import {
  viewElement,
} from './dom-actions';
import create from '../../../../utils/сreate';

export default class MainBlock {
  constructor() {
    this.buttonStat = null;
  }

  createMainForm() {
    if (!localStorage.userSettings) {
      const userSettings = {
        sound: false,
        translate: false,
      };
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
    }
    this.buttonStat = JSON.parse(localStorage.userSettings);
    const puzzleFieldContainer = create('div', 'game-block_field--puzzle-container');
    create('div', 'game-block_field--puzzle', MainBlock.createGameFieldRows(), puzzleFieldContainer);
    const puzzleFieldBackground = create('div', 'game-block_field--background');
    const descriptionField = create('div', 'game-block_field--description');
    const gameField = create('div', 'game-block_field', [this.createUserTooltips(), puzzleFieldContainer, puzzleFieldBackground, descriptionField, MainBlock.createGameButtons()]);
    const controlBlock = create('div', 'control-block', this.createControlButtons());
    const gameBlock = create('div', 'game-block', [controlBlock, gameField]);
    const gameContainer = create('div', 'game-container', gameBlock);
    viewElement([gameContainer, puzzleFieldBackground], []);
    return gameContainer;
  }

  createControlButtons() {
    const buttonsContainer = create('div', 'control-buttons_container');
    const buttonStutMas = Object.values(this.buttonStat);
    console.log(buttonStutMas);
    for (let i = 0; i < GAME_BLOCK.controlButtons; i += 1) {
      let button = null;
      switch (i) {
        case 0:
          button = create('div', 'new_lvl-button', '<i class="fas fa-search"></i>');
          create('div', 'new-lvl-button_container', button, buttonsContainer);
          break;
        case 1:
          button = create('div', 'button-sintezise help-button', '<i class="fas fa-music"></i>', buttonsContainer);
          buttonStutMas[0] ? button.classList.add('active-button') : button.classList.remove('active-button');
          break;
        default:
          button = create('div', 'button-trunslate help-button', '<i class="fas fa-language"></i>', buttonsContainer);
          buttonStutMas[1] ? button.classList.add('active-button') : button.classList.remove('active-button');
          break;
      }
    }
    return buttonsContainer;
  }

  static createGameButtons() {
    const gameButtons = create('div', 'game-block_field--buttons');
    for (let i = 0; i < GAME_BLOCK.gameButtons.length; i += 1) {
      const gameButton = create('div', 'game-button', '', gameButtons);
      gameButton.textContent = GAME_BLOCK.gameButtons[i];
      switch (i) {
        case 0:
          gameButton.classList.add('show-result-button');
          break;
        case 1:
          gameButton.classList.add('check-button');
          break;
        case 2:
          gameButton.classList.add('continue-button');
          break;
        case 3:
          gameButton.classList.add('result-button');
          break;
        case 4:
          gameButton.classList.add('repeat-button');
          break;
        default:
          gameButton.classList.add('bonus-button');
          break;
      }
    }
    const masOfButtons = gameButtons.childNodes;
    viewElement([masOfButtons[2], masOfButtons[3], masOfButtons[4], masOfButtons[5]], []);
    return gameButtons;
  }

  createUserTooltips() {
    const soundBlock = create('div', 'sound-button', '<i class="fas fa-volume-up"></i>');
    const translateSentense = create('p', 'translate-sentense');
    if (this.buttonStat.sound) {
      soundBlock.classList.add('active-sintez');
    }
    if (this.buttonStat.translate) {
      translateSentense.classList.add('active-translate');
    }
    return create('div', 'game-block_field--tooltips', [soundBlock, translateSentense]);
  }

  static createGameFieldRows() {
    return new Array(GAME_BLOCK.gameZoneRows).fill(1).map((el) => {
      let elem = el;
      elem = create('div', 'puzzle-row');
      return elem;
    });
  }
}
