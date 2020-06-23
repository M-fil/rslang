import create, { getWords, speakItConstants } from '../../pathes';
import WordCard from '../words/WordCard';
import ImageBlock from '../imageBlock/ImageBlock';

const {
  WORDS_LIMIT_NUMBER,
} = speakItConstants;

export default class GamePage {
  constructor(pageNumber, groupNumber) {
    this.pageNumber = pageNumber;
    this.groupNumber = groupNumber;

    this.wordsList = [];
    this.container = null;
  }

  render() {
    this.container = create('div', 'game-page');

    this.container.append(new ImageBlock().render());
    create('div', 'game-page__words', '', this.container);
    this.initWords();

    return this.container;
  }

  async initWords() {
    try {
      const data = await getWords(this.pageNumber, this.groupNumber);
      this.wordsList = data.slice(0, WORDS_LIMIT_NUMBER);
      this.renderWords();
      localStorage.setItem('currentWords', JSON.stringify(this.wordsList));
      document.querySelector('.loading').remove();
    } catch (error) {
      console.log(error);
    }
  }

  renderWords() {
    const wordsListHTML = document.querySelector('.game-page__words');
    wordsListHTML.innerHTML = '';

    this.wordsList.forEach((word) => {
      const wordCard = new WordCard(word.id, word.word, word.transcription);

      wordsListHTML.append(wordCard.render());
    });
  }
}
