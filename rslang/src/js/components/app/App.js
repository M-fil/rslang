import create from '../../utils/сreate';
import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import MainGame from '../main-game/MainGame';

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

  activateAuthenticationForm() {
    document.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (event.target.classList.contains('authorization__form')) {
        await this.signInUser();
      }
      if (event.target.classList.contains('registration__form')) {
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
      }
    });
  }

  async signInUser() {
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
    App.renderMainGame();
  }

  async checkIsUserAuthorized() {
    const savedUserData = localStorage.getItem('user-data');
    try {
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
      };
      App.renderMainGame();
    } catch (error) {
      localStorage.setItem('user-data', '');
      this.state.user.isAuthrorized = false;
      this.renderAuthenticationBlock('authorization');
      this.renderToggleAuthentication();
      this.activateAuthenticationForm();
    }
  }

  static renderMainGame() {
    const mainGame = new MainGame();
    mainGame.render('.main-content');
  }

  renderToggleAuthentication() {
    const buttonsContainer = create('div', 'authentication__buttons');
    this.authenticationToggleButton = create(
      'button',
      'authentication__toggle-button',
      AUTHORIZATION_TITLE,
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
          ? AUTHORIZATION_TITLE
          : REGISTRATION_TITLE;
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
