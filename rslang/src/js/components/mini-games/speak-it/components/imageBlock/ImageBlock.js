import create, { urls } from '../../pathes';
import Prelodaer from '../../../../preloader/preloader';

const {
  DEAFAULT_SPEAKIT_WORD_IMAGE_URL,
} = urls;

export default class ImageBlock {
  constructor(image = DEAFAULT_SPEAKIT_WORD_IMAGE_URL, word = '', translation = '', isHeadenRecognition = true) {
    this.image = image;
    this.word = word;
    this.translation = translation;
    this.isHeadenRecognition = isHeadenRecognition;

    this.container = null;
  }

  render() {
    this.container = create('div', 'game-page__word-info');
    const imageBlockHTML = create('div', 'word-info__image-block', '', this.container);
    this.translationHTML = create(
      'div',
      `word-info__translation${!this.isHeadenRecognition ? ' hidden' : ''}`,
      `${this.translation}`,
      this.container,
    );
    create('div', 'word-info__text-example', this.textExample, this.container);
    create('div', 'word-info__text-meaning', this.textMeaining, this.container);

    const image = new Image();
    image.src = this.image;
    image.onload = () => {
      this.imageHTML = create('img', 'word-info__image', '', imageBlockHTML, ['src', this.image], ['alt', this.word]);
      this.wordInfoHTLM = create(
        'div',
        `word-info__speech-recognition${this.isHeadenRecognition ? ' hidden' : ''}`,
        '<i class="fas fa-microphone-alt"></i><span></span>',
        this.container,
      );
    };

    return this.container;
  }

  update(imageSrc, translation) {
    this.prelodaer = new Prelodaer();
    this.prelodaer.render();
    this.prelodaer.show();

    this.imageHTML.src = imageSrc;
    this.imageHTML.onload = () => {
      this.translationHTML.textContent = translation;
      this.prelodaer.hide();
    };
  }
}
