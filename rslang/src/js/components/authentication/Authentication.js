import create from '../../utils/сreate';
import { authenticationConstants, errorTypes } from '../../constants/constants';
import { checkPassword } from '../../utils/validators';

const {
  PASSWORD_LABEL_TEXT,
  EMAIL_LABEL_TEXT,
  REGISTRATION_KEY,
  NAME_LABEL_TEXT,
  MAX_NAME_LENGTH,
  CHICKEN_IMAGE_PATH,
  APP_DESCRIPTION,
  PASSWORD_PLACEHOLDER,
  EMAIL_PLACEHOLDER,
  NAME_PLACEHOLDER,
  REGISTRATION_TITLE,
  AUTHORIZATION_KEY,
  AUTHORIZATION_TITLE,
  LOGO_IMAGE_PATH,
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
    this.wrapper = create('div', 'authentication__wrapper');
    const logoImageBlock = create('div', 'authentication__logo-image-block', '', this.wrapper);
    this.logoImage = create('img', 'authentication__logo-image', '', logoImageBlock, ['src', LOGO_IMAGE_PATH]);

    this.mainContent = create('div', 'authentication__main-content');
    const titleHTML = create('h3', `${this.classNameType}__title authentication__title`, this.title);
    const formHTML = this.renderForm();
    formHTML.prepend(titleHTML);

    this.HTML = create(
      'div', `${this.classNameType} authentication`,
      [this.renderToggleButton(), formHTML], this.mainContent,
    );
    this.mainContent.append(
      this.renderLogoContainer(), this.HTML,
    );
    this.wrapper.append(this.mainContent);

    return this.wrapper;
  }

  renderLogoContainer() {
    this.logoContainer = create('div', 'authentication__logo-container');
    create('div', 'authentication__app-description', APP_DESCRIPTION, this.logoContainer);
    create('img', 'authentication__chiecken-image', '', this.logoContainer, ['src', CHICKEN_IMAGE_PATH]);

    return this.logoContainer;
  }

  renderForm() {
    let nameField = null;
    if (this.formKey === REGISTRATION_KEY) {
      nameField = this.renderInputContainer(NAME_LABEL_TEXT, 'text', 'name', NAME_PLACEHOLDER);
    }
    const emailField = this.renderInputContainer(EMAIL_LABEL_TEXT, 'email', 'email', EMAIL_PLACEHOLDER);
    const passwordField = this.renderInputContainer(PASSWORD_LABEL_TEXT, 'password', 'password', PASSWORD_PLACEHOLDER);
    const submitButton = create('button', `${this.classNameType}__submit-button authentication__button`, this.submitButtonText);

    const formHTML = create(
      'form', `${this.classNameType}__form authentication__form`,
      [nameField, emailField, passwordField, submitButton],
    );
    return formHTML;
  }

  renderInputContainer(
    labelText, inputType, inputClassNameType, inputPlacehodler,
  ) {
    const inputId = `${inputClassNameType}-field`;

    const container = create('div', `${this.classNameType}__field-container authentication__field-container`);
    create(
      'label',
      `${this.classNameType}__label authentication__label`,
      labelText, container,
      ['for', inputId],
    );

    create(
      'input',
      `${this.classNameType}__email-field authentication__field`,
      '', container,
      ['id', inputId], ['type', inputType],
      ['name', inputClassNameType], ['placeholder', inputPlacehodler],
    );

    return container;
  }

  renderToggleButton() {
    const buttonsContainer = create('div', 'authentication__buttons');
    const title = this.formKey === AUTHORIZATION_KEY ? REGISTRATION_TITLE : AUTHORIZATION_TITLE;
    this.authenticationToggleButton = create(
      'button',
      'authentication__toggle-button',
      title,
      buttonsContainer,
      ['type', 'button'], ['authenticationType', this.formKey],
    );

    return buttonsContainer;
  }

  static createErrorBlock(message) {
    const errorBlockHTML = document.querySelector('.authentication__error-block');
    if (errorBlockHTML) {
      errorBlockHTML.remove();
    }

    const authenticationForm = document.querySelector('.authentication__form');
    const errorBlock = create('div', 'authentication__error-block', message);
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
