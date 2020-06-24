import 'babel-polyfill';
import '../scss/style.scss';
import AuditionGame from './components/mini-games/audition-game/AuditionGame';
import { auditionGameVariables } from './constants/constants';

const audition = new AuditionGame();
audition.render(auditionGameVariables.Lives,auditionGameVariables.Rounds);
