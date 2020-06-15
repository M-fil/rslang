import 'babel-polyfill';
import '../scss/style.scss';
import EnglishPuzzle from './components/mini-games/english-puzzle/EnglishPuzzle';

const englishPuzzle = new EnglishPuzzle();
englishPuzzle.start();
