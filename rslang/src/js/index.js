import 'babel-polyfill';
import '../scss/style.scss';

import MainGame from './components/main-game/MainGame';

import App from './components/app/App';

const app = new App();
app.run();
