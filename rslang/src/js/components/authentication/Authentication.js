import create from '../../utils/сreate';
import { authenticationConstants, errorTypes } from '../../constants/constants';
import { checkPassword } from '../../utils/validators';

const {
  PASSWORD_LABEL_TEXT,
  EMAIL_LABEL_TEXT,
  REGISTRATION_KEY,
  NAME_LABEL_TEXT,
  MAX_NAME_LENGTH,
} = authenticationConstants;

const {
  EMPTY_FIELD,
  INCORRECT_VALUES,
  PASSWORD_REQUIRMENTS,
  EXCEEDED_NAME_LENGTH,
} = errorTypes;

class Authentication {
  constructor(title, classNameType, submitButtonText, formKey) {
    this.HTML = null;
    this.title = title;
    this.submitButtonText = submitButtonText;
    this.classNameType = classNameType;
    this.formKey = formKey;
  }

  render() {
    const titleHTML = create('h3', `${this.classNameType}__title authentication__title`, this.title);
    const formHTML = this.renderForm();

    this.HTML = create('div', `${this.classNameType} authentication`, [titleHTML, formHTML]);
    return this.HTML;
  }

  renderForm() {
    let nameField = null;
    if (this.formKey === REGISTRATION_KEY) {
      nameField = this.renderInputContainer(NAME_LABEL_TEXT, 'text', 'name');
    }
    const emailField = this.renderInputContainer(EMAIL_LABEL_TEXT, 'email', 'email');
    const passwordField = this.renderInputContainer(PASSWORD_LABEL_TEXT, 'password', 'password');
    const submitButton = create('button', `${this.classNameType}__submit-button authentication__button`, this.submitButtonText);

    const formHTML = create(
      'form', `${this.classNameType}__form authentication__form`,
      [nameField, emailField, passwordField, submitButton],
    );
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
    const errorBlockHTML = document.querySelector('.error-block');
    if (errorBlockHTML) {
      errorBlockHTML.remove();
    }

    const authenticationForm = document.querySelector('.authentication__form');
    const errorBlock = create('span', 'error-block', message);
    if (authenticationForm) {
      authenticationForm.append(errorBlock);
    }
  }

  static async submitData(submitFunction) {
    const formHTML = document.querySelector('.authentication__form');
    const passwordInput = formHTML.querySelector('[name="password"]');
    const emailInput = formHTML.querySelector('[name="email"]');
    const nameInput = formHTML.querySelector('[name="name"]');

    const trimedPasswordValue = passwordInput.value.trim();
    const trimedEmailValue = emailInput.value.trim();
    const trimedNameValue = nameInput && nameInput.value.trim();
    const userSubmitData = {
      email: trimedEmailValue,
      password: trimedPasswordValue,
      name: trimedNameValue,
    };

    try {
      if (trimedPasswordValue === '' || trimedEmailValue === '' || (nameInput && trimedNameValue === '')) {
        throw new Error(EMPTY_FIELD);
      }

      if (nameInput && trimedNameValue.length > MAX_NAME_LENGTH) {
        throw new Error(EXCEEDED_NAME_LENGTH);
      }

      if (!checkPassword(trimedPasswordValue)) {
        throw new Error(PASSWORD_REQUIRMENTS);
      }

      const data = await submitFunction(userSubmitData);
      if ('error' in data) {
        throw new Error(INCORRECT_VALUES);
      }

      localStorage.setItem('user-data', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default Authentication;
