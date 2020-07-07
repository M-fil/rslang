import {
  create,
  mainPageEnglishGoal,
  mainPageConstants,
  mainPageGoalsImages,
  mainPageUrls,
} from './pathes';

import Header from './components/Header';
import MainBlock from './components/MainBlock';

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
  MAIN_PAGE_LOGO_URL,
  MAIN_PAGE_CHICKEN_IMAGE,
} = mainPageUrls;

class MainPage {
  constructor(userName) {
    this.HTML = null;
    this.userName = userName;
  }

  render() {
    this.HTML = create('div', 'main-page');
    this.header = new Header(this.userName);
    this.mainBlock = new MainBlock();

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

  renderStartPageForMainPage() {
    const container = create('div', 'main-page__start-page');
    this.startPageLogoImage = create('img', 'start-page__image-logo', '', null, ['src', MAIN_PAGE_LOGO_URL]);
    create('div', 'star-page__logo', this.startPageLogoImage, container);
    this.mainImage = create('img', 'start-page__main-image', '', null, ['src', MAIN_PAGE_CHICKEN_IMAGE]);
    create('div', 'start-page__main-image-container', this.mainImage, container);
    create('button', 'start-page__arrow-bottom', '<i class="fas fa-arrow-down"></i>', container);

    return container;
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
    create('div', 'goalText', goalText, container);
  
    return container;
  }
}

export default MainPage;
