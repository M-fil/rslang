import create, { speakItConstants } from '../../pathes';

const {
  SKIP_BUTTON,
} = speakItConstants;

export default class WordCard {
  constructor(id, word, transcription) {
    this.id = id;
    this.word = word;
    this.transcription = transcription;
    this.card = null;
  }

  render() {
    console.log(this.id, this.word, this.transcription)
    this.card = create('div', 'word-card', '', null, ['word', this.word], ['wordId', this.id]);

    create('button', 'word-card__skip-word-button', SKIP_BUTTON, this.card);
    create('i', 'fas fa-volume-up', '', this.card);
    const content = create('div', 'word-card__content', '', this.card);
    create('h3', 'word-card__word', this.word, content);
    create('div', 'word-card__transcription', this.transcription, content);

    return this.card;
  }
}
