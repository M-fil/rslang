import create  from '../../../utils/сreate';
export default class StartGameScreen{

    createStartScreen(){
        const  body  = document.querySelector('body');
        const startScreen = create('div','startScreen','',body);
        const gameName = create('h1','gameName','Аудиовызов',startScreen);
        const gameDesc = create('p','gameDesc','Тренировка улучшает восприятие английской речи на слух.',startScreen);
        const gameStartButton = create('button','gameStartButton','Начать',startScreen);
        return gameStartButton;
    }
}