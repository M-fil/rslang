import create from '../../../../utils/сreate';
import { calculatePercentage } from '../../../../utils/calculations';

class ProgressBar {
  constructor(learnedWordsNumber, allWordsNumber) {
    this.HTML = null;
    this.learnedWordsNumber = learnedWordsNumber;
    this.allWordsNumber = allWordsNumber;
    this.barWidthInPercents = calculatePercentage(learnedWordsNumber, allWordsNumber);
  }

  render() {
    this.HTML = create('div', 'progress-bar main-game__progress-bar');
    this.startValueHTML = create('div', 'progress-bar__number progress-bar__number-start', String(this.learnedWordsNumber), this.HTML);
    this.barLine = create('div', 'progress-bar__line main-game__progress-bar-line');
    create('div', 'progress-bar__background main-game__progress-background', this.barLine, this.HTML);
    this.endValueHTML = create('div', 'progress-bar__number progress-bar__number-end', String(this.allWordsNumber), this.HTML);
    this.barLine.style.width = `${this.barWidthInPercents}%`;

    return this.HTML;
  }

  updateSize(learnedWordsNumber, allWordsNumber) {
    this.learnedWordsNumber = learnedWordsNumber;
    this.allWordsNumber = allWordsNumber;
    this.startValueHTML.textContent = learnedWordsNumber;
    this.endValueHTML.textContent = allWordsNumber;
    this.barLine.style.width = `${calculatePercentage(learnedWordsNumber, allWordsNumber)}%`;
  }
}

export default ProgressBar;
