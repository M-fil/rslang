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
    const savedUserData = JSON.parse(localStorage.getItem('user-data'));
    if (savedUserData) {
      const { userId, token } = savedUserData;
      try {
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
        this.isAuthrorized = false;
        this.renderAuthenticationBlock();
      }
    }
  }

  renderMainGame() {
    const mainGame = new MainGame();
    mainGame.render('.main-content');
  }

  renderAuthenticationBlock() {
    const authorization = new Registration();
    this.container.append(authorization.render());
    Authentication.submitData('registration__form', loginUser);
  }
}

export default App;
