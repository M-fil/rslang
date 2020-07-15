import create, { mainGameConstants } from '../../pathes';

const {
  SETTINGS_AUTOPLABACK_TEXT,
  SETTINGS_TRANSLATIONS_LABEL_TEXT,
} = mainGameConstants;

class SettingsControls {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create(
      'div', 'main-game__settings',
      [
        SettingsControls.renderCheckbox('autoplayback', SETTINGS_AUTOPLABACK_TEXT),
        SettingsControls.renderCheckbox('translations', SETTINGS_TRANSLATIONS_LABEL_TEXT),
      ],
    );

    return this.HTML;
  }

  static renderCheckbox(classNameType, labelText) {
    const inputId = `${classNameType}-checkbox`;
    const container = create('label', 'main-game__setting', '', null, ['for', inputId]);
    create('span', 'main-game__label-text', labelText, container);
    create(
      'input',
      `main-game__checkbox main-game__${classNameType}`, '', container,
      ['type', 'checkbox'], ['id', inputId], ['checked', 'true'],
    );
    create('span', 'main-game__fake-checkbox', '', container);

    return container;
  }
}

export default SettingsControls;
