import {
  GAME_BLOCK,
} from '../../../../constants/constatntsForEP';
import {
  hidingElement,
} from './dom-actions';
import create from '../../../../utils/сreate';

if (!localStorage.userSettings) {
  const userSettings = {
    sound: false,
    translate: false,
  };
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// Create select in function whereis select
function selectFill(numberOfRows) {
  const masOfOptions = [];
  for (let i = 1; i <= numberOfRows; i += 1) {
    const el = create('option', 'select-option');
    el.value = i;
    el.label = i;
    masOfOptions.push(el);
  }
  return create('select', 'select-block_mode', masOfOptions);
}

function createSelectBlock() {
  const selectsContainer = create('div', 'game-mode-selects');
  const searchButton = create('button', 'new_lvl-button');
  for (let i = 0; i < GAME_BLOCK.gameMode; i += 1) {
    const selectDescription = create('p', 'select-block_description');
    let select = null;
    switch (i) {
      case 0:
        select = selectFill(GAME_BLOCK.gameLevels);
        selectDescription.textContent = GAME_BLOCK.level;
        select.classList.add('level');
        break;
      default:
        select = selectFill(GAME_BLOCK.gamePages, select);
        selectDescription.textContent = GAME_BLOCK.page;
        select.classList.add('page');
        break;
    }
    create('div', 'select-block', [selectDescription, select], selectsContainer);
  }
  selectsContainer.appendChild(searchButton);
  return selectsContainer;
}

// Why local storage?
function createControlButtons(buttonStat) {
  const buttonsContainer = create('div', 'control-buttons_container');
  for (let i = 0; i < GAME_BLOCK.controlButtons; i += 1) {
    let button = null;
    switch (i) {
      case 0:
        button = create('button', 'button-sintezise');
        if (buttonStat.sound) {
          button.classList.add('active-button');
        }
        break;
      case 1:
        button = create('button', 'button-trunslate');
        if (buttonStat.translate) {
          button.classList.add('active-button');
        }
        break;
      case 2:
        button = create('button', 'button-background');
        if (buttonStat.background) {
          button.classList.add('active-button');
        }
        break;
      default:
        button = create('button', 'button-logout');
        break;
    }
    button.classList.add('help-button');
    buttonsContainer.appendChild(button);
  }
  return buttonsContainer;
}

function createGameButtons() {
  const gameButtons = create('div', 'game-block_field--buttons');
  for (let i = 0; i < GAME_BLOCK.gameButtons.length; i += 1) {
    const gameButton = create('button', 'game-button');
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
        hidingElement(gameButton);
        break;
      case 3:
        gameButton.classList.add('result-button');
        hidingElement(gameButton);
        break;
      default:
        gameButton.classList.add('repeat-button');
        hidingElement(gameButton);
        break;
    }
    gameButtons.appendChild(gameButton);
  }
  return gameButtons;
}

function createUserTooltips(buttonStat) {
  const soundBlock = create('div', 'sound-button');
  const translateSentense = create('p', 'translate-sentense');
  if (buttonStat.sound) {
    soundBlock.classList.add('active-sintez');
  }
  if (buttonStat.translate) {
    translateSentense.classList.add('active-translate');
  }
  return create('div', 'game-block_field--tooltips', [soundBlock, translateSentense]);
}

function createWorkBlock() {
  const buttonStat = JSON.parse(localStorage.userSettings);
  const puzzleField = create('div', 'game-block_field--puzzle', new Array(GAME_BLOCK.gameZoneRows).fill(create('div', 'game-field_row')));
  const descriptionField = create('div', 'game-block_field--description');
  const gameField = create('div', 'game-block_field', [createUserTooltips(buttonStat), puzzleField, descriptionField, createGameButtons()]);
  const controlBlock = create('div', 'control-block', [createSelectBlock(), createControlButtons(buttonStat)]);
  const gameBlock = create('div', 'game-block', [controlBlock, gameField]);
  const gameContainer = create('div', 'game-container', gameBlock);
  hidingElement(gameContainer);
  return gameContainer;
}

export default createWorkBlock;
