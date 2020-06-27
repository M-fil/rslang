import create, { estimateButtonsTypes } from '../../pathes';

import EstimateButton from './EstimateButton';

const {
  AGAIN, HARD, GOOD, EASY,
} = estimateButtonsTypes;

class EstimateButtonsBlock {
  constructor(settings) {
    this.HTML = null;
    this.settings = settings;
  }

  render() {
    const {
      intervalEasy,
      intervalNormal,
      intervalDifficult,
    } = this.settings;

    this.HTML = create(
      'div', 'main-game__estimate-buttons',
      [
        new EstimateButton('again', AGAIN.text, '').render(),
        new EstimateButton('hard', HARD.text, intervalDifficult).render(),
        new EstimateButton('good', GOOD.text, intervalNormal).render(),
        new EstimateButton('easy', EASY.text, intervalEasy).render(),
      ],
    );

    return this.HTML;
  }

  removeFromDOM() {
    if (this.HTML) {
      this.HTML.remove();
    }
  }
}

export default EstimateButtonsBlock;
