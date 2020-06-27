import create from '../../../utils/сreate';
import { urls,auditionGameVariables } from '../../../constants/constants';

export default class GameStatistic {
  statistics(resultObj) {
    const correctArray = resultObj.filter((res) => res.result === auditionGameVariables.correct);
    const failArray = resultObj.filter((res) => res.result === auditionGameVariables.fail);
    const wrapper = document.querySelector('.audition-game__wrapper');
    const modal = create('div', 'modal', '', wrapper);
    const modalContent = create('div', 'modal-content', '', modal);
    create('h2', 'alarmMessage', auditionGameVariables.statist, modalContent);
    create('p', 'alarmDesc', auditionGameVariables.know, modalContent);
    for (let i = 0; i < correctArray.length; i++) {
      create('div', 'statistic', `${correctArray[i].word.word}-${correctArray[i].word.translate}`, modalContent, ['audio', correctArray[i].word.audio]);
    }
    create('p', 'alarmDesc', auditionGameVariables.errors, modalContent);
    for (let i = 0; i < failArray.length; i++) {
      create('div', 'statistic', `${failArray[i].word.word}-${failArray[i].word.translate}`, modalContent, ['audio', failArray[i].word.audio]);
    }
    create('button', 'cancelToClose', auditionGameVariables.cancel, modalContent);
    this.closeEventHandler();
    this.eventHandler();
  }

  closeEventHandler() {
    document.querySelector('.cancelToClose').addEventListener('click', () => {
      document.querySelector('.modal').remove();
      document.querySelector('.audition-game__startScreen').classList.toggle('hide');
    });
  }

  eventHandler() {
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('statistic')) {
        const audio = new Audio(`${urls.mainAudioPath}${event.target.getAttribute('data-audio')}`);
        audio.play();
      }
    });
  }
}
