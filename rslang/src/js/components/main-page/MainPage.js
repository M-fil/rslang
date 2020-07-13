import {
  create,
  mainPageEnglishGoal,
  mainPageConstants,
  mainPageGoalsImages,
  mainPageUrls,
} from './pathes';

import Header from './components/Header';
import MainBlock from './components/MainBlock';
import BurgerMenu from './components/BurgerMenu';

const {
  TRAVEL,
  WORK,
  STUDY,
  WATCH_AND_READ,
  PROGRESS,
  GO_TO_THE_NEW_COUNTRY,
} = mainPageEnglishGoal;

const {
  TRAVEL_IMAGE,
  WORK_IMAGE,
  STUDY_IMAGE,
  WATCH_AND_READ_IMAGE,
  PROGRESS_IMAGE,
  GO_TO_THE_NEW_COUNTRY_IMAGE,
} = mainPageGoalsImages;

const {
  ENGLISH_GOALS_TITLE,
} = mainPageConstants;

const {
  MAIN_PAGE_CHICKEN_IMAGE,
} = mainPageUrls;

class MainPage {
  constructor(userName, userEmail) {
    this.HTML = null;
    this.userName = userName;
    this.userEmail = userEmail;
  }

  render() {
    this.HTML = create('div', 'main-page');
    this.burgerMenu = new BurgerMenu();
    this.header = new Header(this.userName, this.userEmail);
    this.mainBlock = new MainBlock();

    document.body.append(this.burgerMenu.render());
    this.HTML.append(this.header.render());
    this.userContent = create(
      'div', 'main-page__user-content',
      [
        this.renderStartPageForMainPage(),
        MainPage.renderGoalBlock(),
        this.mainBlock.render(),
      ], this.HTML,
    );

    return this.HTML;
  }

  updateUserData(userName, userEmail) {
    const userInfoTitle = userName
      ? `${userName} / ${userEmail}`
      : userEmail;
    const userTextContent = userName || userEmail;

    this.header.userNameHTML.textContent = userTextContent;
    this.header.userNameHTML.title = userInfoTitle;
  }

  renderStartPageForMainPage() {
    const container = create('div', 'main-page__start-page');
    this.mainImage = create('img', 'start-page__main-image', '', null, ['src', MAIN_PAGE_CHICKEN_IMAGE]);
    create('div', 'start-page__main-image-container', this.mainImage, container);
    this.arrowButton = create('button', 'start-page__arrow-bottom', '<i class="fas fa-arrow-down"></i>', container);
    this.arrowButton.addEventListener('click', MainPage.scrollIntoGamesBlock);

    return container;
  }

  static scrollIntoGamesBlock() {
    const blockId = document.querySelector('[data-scroll-id="games-block"]');
    if (blockId) {
      localStorage.setItem('arrow-bottom-clicked', 'true');
      blockId.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  static renderGoalBlock() {
    const container = create('div', 'main-page__goals-block');
    create('div', 'goals__title', ENGLISH_GOALS_TITLE, container);
    const goalsList = create('div', 'main-page__goals-list', '', container);
    goalsList.append(
      MainPage.renderGoal(TRAVEL, TRAVEL_IMAGE),
      MainPage.renderGoal(WORK, WORK_IMAGE),
      MainPage.renderGoal(STUDY, STUDY_IMAGE),
      MainPage.renderGoal(WATCH_AND_READ, WATCH_AND_READ_IMAGE),
      MainPage.renderGoal(PROGRESS, PROGRESS_IMAGE),
      MainPage.renderGoal(GO_TO_THE_NEW_COUNTRY, GO_TO_THE_NEW_COUNTRY_IMAGE),
    );

    return container;
  }

  static renderGoal(goalText, imageSrc) {
    const container = create('div', 'main-page__goal');
    create('img', 'goal__image', '', container, ['src', imageSrc]);
    create('div', 'goal__text', goalText, container);

    return container;
  }
}

export default MainPage;
