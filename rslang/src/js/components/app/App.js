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
} from "../../constants/constants";

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

  async checkIsUserAuthorized() {
    console.log('here')
    const savedUserData = localStorage.getItem('user-data');
    try {
      if (!savedUserData) {
        throw new Error(USER_IS_NOT_AUTHORIZED);
      }
      const { userId, token } = JSON.parse(savedUserData);
      const data = await getUserById(userId, token);
      this.isAuthrorized = true;
      this.state.user = {
        ...this.state.user,
        id: data.id,
        email: data.email,
      };
      this.renderMainGame();
      console.log('data', data);
    } catch (error) {
      console.log(error);
      localStorage.setItem('user-data', '');
      this.isAuthrorized = false;
      this.renderAuthenticationBlock('authorization');
      this.renderToggleAuthentication();
    }
  }

  renderMainGame() {
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
    this.container.prepend(this.authenticationToggleButton);

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.authentication__toggle-button');
      if (target) {
        const { authenticationType } = target.dataset;
        const typeForElement = this.renderAuthenticationBlock(authenticationType);
        target.dataset.authenticationType = typeForElement;
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
    const typeForElement = type === 'registration' ? 'authorization' : 'registration'; 
    const authentication = type === 'registration' ? new Authorization() : new Registration();

    this.container.append(authentication.render());
    Authentication.submitData(typeForElement, type === 'registration' ? loginUser : createUser);

    return typeForElement;
  }
}

export default App;
