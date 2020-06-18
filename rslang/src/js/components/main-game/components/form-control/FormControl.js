import create from '../../../../utils/сreate';
import { mainGameStrings } from '../../../../constants/constants';

const {
  NEXT_BUTTON,
  SHOW_ANSWER_BUTTON,
} = mainGameStrings;

class FormControll {
  constructor(word) {
    this.HTML = null;
    this.word = word;
  }

  render() {
    const width = ['style', this.getInputCSSWidth()];
    const nextButton = FormControll.renderButton('next-button', NEXT_BUTTON, 'submit');
    const showAnswerButton = FormControll.renderButton('show-answer-button', SHOW_ANSWER_BUTTON, 'button');
    this.inputHTML = create(
      'input', 'word-card__input', '', null,
      ['type', 'text'], width,
    );
    const buttonsContainer = create('div', 'main-game__form-buttons', [showAnswerButton, nextButton]);
    const userAnswerHTML = create('div', 'word-card__user-answer');
    const inputContainer = create('div', 'word-card__input-container', [this.inputHTML, userAnswerHTML]);
    this.HTML = create('form', 'main-game__form', [inputContainer, buttonsContainer]);

    return this.HTML;
  }

  updateInputWidth(newWord) {
    this.word = newWord;
    this.inputHTML.style.width = this.getInputCSSWidth();
  }

  getInputCSSWidth() {
    return `width: ${this.word.length}ch`;
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

export default FormControll;
