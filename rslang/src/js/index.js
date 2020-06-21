import 'babel-polyfill';
import '../scss/style.scss';

import SpeakIt from './components/mini-games/speak-it/SpeakIt';

const speakIt = new SpeakIt();
speakIt.run();
