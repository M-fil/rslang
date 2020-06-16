import 'babel-polyfill';
import '../scss/style.scss';

import MainGame from './components/main-game/MainGame';

const mainGame = new MainGame();
document.body.append(mainGame.render());
