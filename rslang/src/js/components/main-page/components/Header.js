import {
  create,
  mainPageHeaderButtonConstants,
  mainPageUrls,
} from '../pathes';
import LogoutModalWindow from './LogoutModalWindow';

const {
  MAIN_PAGE_LOGO_URL,
} = mainPageUrls;

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
  LOG_OUT_BUTTON_TEXT,
} = mainPageHeaderButtonConstants;

class Header {
  constructor(userName) {
    this.HTML = null;
    this.userName = userName;
    this.modalWindow = new LogoutModalWindow();
  }

  render() {
    const settingsIconHTML = '<i class="fas fa-cog"></i>';
    this.HTML = create('header', 'main-page__header');
    this.HTML.append(this.renderLogo());
    this.renderBurgerMenuIcon();
    this.buttonsList = create('div', 'header__buttons-list', '', this.HTML);
    this.renderHeaderButton(VOCABULARY_BUTTON_TEXT, VOCABULARY_CODE);
    this.renderHeaderButton(STATISTICS_BUTTON_TEXT, STATISTICS_CODE);
    this.renderHeaderButton(PROMO_BUTTON_TEXT, PROMO_CODE);
    this.renderHeaderButton(ABOUT_TEAM_TEXT, ABOUT_TEAM_CODE);
    this.renderHeaderButton(settingsIconHTML, SETTINGS_CODE);
    this.HTML.append(this.renderUserBlock());

    return this.HTML;
  }

  renderLogo() {
    this.startPageLogoImage = create('img', 'main-page__image-logo', '', null, ['src', MAIN_PAGE_LOGO_URL]);
    return create('div', 'main-page__logo', this.startPageLogoImage);
  }

  renderUserBlock() {
    const container = create('div', 'header__user-block');
    const userIcon = create('i', 'fas fa-user header__user-icon');
    const userName = create('span', 'user-name__text', this.userName);
    create('div', 'header__user-name', [userIcon, userName], container);
    this.logoutButton = create('button', 'header__logout-button', LOG_OUT_BUTTON_TEXT, container);
    this.logoutButton.addEventListener('click', this.modalWindow.show.bind(this.modalWindow));

    return container;
  }

  renderHeaderButton(buttonText, buttonCode) {
    create('div', 'header__button', buttonText, this.buttonsList, ['pageCode', buttonCode]);
  }

  renderBurgerMenuIcon() {
    const burgerMenuIconHTML = document.querySelector('.burger-menu-icon');
    if (!burgerMenuIconHTML) {
      this.burgerMenuIcon = create('div', 'burger-menu-icon');
      create('div', 'burger-menu-icon__line', '', this.burgerMenuIcon);
      create('div', 'burger-menu-icon__line', '', this.burgerMenuIcon);
      create('div', 'burger-menu-icon__line', '', this.burgerMenuIcon);

      document.body.append(this.burgerMenuIcon);
    }
  }
}

export default Header;
