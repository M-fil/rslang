import {
  create,
  mainPageHeaderConstants,
} from '../pathes';

const {
  STATISTICS_BUTTON_TEXT,
  VOCABULARY_BUTTON_TEXT,
  PROMO_BUTTON_TEXT,
  ABOUT_TEAM_TEXT,
  STATISTICS_CODE,
  VOCABULARY_CODE,
  PROMO_CODE,
  ABOUT_TEAM_CODE,
  SETTINGS_CODE,
} = mainPageHeaderConstants;

class Header {
  constructor(userName) {
    this.HTML = null;
    this.userName = userName;
  }

  render() {
    const settingsIconHTML = '<i class="fas fa-cog"></i>';
    this.HTML = create('header', 'main-page__header');
    this.buttonsList = create('div', 'header__buttons-list');
    this.renderHeaderButton(VOCABULARY_BUTTON_TEXT, VOCABULARY_CODE);
    this.renderHeaderButton(STATISTICS_BUTTON_TEXT, STATISTICS_CODE);
    this.renderHeaderButton(settingsIconHTML, SETTINGS_CODE);
    this.renderHeaderButton(PROMO_BUTTON_TEXT, PROMO_CODE);
    this.renderHeaderButton(ABOUT_TEAM_TEXT, ABOUT_TEAM_CODE);
    create('div', 'header__user-name', this.userName, this.HTML);

    return this.HTML;
  }

  renderHeaderButton(buttonText, buttonCode) {
    create('div', 'header__button', buttonText, this.buttonsList, ['pageType', buttonCode]);
  }
}

export default Header;
