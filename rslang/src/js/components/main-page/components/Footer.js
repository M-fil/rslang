import {
  create,
} from '../pathes';

class Footer {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('footer', 'main-gae__footer');
    return this.HTML;
  }
}

export default Footer;
