import create from '../../utils/сreate';
import { authenticationTexts } from '../../constants/constants';

const {
  PASSWORD_LABEL_TEXT,
  EMAIL_LABEL_TEXT,
} = authenticationTexts;

class Authentication {
  constructor(title, classNameType) {
    this.HTML = null;
    this.title = title;
    this.classNameType = classNameType;
  }

  render() {
    const titleHTML = create('h3', `${this.classNameType}__title`, this.title);
    const formHTML = this.renderForm();

    this.HTML = create('div', `${this.classNameType}`, [titleHTML, formHTML]);
    return this.HTML;
  }

  renderForm() {
    const emailField = this.renderInputContainer(EMAIL_LABEL_TEXT, 'email', 'email');
    const passwordField = this.renderInputContainer(PASSWORD_LABEL_TEXT, 'password', 'password');

    const formHTML = create('form', `${this.classNameType}__form`, [emailField, passwordField]);
    return formHTML;
  }

  renderInputContainer(labelText, inputType, inputClassNameType) {
    const inputId = `${inputClassNameType}-field`;

    const container = create('div', `${this.classNameType}__field-container`);
    create('label', `${this.classNameType}__label`, labelText, container, ['for', inputId]);
    create('input', `${this.classNameType}__email-field`, '', container, ['id', inputId], ['type', inputType]);

    return container;
  }
}

export default Authentication;
