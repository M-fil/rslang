import create, { speakItConstants } from '../../pathes';
import StatisticsWord from './StatisticsWord';

const {
  CORRECT_WORDS_TEXT,
  INCORRECT_WORDS_TEXT,
  NEW_GAME_BUTTON,
} = speakItConstants;

export default class StatisticsBlock {
  constructor(words) {
    this.words = words;
    this.container = null;
  }

  render() {
    this.container = create('div', 'statistics hidden');
    const words = create('div', 'statistics__words', '', this.container);
    const correctTitle = create('div', 'statistics__correct-title', CORRECT_WORDS_TEXT);
    create('div', 'statistics__correct', correctTitle, words);
    const mistakesTitle = create('div', 'statistics__mistakes-title', INCORRECT_WORDS_TEXT);
    const mistakesContainer = create('div', 'statistics__mistakes', mistakesTitle, words);
    this.fullStatisticsWithWords(mistakesContainer);

    const buttons = create('div', 'statistics__buttons', '', this.container);
    const icon = create('i', 'fas fa-arrow-left');
    create('button', 'back-button statistics__button', icon, buttons);
    create('button', 'new-game-button statistics__button', NEW_GAME_BUTTON, buttons);

    return this.container;
  }

  fullStatisticsWithWords(container) {
    this.words.forEach((word) => {
      const statisticsWord = new StatisticsWord(
        word.word, word.transcription, word.wordTranslate,
      );
      statisticsWord.render(container);
    });
  }
}
