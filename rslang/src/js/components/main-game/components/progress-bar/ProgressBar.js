import create, {
  calculatePercentage,
  mainGameConstants,
} from '../../pathes';

const {
  HIGHEST_PERCENTAGE_STRING,
} = mainGameConstants;

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

    if (this.learnedWordsNumber === this.allWordsNumber) {
      this.barLine.classList.add('main-game__progress-bar-line_completed');
      this.barLine.style.width = HIGHEST_PERCENTAGE_STRING;
    }
    return this.HTML;
  }

  updateSize(learnedWordsNumber, allWordsNumber) {
    this.learnedWordsNumber = learnedWordsNumber < 0 ? 0 : learnedWordsNumber;
    this.allWordsNumber = allWordsNumber;
    this.startValueHTML.textContent = this.learnedWordsNumber;
    this.endValueHTML.textContent = allWordsNumber;

    if (learnedWordsNumber === allWordsNumber) {
      this.barLine.classList.add('main-game__progress-bar-line_completed');
      this.barLine.style.width = HIGHEST_PERCENTAGE_STRING;
    } else {
      this.barLine.style.width = `${calculatePercentage(this.learnedWordsNumber, allWordsNumber)}%`;
      this.barLine.classList.remove('main-game__progress-bar-line_completed');
    }
  }

  hide() {
    this.HTML.classList.add('progress-bar_hidden');
  }

  show() {
    this.HTML.classList.remove('progress-bar_hidden');
  }
}

export default ProgressBar;
