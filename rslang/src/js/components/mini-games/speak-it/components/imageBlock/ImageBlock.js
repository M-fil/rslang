import create from '../../pathes';

export default class ImageBlock {
  constructor(image = '../src/assets/english.jpg', word = '', translation = '', isHeadenRecognition = true) {
    this.image = image;
    this.word = word;
    this.translation = translation;
    this.isHeadenRecognition = isHeadenRecognition;

    this.container = null;
  }

  render() {
    this.container = create('div', 'game-page__word-info');
    create(
      'div',
      'word-info__image-block',
      `<img class="word-info__image" src="${this.image}" alt="${this.word}">`,
      this.container,
    );
    create(
      'div',
      `word-info__speech-recognition${this.isHeadenRecognition ? ' hidden' : ''}`,
      '<i class="fas fa-microphone-alt"></i><span></span>',
      this.container,
    );
    create(
      'div',
      `word-info__translation${!this.isHeadenRecognition ? ' hidden' : ''}`,
      `${this.translation}`,
      this.container,
    );
    create('div', 'word-info__text-example', this.textExample, this.container);
    create('div', 'word-info__text-meaning', this.textMeaining, this.container);

    return this.container;
  }
}
