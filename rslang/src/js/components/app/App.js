import create from '../../utils/сreate';

import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import MainGame from '../main-game/MainGame';
import Preloader from '../preloader/Preloader';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';
import SavannahGame from '../mini-games/savannah/Savannah';

import SpeakIt from '../mini-games/speak-it/SpeakIt';
import CloseButton from '../mini-games/common/CloseButton';
import ShortTermStatistics from '../mini-games/common/ShortTermStatistics';

import {
  createUser,
  loginUser,
  getUserById,
  getRefreshToken,
} from '../../service/service';
import {
  errorTypes,
  authenticationConstants,
} from '../../constants/constants';

const {
  USER_IS_NOT_AUTHORIZED,
} = errorTypes;

const {
  AUTHORIZATION_TITLE,
  REGISTRATION_TITLE,
} = authenticationConstants;

class App {
  constructor() {
    this.closeButton = new CloseButton();
    this.shortTermStatistics = new ShortTermStatistics();
    this.preloader = new Preloader();

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
        this.goToTheMainPageHanlder();
      }
    });
  }

  goToTheMainPageHanlder() {
    this.container.innerHTML = '';
  }

  async run() {
    this.container = create('main', 'main-page__content', '', document.body);
    try {
      await this.checkIsUserAuthorized();
    } catch (error) {
      App.removeModalElements();
      localStorage.setItem('user-data', '');
      this.state.user.isAuthrorized = false;
      this.container.innerHTML = '';
      this.renderAuthenticationBlock('authorization');
      this.activateToggleAuthentication();
      this.activateAuthenticationForm();
      this.preloader.hide();
    }
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
    const settings = new Settings(this.state.user);
    await settings.init();
    this.state.settings = settings.getSettings();
  }

  async renderVocabulary(userState) {
    this.vocabulary = new Vocabulary(userState);
    await this.vocabulary.init();
    const html = await this.vocabulary.render();
    document.body.append(html);
  }

  async renderSpeakItGame() {
    this.speakIt = new SpeakIt(this.createMiniGameParameterObject());
    await this.speakIt.run();
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
      document.querySelector('.authentication__wrapper').remove();
      await this.initSettings();
      await this.renderSpeakItGame();
    } catch (error) {
      Authentication.createErrorBlock(error.message);
    }
  }

  async renderSavannahGame() {
    this.savannahGame = new SavannahGame(this.createMiniGameParameterObject());
    await this.savannahGame.render();
  }

  async checkIsUserAuthorized() {
    const savedUserData = localStorage.getItem('user-data');
    try {
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
      await this.initSettings();
      await this.renderSpeakItGame();
      this.preloader.hide();
    } catch (error) {
      const parsedData = JSON.parse(savedUserData);
      const { userId, refreshToken } = parsedData;
      const data = await getRefreshToken(userId, refreshToken);
      this.state.user = {
        ...this.state.user,
        ...data,
      };
      await this.initSettings();
      await this.renderSpeakItGame();
      this.preloader.hide();
    }
  }

  async renderMainGame(userState) {
    this.mainGame = new MainGame(userState);
    await this.mainGame.render('.main-page__content');
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
