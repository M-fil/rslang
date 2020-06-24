import create from '../../../../utils/сreate';
import { dailyStatisticsConstants } from '../../../../constants/constants';

const {
  TITLE,
  COMPLETED_CARDS_TEXT,
  CORRECT_ANSWERS_PERCENTAGE_TEXT,
  NEW_WORDS_TEXT,
  LONGEST_SERIES_OF_ANSWERS_TEXT,
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
    this.HTML = create('div', 'daily-statistics');
    create('div', 'daily-statistics__title', TITLE, this.HTML);
    this.renderParameter(COMPLETED_CARDS_TEXT, this.completedCardsNumber);
    this.renderParameter(CORRECT_ANSWERS_PERCENTAGE_TEXT, this.correctAnswersPercentage);
    this.renderParameter(NEW_WORDS_TEXT, this.newWordsNumber);
    this.renderParameter(LONGEST_SERIES_OF_ANSWERS_TEXT, this.longestSeriesOfAnswers);

    return this.HTML;
  }

  renderParameter(text, value) {
    create('div', 'daily-statistics__parameter', `${text}: ${value}`, this.HTML);
  }
}

export default DailyStatistics;
