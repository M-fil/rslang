import {
  create,
} from './pathes';

import Header from './components/Header';
import MainBlock from './components/MainBlock';
import Footer from './components/Footer';

class MainPage {
  constructor(userName) {
    this.HTML = null;
    this.userName = userName;
  }

  render() {
    this.HTML = create('div', 'main-page');
    this.header = new Header(this.userName);
    this.mainBlock = new MainBlock();
    this.footer = new Footer();

    this.HTML.append(
      this.header.render(),
      this.mainBlock.render(),
      this.footer.render(),
    );
  }
}

export default MainPage;
