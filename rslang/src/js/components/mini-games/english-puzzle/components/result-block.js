import {
  RESULT_FORM,
} from '../../../../constants/constatntsForEP';
import {
  viewElement,
} from './dom-actions';
import create from '../../../../utils/сreate';

export default function createResulBlock() {
  const paintingBlock = create('div', 'result-block_painting');
  create('div', 'result-block_painting--image', '', paintingBlock);
  create('div', 'result-block_painting--description', '', paintingBlock);
  const resultStatistic = create('div', 'result-block_statistic');
  const resultButtonBlock = create('div', 'result-block_buttons');
  const resultButton = create('button', 'game-button result-button_continue', '', resultButtonBlock);
  resultButton.textContent = RESULT_FORM.buttonName;
  const resultBlock = create('div', 'result-block', [paintingBlock, resultStatistic, resultButtonBlock]);
  const resultContainer = create('div', 'result-container', resultBlock);
  viewElement([resultContainer], []);
  return resultContainer;
}
