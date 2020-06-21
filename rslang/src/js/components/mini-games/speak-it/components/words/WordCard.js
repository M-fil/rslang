import create from '../../pathes';

export default class WordCard {
  constructor(word, transcription) {
    this.word = word;
    this.transcription = transcription;
    this.card = null;
  }

  render() {
    this.card = create('div', 'word-card', '', null, ['word', this.word]);

    create('i', 'fas fa-volume-up', '', this.card);
    const content = create('div', 'word-card__content', '', this.card);
    create('h3', 'word-card__word', this.word, content);
    create('div', 'word-card__transcription', this.transcription, content);

    return this.card;
  }
}
