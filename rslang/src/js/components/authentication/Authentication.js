import create from '../../utils/сreate';
import { authenticationTexts, errorTypes } from '../../constants/constants';
import { checkPassword, checkEmail } from '../../utils/validators';

const {
  PASSWORD_LABEL_TEXT,
  EMAIL_LABEL_TEXT,
} = authenticationTexts;

const {
  EMPTY_FIELD,
  INCORRECT_VALUES,
  PASSWORD_REQUIRMENTS,
  INCORRECT_EMAIL,
} = errorTypes;

class Authentication {
  constructor(title, classNameType, submitButtonText) {
    this.HTML = null;
    this.title = title;
    this.submitButtonText = submitButtonText;
    this.classNameType = classNameType;
  }

  render() {
    const titleHTML = create('h3', `${this.classNameType}__title authentication__title`, this.title);
    const formHTML = this.renderForm();

    this.HTML = create('div', `${this.classNameType} authentication`, [titleHTML, formHTML]);
    return this.HTML;
  }

  renderForm() {
    const emailField = this.renderInputContainer(EMAIL_LABEL_TEXT, 'email', 'email');
    const passwordField = this.renderInputContainer(PASSWORD_LABEL_TEXT, 'password', 'password');
    const submitButton = create('button', `${this.classNameType}__submit-button authentication__button`, this.submitButtonText);

    const formHTML = create('form', `${this.classNameType}__form authentication__form`, [emailField, passwordField, submitButton]);
    return formHTML;
  }

  renderInputContainer(labelText, inputType, inputClassNameType) {
    const inputId = `${inputClassNameType}-field`;

    const container = create('div', `${this.classNameType}__field-container`);
    create(
      'label',
      `${this.classNameType}__label authentication__title__label`,
      labelText, container,
      ['for', inputId],
    );

    create(
      'input',
      `${this.classNameType}__email-field authentication__field`,
      '', container,
      ['id', inputId], ['type', inputType], ['name', inputClassNameType],
    );

    return container;
  }

  static createErrorBlock(message) {
    const errorBlock = create('span', 'error-block', message);
    document.querySelector('.authentication__form').append(errorBlock);
  }

  static submitData(authenticationType, submitFunction) {
    const formHTML = document.querySelector(`.${authenticationType}__form`);

    formHTML.addEventListener('submit', async (event) => {
      event.preventDefault();

      const passwordInput = formHTML.querySelector('[name="password"]');
      const emailInput = formHTML.querySelector('[name="email"]');

      const trimedPasswordValue = passwordInput.value.trim();
      const trimedEmailValue = emailInput.value.trim();
      const userSubmitData = {
        email: trimedEmailValue,
        password: trimedPasswordValue,
      };

      try {
        if (trimedPasswordValue === '' || trimedEmailValue === '') {
          throw new Error(EMPTY_FIELD);
        }

        if (!checkPassword(trimedPasswordValue)) {
          throw new Error(PASSWORD_REQUIRMENTS);
        }

        const data = await submitFunction(userSubmitData);
        console.log(data);
        if ('error' in data) {
          throw new Error(INCORRECT_VALUES);
        }

        localStorage.setItem('user-data', JSON.stringify(data));
      } catch (error) {
        const errorBlockFromDOM = document.querySelector('.error-block');

        if (!errorBlockFromDOM) {
          this.createErrorBlock(error.message);
          setTimeout(() => {
            document.querySelector('.error-block').remove();
          }, 3000);
        }
      }
    });
  }
}

export default Authentication;
