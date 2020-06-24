import create from '../../../../utils/сreate';
import { urls } from '../../../../constants/constants';

import Preloader from '../../../preloader/Preloader';

const {
  WORDS_IMAGES_URL,
} = urls;

class WordCard {
  constructor(
    id, word, wordTranslate,
    textMeaning, textMeaningTranslate,
    textExample, textExampleTranslate,
    audio, image,
  ) {
    this.HTML = null;

    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.textMeaning = textMeaning;
    this.textMeaningTranslate = textMeaningTranslate;
    this.textExample = textExample;
    this.textExampleTranslate = textExampleTranslate;
    this.audio = audio;
    this.image = image;
  }

  render() {
    const sentencesBlock = this.renderSentences();
    const imageBlock = create('div', 'word-card__image-block');
    const wordTranslationHTML = create(
      'div', 'word-card__translation',
      this.wordTranslate, null,
      ['translationElement', ''],
    );

    const wordImage = new Image();
    wordImage.src = `${WORDS_IMAGES_URL}${this.image}`;
    this.preloader = new Preloader();
    this.preloader.render();
    this.preloader.show();
    wordImage.onload = () => {
      imageBlock.innerHTML = `<img src="${wordImage.src}" alt="${this.word}" />`;
      this.preloader.hide();
    };

    this.HTML = create(
      'div', 'main-game__word-card',
      [sentencesBlock, imageBlock, wordTranslationHTML],
      null, ['word', this.word], ['word-id', this.id],
    );

    return this.HTML;
  }

  static removeCurrentWordFromSentence(sentenceHTML) {
    const newNode = create('span', 'word-card__sentence-word-container');
    create('span', 'word-card__sentence-word', sentenceHTML.firstElementChild.textContent, newNode);
    sentenceHTML.replaceChild(newNode, sentenceHTML.firstElementChild);
  }

  renderSentences() {
    const container = create('div', 'word-card__sentences');
    const textMeaningHTML = create('div', 'word-card__text-meaning', this.textMeaning, container);
    create(
      'div', 'word-card__text-meaning-translation hidden-translation',
      this.textMeaningTranslate, container,
      ['translationElement', ''],
    );
    const textExampleHTML = create('div', 'word-card__text-example', this.textExample, container);
    create(
      'div', 'word-card__text-example-translation hidden-translation',
      this.textExampleTranslate, container,
      ['translationElement', ''],
    );
    WordCard.removeCurrentWordFromSentence(textMeaningHTML);
    WordCard.removeCurrentWordFromSentence(textExampleHTML);

    return container;
  }
}

export default WordCard;
