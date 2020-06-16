import create from '../../../../utils/сreate';
import mainGameStrings from '../../../../constants/constants';

const {
  REMOVE_WORD_BUTTON,
  ADD_TO_DIFFICULT_WORDS,
} = mainGameStrings;

class WordCard {
  constructor(word, translation, textMeaning, textExample, wordTranslate, audio, image) {
    this.HTML = null;

    this.word = word;
    this.translation = translation;
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.wordTranslate = wordTranslate;
    this.audio = audio;
    this.image = image;
  }

  render() {
    const sentencesBlock = this.renderSentences();
    const imageBlock = create(
      'div', 'word-card__image-block',
      `<img src="${this.image}" alt="${this.word}" />`,
      null,
    );
    const formHTML = WordCard.renderWordForm();

    this.HTML = create(
      'div', 'main-game__word-card',
      [sentencesBlock, imageBlock, formHTML],
      null, ['word', this.word],
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