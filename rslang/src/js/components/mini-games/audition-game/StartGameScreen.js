import create  from '../../../utils/сreate';
import {auditionGameVariables}  from '../../../constants/constants';
export default class StartGameScreen{

    createStartScreen(){
        const  body  = document.querySelector('body');
        const startScreen = create('div','startScreen','',body);
        const gameName = create('h1','gameName',auditionGameVariables.gameTitle,startScreen);
        const gameDesc = create('p','gameDesc',auditionGameVariables.gameDescription,startScreen);
        const gameStartButton = create('button','gameStartButton',auditionGameVariables.gameStartBtn,startScreen);
        return gameStartButton;
    }
}