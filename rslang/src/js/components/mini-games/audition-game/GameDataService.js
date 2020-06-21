import create from '../../../utils/сreate';
import { getWords, getWordsAdditionalInfo } from '../../../service/service';
import { simpleShuffle, shuffle } from '../../../utils/shuffle';

export default class GameDataService {
  async mapping() {
    this.data = await getWords(Math.floor(Math.random() * Math.floor(29)), 0);
    this.shuffledValue = this.data.sort(simpleShuffle);
    this.body = document.querySelector('body');
    this.container = create('div', 'container', '', this.body);
    this.close = create('div', 'close', '', this.container);
    this.game = create('div', 'game', '', this.container);
    this.mainWord = create('div', 'audioPulse', /* shuffledValue[0].word */'', this.game);
    this.answers = create('div', 'answers', '', this.game);
    this.nextBtn = create('button', 'nextBtn', 'Не знаю', this.game);
    const array1 = [];
    for (let i = 0; i < this.shuffledValue.length - 1; i += 1) {
      const test = await getWordsAdditionalInfo(this.shuffledValue[i].word);
      const partOfSpeech = test.results !== undefined ? test?.results[0]?.partOfSpeech : 'IDK';
      array1.push({
        word: this.shuffledValue[i].word, translate: this.shuffledValue[i].wordTranslate, audio: this.shuffledValue[i].audio, partOfSpeech,
      });
    }
    const a = array1.filter((word) => word.partOfSpeech === 'noun');
    const arrTest = a.slice(0, 5);
    const mainWordToAsk = arrTest[0];
    const array = shuffle(arrTest);
    return { mainWordToAsk, array };
  }
}
