import create from '../../../../utils/сreate';
import {
  START_WINDOW,
} from '../../../../constants/constatntsForEP';

export default function createStartWindow() {
  const informationElements = [
    create('p', 'information-title'),
    create('p', 'information-description'),
    create('p', 'information-functionality'),
    create('button', 'information-button'),
  ];
  for (let i = 0; i < informationElements.length; i += 1) {
    switch (i) {
      case 0:
        informationElements[i].textContent = START_WINDOW.title;
        break;
      case 1:
        informationElements[i].textContent = START_WINDOW.descrption;
        break;
      case 2:
        informationElements[i].textContent = START_WINDOW.functionality;
        break;
      default:
        informationElements[i].textContent = START_WINDOW.startButton;
        break;
    }
  }
  const informationBlock = create('div', 'start-block_information', informationElements);
  return create('div', 'start-window', informationBlock);
}
