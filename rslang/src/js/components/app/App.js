import create from '../../utils/сreate';

import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import MainGame from '../main-game/MainGame';
import Preloader from '../preloader/Preloader';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';

import SpeakIt from '../mini-games/speak-it/SpeakIt';

import {
  createUser,
  loginUser,
  getUserById,
} from '../../service/service';
import {
  errorTypes,
  authenticationTexts,
} from '../../constants/constants';

const {
  USER_IS_NOT_AUTHORIZED,
} = errorTypes;

const {
  AUTHORIZATION_TITLE,
  REGISTRATION_TITLE,
} = authenticationTexts;

class App {
  constructor() {
    this.state = {
      user: {
        isAuthrorized: false,
        id: '',
        token: '',
        email: '',
      },
      vocabulary: {},
      settings: {},
      statistics: {},
    };

    this.container = null;
  }

  run() {
    this.container = create('main', 'main-content', '', document.body);
    this.checkIsUserAuthorized();
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
    this.speakIt = new SpeakIt(this.state.user);
    await this.speakIt.run();
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
              id: data.userId,
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
          id: data.userId,
          token: data.token,
        },
      };
      document.querySelector('.authentication').remove();
      document.querySelector('.authentication__buttons').remove();
      await this.initSettings();
      await this.renderSpeakItGame();
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
        case this.state.user.id && this.state.user.token: {
          const { id: userId, token } = this.state.user;
          data = await getUserById(userId, token);
          break;
        }
        default:
          throw new Error(USER_IS_NOT_AUTHORIZED);
      }

      this.state.user.isAuthrorized = true;
      this.state.user = {
        ...this.state.user,
        id: data.id,
        email: data.email,
        token: JSON.parse(savedUserData).token,
      };
      await this.initSettings();
      await this.renderSpeakItGame();
      this.prelodaer.hide();
    } catch (error) {
      console.log(error);
      localStorage.setItem('user-data', '');
      this.state.user.isAuthrorized = false;
      this.container.innerHTML = '';
      this.renderAuthenticationBlock('authorization');
      this.renderToggleAuthentication();
      this.activateAuthenticationForm();
      this.prelodaer.hide();
    }
  }

  static async renderMainGame(userState) {
    const mainGame = new MainGame(userState);
    await mainGame.render('.main-content');
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
