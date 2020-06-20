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
    create('div', 'statistics__correct', `<h3>${CORRECT_WORDS_TEXT}</h3>`, words);
    const mistakesContainer = create('div', 'statistics__mistakes', `<h3>${INCORRECT_WORDS_TEXT}</h3>`, words);
    this.fullStatisticsWithWords(mistakesContainer);

    const buttons = create('div', 'statistics__buttons', '', this.container);
    create('button', 'back-button statistics__button', '<i class="fas fa-arrow-left"></i>', buttons);
    create('button', 'new-game-button statistics__button', NEW_GAME_BUTTON, buttons);

    return this.container;
  }

  fullStatisticsWithWords(container) {
    this.words.forEach((word) => {
      new StatisticsWord(word.word, word.transcription).render(container);
    });
  }
}
