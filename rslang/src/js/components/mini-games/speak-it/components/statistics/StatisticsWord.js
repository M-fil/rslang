import create from '../../pathes';

export default class StatisticsWord {
  constructor(word, transcription, translation) {
    this.word = word;
    this.transcription = transcription;
    this.translation = translation;
    this.card = null;
  }

  render(container) {
    this.card = create('div', 'statistics__word', '', container, ['scoreWord', this.word]);
    create('i', 'fas fa-volume-up', '', this.card);
    const content = create('div', 'word__content', '', this.card);
    create('div', 'word__text', this.word, content);
    create('div', 'word__transcription', this.transcription, content);
    create('div', 'word__translation', `${this.translation}`, content);
  }
}
