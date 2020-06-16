import create from '../../../../utils/сreate';
import { mainGameStrings, urls } from '../../../../constants/constants';

const {
  WORDS_IMAGES_URL,
} = urls;

const {
  REMOVE_WORD_BUTTON,
  ADD_TO_DIFFICULT_WORDS,
  NEXT_BUTTON,
} = mainGameStrings;

class WordCard {
  constructor(id, word, wordTranslate, textMeaning, textExample, audio, image) {
    this.HTML = null;

    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.audio = audio;
    this.image = image;
  }

  render() {
    const sentencesBlock = this.renderSentences();
    const imageBlock = create('div', 'word-card__image-block');
    const formHTML = WordCard.renderWordForm();
    const wordTranslationHTML = create('div', 'word-card__translation', this.wordTranslate);

    const wordImage = new Image();
    wordImage.src = `${WORDS_IMAGES_URL}${this.image}`;
    wordImage.onload = () => {
      imageBlock.innerHTML = `<img src="${wordImage.src}" alt="${this.word}" />`;
    };
    const nextButton = WordCard.renderButton('next-button', NEXT_BUTTON);

    this.HTML = create(
      'div', 'main-game__word-card',
      [sentencesBlock, imageBlock, wordTranslationHTML, formHTML, nextButton],
      null, ['word', this.word], ['word-id', this.id],
    );

    return this.HTML;
  }

  static renderWordForm() {
    const formHTML = create('form', 'main-game__form');
    create('input', 'word-card__input', '', formHTML, ['type', 'text']);

    return formHTML;
  }

  renderSentences() {
    const container = create('div', 'word-card__sentences');
    create('div', 'word-card__text-meaning', this.textMeaning, container);
    create('div', 'word-card__text-example', this.textExample, container);

    return container;
  }

  static renderVocabularyButtons() {
    const removeWordButton = WordCard.renderButton('remove-word', REMOVE_WORD_BUTTON);
    const addToDifficultButton = WordCard.renderButton('add-to-difficult', ADD_TO_DIFFICULT_WORDS);
    const container = create('div', 'word-card__vocabulary-buttons', [removeWordButton, addToDifficultButton]);

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