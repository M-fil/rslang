import {
  create,
  mainPageEnglishGoal,
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
        this.renderGoalBlock(),
        this.mainBlock.render(),
      ], this.HTML,
    );

    return this.HTML;
  }
}

renderStartPageForMainPage() {
  const container = create('div', 'main-page__start-page');
  this.startPageLogoImage = create('img', 'start-page__image-logo', '', null, ['src', '']);
  create('div', 'star-page__logo', '', this.startPageLogoImage, container);
  this.mainImage = create('img', 'start-page__main-image', '', null, ['src', '']);
  create('div', 'start-page__main-image-container', this.mainImage, container);
  create('button', 'start-page__arrow-bottom', '<i class="fas fa-arrow-down"></i>', container);

  return container;
}

renderGoalBlock() {
  const container = create('div', 'main-page__goals');
  container.append(
    this.renderGoal(TRAVEL, ''),
    this.renderGoal(WORK, ''),
    this.renderGoal(STUDY, ''),
    this.renderGoal(WATCH_AND_READ, ''),
    this.renderGoal(PROGRESS, ''),
    this.renderGoal(GO_TO_THE_NEW_COUNTRY, ''),
  );

  return container;
}

renderGoal(goalText, imageSrc) {
  const container = create('div', 'main-page__goal');
  create('img', 'goal__image', '', container, ['src', imageSrc]);
  create('div', 'goalText', goalText, container);

  return container;
}

export default MainPage;
