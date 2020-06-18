import create from '../../../../utils/сreate';
import { estimateButtonsTypes } from '../../../../constants/constants';

import EstimateButton from './EstimateButton';

const {
  AGAIN, HARD, GOOD, EASY,
} = estimateButtonsTypes;

class EstimateButtonsBlock {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create(
      'div', 'main-game__estimate-buttons',
      [
        new EstimateButton('again', AGAIN.text, AGAIN.time).render(),
        new EstimateButton('hard', HARD.text, HARD.time).render(),
        new EstimateButton('good', GOOD.text, GOOD.time).render(),
        new EstimateButton('easy', EASY.text, EASY.time).render(),
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
