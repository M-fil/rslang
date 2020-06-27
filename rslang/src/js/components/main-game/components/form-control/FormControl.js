import create, { mainGameConstants } from '../../pathes';

const {
  NEXT_BUTTON,
  SHOW_ANSWER_BUTTON,
  CONTINUE_BUTTON,
} = mainGameConstants;

class FormControll {
  constructor(word, showButtonShowAnswer) {
    this.HTML = null;
    this.word = word;
    this.showButtonShowAnswer = showButtonShowAnswer;
  }

  render() {
    const nextButton = FormControll.renderButton('next-button', NEXT_BUTTON, 'submit');
    const showAnswerButton = FormControll.renderButton('show-answer-button', SHOW_ANSWER_BUTTON, 'button');

    const userAnswerHTML = create('div', 'word-card__user-answer');
    this.inputHTML = create('input', 'word-card__input', '', null, ['type', 'text']);
    const inputWrapper = create('div', 'word-card__input-wrapper', [this.inputHTML, userAnswerHTML]);
    this.inputHTML.style.width = this.getInputCSSWidth();

    this.buttonsContainer = create(
      'div', 'main-game__form-buttons',
      [this.showButtonShowAnswer ? showAnswerButton : '', nextButton],
    );
    const inputContainer = create('div', 'word-card__input-container', inputWrapper);

    this.HTML = create('form', 'main-game__form', [inputContainer, this.buttonsContainer]);
    return this.HTML;
  }

  renderContinueButton() {
    const button = FormControll.renderButton('continue-button', CONTINUE_BUTTON);
    this.buttonsContainer.append(button);
  }

  updateInputWidth(newWord) {
    document.querySelector('.word-card__fake-word').remove();
    this.word = newWord;
    this.inputHTML.style.width = this.getInputCSSWidth();
  }

  getInputCSSWidth() {
    this.fakeWord = create('div', 'word-card__fake-word', this.word);
    create('div', 'word-card__fake-word-container', this.fakeWord, document.body);

    return `${this.fakeWord.offsetWidth}px`;
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

  hide() {
    if (this.HTML) {
      this.HTML.remove();
    }
  }
}

export default FormControll;
