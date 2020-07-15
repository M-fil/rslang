import create, { dailyStatisticsConstants } from '../../pathes';

const {
  TITLE,
  COMPLETED_CARDS_TEXT,
  CORRECT_ANSWERS_PERCENTAGE_TEXT,
  NEW_WORDS_TEXT,
  LONGEST_SERIES_OF_ANSWERS_TEXT,
  GO_TO_THE_MAIN_PAGE,
} = dailyStatisticsConstants;

class DailyStatistics {
  constructor(
    completedCardsNumber, correctAnswersPercentage,
    newWordsNumber, longestSeriesOfAnswers,
  ) {
    this.HTML = null;
    this.completedCardsNumber = completedCardsNumber;
    this.correctAnswersPercentage = correctAnswersPercentage;
    this.newWordsNumber = newWordsNumber;
    this.longestSeriesOfAnswers = longestSeriesOfAnswers;
  }

  render() {
    this.HTML = create('div', 'daily-statistics__overlay');
    this.statisticsBlock = create('div', 'daily-statistics', '', this.HTML);
    this.titleHTML = create('div', 'daily-statistics__title', TITLE, this.statisticsBlock);
    this.content = create('div', 'daily-statistics__content', '', this.statisticsBlock);
    this.renderParameter(COMPLETED_CARDS_TEXT, this.completedCardsNumber);
    this.renderParameter(CORRECT_ANSWERS_PERCENTAGE_TEXT, this.correctAnswersPercentage, '%');

    if (this.newWordsNumber) {
      this.renderParameter(NEW_WORDS_TEXT, this.newWordsNumber);
    }
    this.renderParameter(LONGEST_SERIES_OF_ANSWERS_TEXT, this.longestSeriesOfAnswers);
    this.goToTheMainButton = create(
      'button', 'daily-statistics__button',
      GO_TO_THE_MAIN_PAGE, this.statisticsBlock,
      ['id', 'button-go-to-main-page'],
    );
    return this.HTML;
  }

  renderParameter(text, value, extraStringValue = '') {
    create('div', 'daily-statistics__parameter', `${text}: ${value}${extraStringValue}`, this.content);
  }

  removeFromDOM() {
    if (this.HTML) {
      this.HTML.remove();
    }
  }
}

export default DailyStatistics;
