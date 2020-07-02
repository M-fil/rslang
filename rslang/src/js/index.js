import 'babel-polyfill';
import '../scss/style.scss';
// import App from './components/app/App';
import SavannahGame from './components/mini-games/savannah/Savannah';

// const app = new App();
const savannahGame = new SavannahGame();
// app.run();
savannahGame.render();
