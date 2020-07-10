import create from '../../utils/сreate';

export default class PromoPage {
  constructor() {
    const mainContent = document.querySelector('.main-content');
    this.container = create('div', 'promo-page-container', '', mainContent);
    this.ptomoTitle = create('h3', 'ptomo-title', 'Промо', this.container);
  }

  render() {
    console.log(78);
  }
}
