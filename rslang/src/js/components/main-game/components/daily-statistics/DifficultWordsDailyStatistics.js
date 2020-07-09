import create, { dailyStatisticsConstants } from '../../pathes';
import DailyStatistics from './DailyStatistics';

const {
  DIFFICULT_WORDS_TITLE_TEXT,
  REVISE_DIFFICULT_WORDS_AGAIN,
  DIFFICULT_WORDS_COUNT_TEXT,
} = dailyStatisticsConstants;

class DifficultWordsDailyStatistics extends DailyStatistics {
  constructor(numberOfWords) {
    super();
    this.numberOfWords = numberOfWords;
  }

  render() {
    this.HTML = super.render();
    this.titleHTML.textContent = DIFFICULT_WORDS_TITLE_TEXT;
    this.content.innerHTML = '';
    this.content.append(...this.renderContent());

    return this.HTML;
  }

  renderContent() {
    const contentTextInfo = create(
      'div', 'daily-statistics__parameter',
      DIFFICULT_WORDS_COUNT_TEXT(this.numberOfWords),
    );
    const buttonsContainer = create('div', 'daily-statistics__buttons');
    create(
      'button', 'daily-statistics__revise-button',
      REVISE_DIFFICULT_WORDS_AGAIN, buttonsContainer, ['type', 'button'],
    );
    buttonsContainer.append(this.goToTheMainButton);

    return [contentTextInfo, buttonsContainer];
  }
}

export default DifficultWordsDailyStatistics;
