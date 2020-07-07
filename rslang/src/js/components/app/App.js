import create from '../../utils/сreate';

import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import Preloader from '../preloader/Preloader';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';
import Statistics from '../statistics/Statistics';

import MainPage from '../main-page/MainPage';

import CloseButton from '../mini-games/common/CloseButton';
import ShortTermStatistics from '../mini-games/common/ShortTermStatistics';

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
      vocabulary: {},
      settings: {},
      statistics: {},
    };

    this.container = null;
  }

  async run() {
    this.container = create('main', 'main-page__content', '', document.body);
    try {
      await this.checkIsUserAuthorized();
    } catch (error) {
      this.renderAuthorizationBlock();
      this.prelodaer.hide();
    }
  }

  activateMainPageHandlers() {
    this.activateLogOutButton();
    this.activateGoToTheMainPageButton();
    this.activateHeaderButtons();
    this.activateGameButtons();
  }

  renderAuthorizationBlock() {
    App.removeModalElements();
    localStorage.setItem('user-data', '');
    this.state.user.isAuthrorized = false;
    this.container.innerHTML = '';
    this.renderAuthenticationBlock('authorization');
    this.renderToggleAuthentication();
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
        this.renderMainPage();
      }
    });
  }

  activateHeaderButtons() {
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('[headerPageCode]');

      if (target) {
        const { headerPageCode } = target.dataset;

        switch (headerPageCode) {
          case STATISTICS_CODE:
          default:
            this.renderStatistics();
            break;
          case VOCABULARY_CODE:
            await this.renderVocabulary();
            break;
          case PROMO_CODE:
            break;
          case ABOUT_TEAM_CODE:
            break;
          case SETTINGS_CODE:
            this.renderSettingsBlock();
            break;
        }
      }
    });
  }

  renderStatistics() {
    this.container.innerHTML = '';
    this.statistics.render('.main-page__content');
  }

  async renderVocabulary() {
    this.container.innerHTML = '';
    await this.vocabulary.render();
  }

  renderPromoPage() {}

  renderAboutTeamPage() {}

  renderSettingsBlock() {
    this.settings.renderSettingsWindow();
  }

  activateGameButtons() {
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('[gameCode]');

      if (target) {
        const { gameCode } = target.dataset;
        switch (gameCode) {
          case mainGame.code:
          default:
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
        }
      }
    });
  }

  async renderMainGame() {
    this.container.innerHTML = '';
    this.mainGame = new MainGame(this.createMiniGameParameterObject());
    await this.mainGame.render('.main-page__content');
  }

  async renderSpeakItGame() {
    this.container.innerHTML = '';
    this.speakIt = new SpeakIt(this.createMiniGameParameterObject());
    await this.speakIt.run('.main-page__content');
  }

  async renderEnglishPuzzle() {
    this.container.innerHTML = '';
    this.englishPuzzle = new EnglishPuzzle(this.createMiniGameParameterObject());
    await this.englishPuzzle.start('.main-page__content');
  }

  renderAuditionGame() {
    this.container.innerHTML = '';
    this.auditionGame = new AuditionGame(this.createMiniGameParameterObject());
    this.auditionGame.render(5, 5, '.main-page__content');
  }

  async renderSavannah() {
    this.container.innerHTML = '';
    this.savannah = new SavannahGame(this.createMiniGameParameterObject());
    await this.savannah.render('.main-page__content');
  }

  renderSprintGame() {
    this.container.innerHTML = '';
    this.sprintGame = new SprintGame(this.createMiniGameParameterObject());
    const html = this.SprintGame.SprintRender();
    this.container.append(html);
  }

  async renderFindAPair() {
    this.container.innerHTML = '';
    this.findAPair = new FindAPair(this.createMiniGameParameterObject());
    await this.findAPair.init();
    this.renderStartPage('.main-page__content');
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

  async initSettings() {
    this.settings = new Settings(this.state.user);
    await this.settings.init();
    this.state.settings = this.settings.getSettings();
  }

  async initStatistics() {
    this.statistics = new Statistics();
    await this.settings.init();
  }

  async initVocabulary() {
    this.vocabulary = new Vocabulary(this.state.user);
    await this.vocabulary.init();
  }

  async initAuxilaryComponents() {
    await this.initSettings();
    await this.initStatistics();
    await this.initVocabulary();
  }

  renderMainPage() {
    this.container.innerHTML = '';
    const { name, email } = this.state.user;
    this.mainPage = new MainPage(name || email);
    const html = this.mainPage.render();
    this.container.append(html);
  }

  activateLogOutButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.header__logout-button');

      if (target) {
        this.renderAuthorizationBlock();
      }
    });
  }

  activateAuthenticationForm() {
    document.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (event.target.classList.contains('authorization__form')) {
        this.prelodaer.show();
        await this.signInUser();
        this.prelodaer.hide();
      }
      if (event.target.classList.contains('registration__form')) {
        try {
          this.prelodaer.show();
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
          this.prelodaer.hide();
        } catch (error) {
          console.log(error);
          this.prelodaer.hide();
          Authentication.createErrorBlock(error.message);
        }
      }
    });
  }

  async signInUser() {
    try {
      const data = await Authentication.submitData(loginUser);
      this.state = {
        ...this.state,
        user: {
          ...this.state.user,
          userId: data.userId,
          token: data.token,
          refreshToken: data.refreshToken,
          name: data.name,
        },
      };
      document.querySelector('.authentication').remove();
      document.querySelector('.authentication__buttons').remove();
      await this.initAuxilaryComponents();
      this.renderMainPage();
    } catch (error) {
      console.log(error);
      Authentication.createErrorBlock(error.message);
    }
  }

  async checkIsUserAuthorized() {
    const savedUserData = localStorage.getItem('user-data');
    try {
      this.prelodaer = new Preloader();
      this.prelodaer.render();
      this.prelodaer.show();

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
      this.activateMainPageHandlers();
      this.renderMainPage();
      this.prelodaer.hide();
    } catch (error) {
      console.log(error);
      const parsedData = JSON.parse(savedUserData);
      const { userId, refreshToken } = parsedData;
      const data = await getRefreshToken(userId, refreshToken);
      this.state.user = {
        ...this.state.user,
        ...data,
      };
      await this.initAuxilaryComponents();
      this.activateMainPageHandlers();
      this.renderMainPage();
      this.prelodaer.hide();
    }
  }

  renderToggleAuthentication() {
    const buttonsContainer = create('div', 'authentication__buttons');
    this.authenticationToggleButton = create(
      'button',
      'authentication__toggle-button',
      REGISTRATION_TITLE,
      buttonsContainer,
      ['type', 'button'], ['authenticationType', 'authorization'],
    );
    this.container.prepend(buttonsContainer);

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
    const authenticationHTML = document.querySelector('.authentication');
    if (authenticationHTML) {
      authenticationHTML.remove();
    }
    const authentication = type === 'registration' ? new Registration() : new Authorization();

    this.container.append(authentication.render());
  }
}

export default App;
