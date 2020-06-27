import create from '../../../../utils/сreate';
import { mainGameConstants, estimateButtonsTypes } from '../../../../constants/constants';

const {
  AGAIN,
} = estimateButtonsTypes;

const {
  DAYS_CONTRACTION,
} = mainGameConstants;

class EstimateButton {
  constructor(classNameType, buttonText, timeToRevise) {
    this.HTML = null;
    this.classNameType = classNameType;
    this.buttonText = buttonText;
    this.timeToRevise = timeToRevise;
  }

  render() {
    const timeToReviseExtraText = this.buttonText === AGAIN.text
      ? AGAIN.text : DAYS_CONTRACTION;
    this.HTML = create('div', 'main-game__estimate-item');
    create('div', 'main-game__revise-time', `${this.timeToRevise} ${timeToReviseExtraText}`, this.HTML);
    create(
      'button', `main-game__estimate-button main-game__button-${this.classNameType}`,
      this.buttonText, this.HTML, ['type', 'button'], ['buttonAprraisal', this.buttonText],
    );

    return this.HTML;
  }
}

export default EstimateButton;
