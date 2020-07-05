import create, {
  vocabularyConstants,
  progressLearningConstants,
} from '../../pathes';

const {
  NUMBER_OF_PROGRESS_CIRCLES,
} = vocabularyConstants;

const {
  TIME_TO_REVISE_TEXT,
  LAST_TIME_OF_REVISE_TEXT,
  NEXT_TIME_OF_REVISE_TEXT,
  PROGRESS_LEARNING_TEXT,
  NOT_REVISE_YET,
} = progressLearningConstants;

class LearningProgress {
  constructor(
    timesOfRevise, lastTimeOfRevise, nextTimeOfReivise, commonNumberOfCorrectAnswers
  ) {
    this.HTML = null;
    this.timesOfRevise = timesOfRevise;
    this.lastTimeOfRevise = lastTimeOfRevise;
    this.nextTimeOfReivise = nextTimeOfReivise;
    this.commonNumberOfCorrectAnswers = commonNumberOfCorrectAnswers;
  }

  render() {
    this.HTML = create('div', 'vocabulary__learning-progress');
    this.parametersHTML = create('div', 'learning-progress__parameters', '', this.HTML);
    this.renderParameter(TIME_TO_REVISE_TEXT, this.timesOfRevise);
    this.renderParameter(LAST_TIME_OF_REVISE_TEXT, this.lastTimeOfRevise || NOT_REVISE_YET);
    this.renderParameter(NEXT_TIME_OF_REVISE_TEXT, this.nextTimeOfReivise);
    this.renderLearningProgressCircles();

    return this.HTML;
  }

  renderParameter(text, value) {
    const container = create('div', 'learning-progress__parameter');
    create('div', 'learning-progress__text', text, container);
    create('div', 'learning-progress__value', String(value), container);
    this.HTML.append(container);
  }

  renderLearningProgressCircles() {
    this.learningProgressStats = create('div', 'learning-progress-stats', '', this.HTML);
    create('div', 'learning-progress-stats__title', PROGRESS_LEARNING_TEXT, this.learningProgressStats);
    Array.from({ length: NUMBER_OF_PROGRESS_CIRCLES })
      .map((_, index) => index)
      .map((item) => create(
        'div', 'learning-progress__circle', '', this.learningProgressStats, ['circleIndex', item],
      ));
  }
}

export default LearningProgress
