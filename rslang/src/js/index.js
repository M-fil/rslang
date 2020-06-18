import 'babel-polyfill';
import '../scss/style.scss';
import AuditionGame from './components/mini-games/audition-game/AuditionGame';
const a =  new AuditionGame();
a.render(true,5);