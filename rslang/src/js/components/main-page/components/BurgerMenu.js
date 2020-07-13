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
    this.burgerMenuHTML = document.querySelector('.burger-menu');
  }

  render() {
    if (!this.burgerMenuHTML) {
      this.burgerMenuOverlay = create('div', 'burger-menu-overlay');
      document.body.append(this.burgerMenuOverlay);

      this.container = create('div', 'burger-menu');
      this.wrapper = create('div', 'burger-menu__wrapper', '', this.container);
      this.wrapper.append(this.renderLogo());
      this.buttonsList = create('div', 'burger-menu__buttons-list', '', this.wrapper);
      this.renderHeaderButton(VOCABULARY_BUTTON_TEXT, VOCABULARY_CODE);
      this.renderHeaderButton(STATISTICS_BUTTON_TEXT, STATISTICS_CODE);
      this.renderHeaderButton(PROMO_BUTTON_TEXT, PROMO_CODE);
      this.renderHeaderButton(ABOUT_TEAM_TEXT, ABOUT_TEAM_CODE);
      this.renderHeaderButton(SETTINGS_BUTTON_TEXT, SETTINGS_CODE);

      return this.container;
    }

    return this.burgerMenuHTML;
  }

  static closeBurgerMenu() {
    const burgetMenuIcon = document.querySelector('.burger-menu-icon');
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerMenuOverlay = document.querySelector('.burger-menu-overlay');
    document.body.classList.remove('body_overflow-hidden');

    if (burgetMenuIcon && burgerMenu && burgerMenuOverlay) {
      burgetMenuIcon.classList.remove('burger-icon__closed');
      burgetMenuIcon.classList.add('hidden');
      burgerMenu.classList.remove('burger-menu_opened');
      burgerMenuOverlay.classList.remove('burger-menu-overlay_visible');
    }
  }

  static makeBurgerMenuIconVisible() {
    const burgetMenuIcon = document.querySelector('.burger-menu-icon');

    if (burgetMenuIcon) {
      burgetMenuIcon.classList.remove('hidden');
    }
  }

  static activateBurgerMenuHandler() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.burger-menu-icon');
      const overlayTarget = event.target.closest('.burger-menu-overlay');

      const burgetMenuIcon = document.querySelector('.burger-menu-icon');
      const burgerMenu = document.querySelector('.burger-menu');
      const burgerMenuOverlay = document.querySelector('.burger-menu-overlay');

      if (target) {
        target.classList.toggle('burger-icon__closed');
        burgerMenu.classList.toggle('burger-menu_opened');
        burgerMenuOverlay.classList.toggle('burger-menu-overlay_visible');
        document.body.classList.toggle('body_overflow-hidden');
      }

      if (overlayTarget) {
        burgetMenuIcon.classList.remove('burger-icon__closed');
        burgerMenu.classList.remove('burger-menu_opened');
        burgerMenuOverlay.classList.remove('burger-menu-overlay_visible');
        document.body.classList.remove('body_overflow-hidden');
      }
    });
  }
}

export default BurgerMenu;
