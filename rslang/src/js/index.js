import 'babel-polyfill';
import '../scss/style.scss';
// import App from './components/app/App';
import SavannahGame from './components/mini-games/savannah/Savannah';

const savannahGame = new SavannahGame();
savannahGame.render();

// const app = new App();
// app.run();
