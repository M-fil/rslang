import WordCard from './components/word-card/WordCard';
import { getWords } from '../../service/service';
import create from '../../utils/сreate';

class MainGame {
  constructor() {
    this.state = {
      currentWordIndex: 0,
      wordsArray: [],
    };
  }

  async render() {
    const wordCard = await this.renderWordCard();

    const mainGameHTML = create('div', 'main-game', wordCard.render());
    document.body.append(mainGameHTML);
    document.querySelector('.word-card__input').focus();
  }

  async renderWordCard() {
    const { currentWordIndex } = this.state;
    const words = await getWords();
    this.state.wordsArray = words;

    const currentWord = words[currentWordIndex];
    const wordCard = new WordCard(
      currentWord.id,
      currentWord.word,
      currentWord.wordTranslate,
      currentWord.textMeaning,
      currentWord.textExample,
      currentWord.audio,
      currentWord.image,
    );

    return wordCard;
  }
};

export default MainGame;
