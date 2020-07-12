import create from '../../utils/сreate';
import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import Preloader from '../preloader/Preloader';
import PromoPage from '../promo-page/PromoPage';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';
import Statistics from '../statistics/Statistics';
import AboutTeam from '../about-team/AboutTeam';

import MainPage from '../main-page/MainPage';

import CloseButton from '../mini-games/common/CloseButton';
import ShortTermStatistics from '../mini-games/common/ShortTermStatistics';
import BurgerMenu from '../main-page/components/BurgerMenu';

import MainGame from '../main-game/MainGame';
import SavannahGame from '../mini-games/savannah/Savannah';
import SpeakIt from '../mini-games/speak-it/SpeakIt';
import EnglishPuzzle from '../mini-games/english-puzzle/EnglishPuzzle';
import FindAPair from '../mini-games/find-a-pair/find-a-pair';
import SprintGame from '../mini-games/sprint/Sprint';
import AuditionGame from '../mini-games/audition-game/AuditionGame';

import {
  createUser,
  loginUser,
  getUserById,
  getRefreshToken,
} from '../../service/service';
import {
  errorTypes,
  authenticationConstants,
  mainPageHeaderButtonConstants,
  gamesInfo,
} from '../../constants/constants';

const {
  USER_IS_NOT_AUTHORIZED,
} = errorTypes;

const {
  AUTHORIZATION_TITLE,
  REGISTRATION_TITLE,
} = authenticationConstants;

const {
  mainGame,
  savannah,
  speakIt,
  findAPair,
  sprint,
  audioGame,
  englishPuzzle,
} = gamesInfo;

const {
  STATISTICS_CODE,
  VOCABULARY_CODE,
  PROMO_CODE,
  ABOUT_TEAM_CODE,
  SETTINGS_CODE,
} = mainPageHeaderButtonConstants;

class App {
  constructor() {
    this.closeButton = new CloseButton();
    this.shortTermStatistics = new ShortTermStatistics();

    this.state = {
      user: {
        isAuthrorized: false,
        userId: '',
        refreshToken: '',
        token: '',
        email: '',
        name: '',
      },
      currentPage: localStorage.getItem('current-page'),
    };

    const arrowSavedState = localStorage.getItem('arrow-bottom-clicked');
    this.isArrowBottomButtonClicked = arrowSavedState && JSON.parse(arrowSavedState);
    this.container = null;
  }

  async run() {
    this.container = create('main', 'main-page__content', '', document.body);
    try {
      await this.checkIsUserAuthorized();
      this.activateMainPageHandlers();
    } catch (error) {
      this.clearAppLocalData();
      this.renderAuthorizationBlock();
      this.activateMainPageHandlers();
      this.preloader.hide();
    }
  }

  clearAppLocalData() {
    localStorage.clear();
    this.state.currentPage = '';
    this.isArrowBottomButtonClicked = false;
  }

  activateMainPageHandlers() {
    this.activateLogOutButton();
    this.activateGoToTheMainPageButton();
    this.activatePagesRenders();
    BurgerMenu.activateBurgerMenuHandler();
  }

  renderAuthorizationBlock() {
    App.removeModalElements();
    this.state.user.isAuthrorized = false;
    this.clearMainContainersBeforeRender();
    this.renderAuthenticationBlock('authorization');
    this.activateToggleAuthentication();
    this.activateAuthenticationForm();
  }

  createMiniGameParameterObject() {
    return {
      user: this.state.user,
      closeButton: this.closeButton,
      shortTermStatistics: this.shortTermStatistics,
    };
  }

  activateGoToTheMainPageButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('#button-go-to-main-page');
      if (target) {
        this.closeButton.exitButton.classList.remove('main-game__exit-button');
        this.closeButton.modalWindow.modalClose.removeAttribute('id');
        this.clearMainContainersBeforeRender();
        this.saveCurrentPage();
        this.renderMainPage();
        BurgerMenu.makeBurgerMenuIconVisible();
      }
    });
  }

  saveCurrentPage(page = '') {
    this.state.currentPage = page;
    if (page === SETTINGS_CODE) {
      this.state.currentPage = '';
    }

    localStorage.setItem('current-page', this.state.currentPage);
  }

  renderStatistics() {
    this.statistics.render('.main-page__content');
  }

  async renderVocabulary() {
    const html = await this.vocabulary.render();
    this.container.append(html);
  }

  renderPromoPage() {
    this.promo = new PromoPage('.main-page__content');
    this.promo.render();
  }

  renderAboutTeamPage() {
    this.aboutTeam = new AboutTeam('.main-page__content');
    this.aboutTeam.render();
  }

  renderSettingsBlock(isRenderAfterReload = false) {
    if (isRenderAfterReload) {
      this.renderMainPage();
    }
    const { background: settingsBackground } = this.settings.modalWindow;
    this.settings.openSettingsWindow();
    settingsBackground.classList.add('modal-block_top-layer');
  }

  activatePagesRenders() {
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('[data-page-code]');

      if (target) {
        const { pageCode } = target.dataset;
        BurgerMenu.closeBurgerMenu();
        await this.selectPageRenderingByPageCode(pageCode, false);
      }
    });
  }

  async selectPageRenderingByPageCode(pageCode, isRenderAfterReload = true) {
    this.saveCurrentPage(pageCode);

    this.clearMainContainersBeforeRender(pageCode);
    document.body.scrollIntoView();
    this.preloader.show();
    switch (pageCode) {
      case mainGame.code:
        await this.renderMainGame();
        break;
      case speakIt.code:
        await this.renderSpeakItGame();
        break;
      case englishPuzzle.code:
        await this.renderEnglishPuzzle();
        break;
      case audioGame.code:
        this.renderAuditionGame();
        break;
      case savannah.code:
        await this.renderSavannah();
        break;
      case sprint.code:
        await this.renderSprintGame();
        break;
      case findAPair.code:
        await this.renderFindAPair();
        break;
      case STATISTICS_CODE:
        this.renderStatistics();
        break;
      case VOCABULARY_CODE:
        await this.renderVocabulary();
        break;
      case PROMO_CODE:
        this.renderPromoPage();
        break;
      case ABOUT_TEAM_CODE:
        this.renderAboutTeamPage();
        break;
      case SETTINGS_CODE:
        this.renderSettingsBlock(isRenderAfterReload);
        break;
      default:
        this.renderMainPage();
    }
    this.preloader.hide();
  }

  clearMainContainersBeforeRender(targetPage = '') {
    if (targetPage === SETTINGS_CODE) return;

    this.container.innerHTML = '';
    const startGameWindow = document.querySelector('.start-game-window');
    const dailyStatistics = document.querySelector('.daily-statistics__overlay');
    if (startGameWindow) {
      startGameWindow.remove();
    }
    if (dailyStatistics) {
      dailyStatistics.remove();
    }
  }

  async renderMainGame() {
    this.mainGame = new MainGame(this.createMiniGameParameterObject());
    await this.mainGame.render('.main-page__content');
  }

  async renderSpeakItGame() {
    this.speakIt = new SpeakIt(this.createMiniGameParameterObject(), '.main-page__content');
    await this.speakIt.run();
  }

  async renderEnglishPuzzle() {
    this.englishPuzzle = new EnglishPuzzle(this.createMiniGameParameterObject());
    await this.englishPuzzle.start('.main-page__content');
  }

  renderAuditionGame() {
    if (!this.auditionGame) {
      this.auditionGame = new AuditionGame(
        this.createMiniGameParameterObject(), this.container,
      );
    }
    this.auditionGame.render();
  }

  async renderSavannah() {
    if (!this.savannah) {
      this.savannah = new SavannahGame(this.createMiniGameParameterObject());
    }
    await this.savannah.render('.main-page__content');
  }

  renderSprintGame() {
    this.sprintGame = new SprintGame(this.createMiniGameParameterObject());
    this.sprintGame.SprintRender('.main-page__content');
  }

  async renderFindAPair() {
    this.findAPair = new FindAPair(this.createMiniGameParameterObject());
    await this.findAPair.init();
    this.findAPair.renderStartPage('.main-page__content');
  }

  static removeModalElements() {
    const startGameWindow = document.querySelector('.start-game-window');
    const exitButton = document.querySelector('.exit-button');

    if (startGameWindow) {
      startGameWindow.remove();
    }

    if (exitButton) {
      exitButton.remove();
    }
  }

  updateUserState(newUserData) {
    const { name, email } = newUserData;

    this.mainPage.updateUserName(name || email);
    this.state.user = {
      ...this.state.user,
      name,
      email,
    };
  }

  async initSettings() {
    if (!this.settings) {
      this.settings = new Settings(this.state.user);
      await this.settings.init();
      this.settings.setUserChangesListener(this.updateUserState.bind(this));
    }
  }

  async initStatistics() {
    if (!this.statistics) {
      this.statistics = new Statistics(this.state.user);
      await this.statistics.init();
    }
  }

  async initVocabulary() {
    if (!this.vocabulary) {
      this.vocabulary = new Vocabulary(this.state.user);
      await this.vocabulary.init();
    }
  }

  async initAuxilaryComponents() {
    await this.initSettings();
    await this.initStatistics();
    await this.initVocabulary();
  }

  renderMainPage() {
    const { name, email } = this.state.user;
    this.mainPage = new MainPage(name || email);
    const html = this.mainPage.render();
    this.container.append(html);
    BurgerMenu.makeBurgerMenuIconVisible();

    if (this.isArrowBottomButtonClicked) {
      setTimeout(() => {
        MainPage.scrollIntoGamesBlock();
      }, 1000);
    }
  }

  activateLogOutButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('#logout-trigger');

      if (target) {
        this.renderAuthorizationBlock();
        this.clearAppLocalData();
      }
    });
  }

  activateAuthenticationForm() {
    document.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (event.target.classList.contains('authorization__form')) {
        this.preloader.show();
        await this.signInUser();
        this.preloader.hide();
      }
      if (event.target.classList.contains('registration__form')) {
        try {
          this.preloader.show();
          const data = await Authentication.submitData(createUser);
          this.state = {
            ...this.state,
            user: {
              ...this.state.user,
              userId: data.userId,
              email: data.email,
            },
          };
          await this.signInUser();
          this.preloader.hide();
        } catch (error) {
          this.preloader.hide();
          Authentication.createErrorBlock(error.message);
        }
      }
    });
  }

  async signInUser() {
    try {
      const data = await Authentication.submitData(loginUser);
      const userData = await getUserById(data.userId, data.token);
      this.state = {
        ...this.state,
        user: {
          ...this.state.user,
          userId: data.userId,
          token: data.token,
          refreshToken: data.refreshToken,
          name: userData.name,
          email: userData.email,
        },
      };
      document.querySelector('.authentication__wrapper').remove();
      await this.initAuxilaryComponents();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
    } catch (error) {
      Authentication.createErrorBlock(error.message);
    }
  }

  async checkIsUserAuthorized() {
    const savedUserData = localStorage.getItem('user-data');
    try {
      this.preloader = new Preloader();
      this.preloader.render();
      this.preloader.show();

      let data = null;
      switch (true) {
        case savedUserData !== '': {
          const { userId, token } = JSON.parse(savedUserData);
          data = await getUserById(userId, token);
          break;
        }
        case this.state.user.userId && this.state.user.token: {
          const { userId, token } = this.state.user;
          data = await getUserById(userId, token);
          break;
        }
        default:
          throw new Error(USER_IS_NOT_AUTHORIZED);
      }

      this.state.user.isAuthrorized = true;
      this.state.user = {
        ...this.state.user,
        userId: data.id,
        email: data.email,
        token: JSON.parse(savedUserData).token,
        refreshToken: JSON.parse(savedUserData).refreshToken,
        name: data.name,
      };
      await this.initAuxilaryComponents();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
      this.preloader.hide();
    } catch (error) {
      const parsedData = JSON.parse(savedUserData);
      const { userId, refreshToken } = parsedData;
      const data = await getRefreshToken(userId, refreshToken);
      this.state.user = {
        ...this.state.user,
        ...data,
      };
      await this.initAuxilaryComponents();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
      this.preloader.hide();
    }
  }

  activateToggleAuthentication() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.authentication__toggle-button');
      if (target) {
        const { authenticationType } = target.dataset;
        const typeToInit = authenticationType === 'registration' ? 'authorization' : 'registration';
        this.renderAuthenticationBlock(typeToInit);
        target.dataset.authenticationType = typeToInit;
        target.textContent = authenticationType === 'registration'
          ? REGISTRATION_TITLE
          : AUTHORIZATION_TITLE;
      }
    });
  }

  renderAuthenticationBlock(type) {
    const authenticationHTML = document.querySelector('.authentication__wrapper');
    if (authenticationHTML) {
      authenticationHTML.remove();
    }
    const authentication = type === 'registration' ? new Registration() : new Authorization();

    this.container.append(authentication.render());
  }
}

export default App;
