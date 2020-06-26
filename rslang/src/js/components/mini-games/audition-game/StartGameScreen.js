import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class StartGameScreen {
  createStartScreen() {
    this.wrapper = document.querySelector('.audition-game__wrapper');
    this.startScreen = create('div', 'audition-game__startScreen', '', this.wrapper);
    this.gameName = create('h1', 'audition-game__title', auditionGameVariables.gameTitle, this.startScreen);
    this.gameDesc = create('p', 'audition-game__description', auditionGameVariables.gameDescription, this.startScreen);
    this.gameStartButton = create('button', 'audition-game__button__start', auditionGameVariables.gameStartBtn, this.startScreen);
    return this.gameStartButton;
  }
}
