import create from '../../pathes';
import WordCard from '../words/WordCard';
import ImageBlock from '../imageBlock/ImageBlock';
import Preloader from '../../../../preloader/preloader';

import { getWords } from '../../pathes';
import { speakItConstants } from '../../pathes';

const {
  FILES_PATH,
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
      this.wordsList = data.slice(0, 10);
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
      const wordCard = new WordCard(
        word.word,
        word.transcription,
        word.image.replace(FILES_PATH, ''),
        word.audio.replace(FILES_PATH, ''),
      );

      wordsListHTML.append(wordCard.render());
    });
  }
}
