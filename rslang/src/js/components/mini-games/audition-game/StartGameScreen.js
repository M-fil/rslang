import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class StartGameScreen {
  createStartScreen() {
    this.body = document.querySelector('body');
    this.startScreen = create('div', 'startScreen', '', this.body);
    this.gameName = create('h1', 'gameName', auditionGameVariables.gameTitle, this.startScreen);
    this.gameDesc = create('p', 'gameDesc', auditionGameVariables.gameDescription, this.startScreen);
    this.gameStartButton = create('button', 'gameStartButton', auditionGameVariables.gameStartBtn, this.startScreen);
    return this.gameStartButton;
  }
}
