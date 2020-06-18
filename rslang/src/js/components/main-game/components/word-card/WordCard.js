import create from '../../../../utils/сreate';
import { mainGameStrings, urls } from '../../../../constants/constants';

import Preloader from '../../../preloader/Preloader';

const {
  WORDS_IMAGES_URL,
} = urls;

const {
  NEXT_BUTTON,
  SHOW_ANSWER_BUTTON,
} = mainGameStrings;

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
    const formHTML = this.renderWordForm();
    const wordTranslationHTML = create(
      'div', 'word-card__translation',
      this.wordTranslate, null,
      ['style', 'opacity: 1'], ['translationElement', ''],
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
      [sentencesBlock, imageBlock, wordTranslationHTML, formHTML],
      null, ['word', this.word], ['word-id', this.id],
    );

    return this.HTML;
  }

  renderWordForm() {
    const width = ['style', `width: ${this.word.length}ch`];
    const nextButton = WordCard.renderButton('next-button', NEXT_BUTTON, 'submit');
    const showAnswerButton = WordCard.renderButton('show-answer-button', SHOW_ANSWER_BUTTON, 'button');
    const inputHTML = create(
      'input', 'word-card__input', '', null,
      ['type', 'text'], width,
    );
    const userAnswerHTML = create('div', 'word-card__user-answer');
    const inputContainer = create('div', 'word-card__input-container', [inputHTML, userAnswerHTML], null, width);
    const formHTML = create('form', 'main-game__form', [inputContainer, nextButton, showAnswerButton]);

    return formHTML;
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
      'div', 'word-card__text-meaning-translation',
      this.textMeaningTranslate, container,
      ['style', 'opacity: 0;'], ['translationElement', ''],
    );
    const textExampleHTML = create('div', 'word-card__text-example', this.textExample, container);
    create(
      'div', 'word-card__text-example-translation',
      this.textExampleTranslate, container,
      ['style', 'opacity: 0;'], ['translationElement', ''],
    );
    WordCard.removeCurrentWordFromSentence(textMeaningHTML);
    WordCard.removeCurrentWordFromSentence(textExampleHTML);

    return container;
  }

  static renderButton(buttonClassNameType, buttonText, buttonType = 'button') {
    return create(
      'button',
      `main-game__button main-game__${buttonClassNameType}`,
      buttonText,
      null,
      ['type', buttonType],
    );
  }
}

export default WordCard;