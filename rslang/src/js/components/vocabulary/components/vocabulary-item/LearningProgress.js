import create, {
  progressLearningConstants,
} from '../../pathes';

const {
  NEXT_TIME_OF_REVISE_TEXT,
} = progressLearningConstants;

class LearningProgress {
  constructor(nextTimeOfReivise) {
    this.HTML = null;
    this.nextTimeOfReivise = nextTimeOfReivise;
  }

  render() {
    this.HTML = create('div', 'vocabulary__learning-progress');
    this.parametersHTML = create('div', 'learning-progress__parameters', '', this.HTML);
    this.renderParameter(NEXT_TIME_OF_REVISE_TEXT, this.nextTimeOfReivise);

    return this.HTML;
  }

  renderParameter(text, value) {
    const container = create('div', 'learning-progress__parameter');
    create('div', 'learning-progress__text', text, container);
    create('div', 'learning-progress__value', String(value), container);
    this.HTML.append(container);
  }
}

export default LearningProgress;
