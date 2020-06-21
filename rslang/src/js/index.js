import 'babel-polyfill';
import '../scss/style.scss';
import AuditionGame from './components/mini-games/audition-game/AuditionGame';

const audition = new AuditionGame();
audition.render(5);
