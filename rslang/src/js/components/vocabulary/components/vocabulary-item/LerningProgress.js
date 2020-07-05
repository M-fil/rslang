import create, { vocabularyConstants } from '../../pathes';

const {
  NUMBER_OF_PROGRESS_CIRCLES,
} = vocabularyConstants;

class LerningProgress {
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
    this.renderParameter(this.timesOfRevise);
    this.renderParameter(this.lastTimeOfRevise);
    this.renderParameter(this.nextTimeOfReivise);
    this.renderLearningProgressCircles();
  }

  renderParameter(parameter) {
    create('div', 'learning-progress__parameter', parameter, this.parametersHTML);
  }

  renderLearningProgressCircles() {
    this.learningProgressStats = create('div', 'learning-progress-stats', '', this.HTML);
    Array.from({ length: NUMBER_OF_PROGRESS_CIRCLES })
      .map((_, index) => index)
      .map((item) => create(
        'div', 'learning-progress__circle', '', this.learningProgressStats, ['circleIndex', item],
      ));
  }
}

export default LerningProgress
