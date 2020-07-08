import {
  create,
  mainPageHeaderButtonConstants,
} from '../pathes';
import Header from './Header';

const {
  STATISTICS_BUTTON_TEXT,
  VOCABULARY_BUTTON_TEXT,
  PROMO_BUTTON_TEXT,
  ABOUT_TEAM_TEXT,
  SETTINGS_BUTTON_TEXT,
  STATISTICS_CODE,
  VOCABULARY_CODE,
  PROMO_CODE,
  ABOUT_TEAM_CODE,
  SETTINGS_CODE,
} = mainPageHeaderButtonConstants;

class BurgerMenu extends Header {
  constructor(userName) {
    super(userName);
    this.userName = userName;
  }

  render() {
    this.container = create('div', 'burger-menu');
    this.wrapper = create('div', 'burger-menu__wrapper', '', this.container);
    this.wrapper.append(this.renderUserBlock());
    this.buttonsList = create('div', 'burger-menu__buttons-list', '', this.wrapper);
    this.renderHeaderButton(VOCABULARY_BUTTON_TEXT, VOCABULARY_CODE);
    this.renderHeaderButton(STATISTICS_BUTTON_TEXT, STATISTICS_CODE);
    this.renderHeaderButton(PROMO_BUTTON_TEXT, PROMO_CODE);
    this.renderHeaderButton(ABOUT_TEAM_TEXT, ABOUT_TEAM_CODE);
    this.renderHeaderButton(SETTINGS_BUTTON_TEXT, SETTINGS_CODE);
    this.wrapper.append(this.renderLogo());

    return this.container;
  }
}

export default BurgerMenu;
