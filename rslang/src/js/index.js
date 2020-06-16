import 'babel-polyfill';
import '../scss/style.scss';

import SavannahGame from './components/mini-games/savannah/Savannah';

const savannahGame = new SavannahGame();
savannahGame.render();

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  savannahGame.reverseReport();
});
