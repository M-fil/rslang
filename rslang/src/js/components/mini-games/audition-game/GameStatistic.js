import create from '../../../utils/сreate';
import { urls, auditionGameVariables } from '../../../constants/constants';
import AuditionGame from './AuditionGame';
import Statistics from '../../statistics/Statistics'

export default class GameStatistic {
  constructor(userData) {
    this.user = userData;  
  }
  statistics(resultObj) {
    const correctArray = resultObj.filter((res) => res.result === auditionGameVariables.correct);
    const failArray = resultObj.filter((res) => res.result === auditionGameVariables.fail);
    const idkArray = resultObj.filter((res) => res.result === auditionGameVariables.IDK);
    const user = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZmNlZGJmMjM3ODBlMDAxNzQ4N2MyYSIsImlhdCI6MTU5MzcxMTAxMSwiZXhwIjoxNTkzNzI1NDExfQ.ffkTcQtdTj6BvZnHiG9wbZ1cxgr_kK0IcjJ76bdnuSM',
      userId: '5efcedbf23780e0017487c2a',
      };
    const stat = new Statistics(user);
    stat.init();
    setTimeout(()=>{
      stat.saveGameStatistics('auditiongame',correctArray.length,failArray.length);
    },5000);
    const wrapper = document.querySelector('.audition-game__wrapper');
    const modal = create('div', 'modalAudition', '', wrapper);
    const modalContent = create('div', 'modal-content', '', modal);
    create('h2', 'alarmMessage', auditionGameVariables.statist, modalContent);
    create('p', 'alarmDesc', auditionGameVariables.know, modalContent);
    for (let i = 0; i < correctArray.length; i++) {
      create('div', 'statistic', `&#9834; ${correctArray[i].word.word}-${correctArray[i].word.translate}`, modalContent, ['audio', correctArray[i].word.audio]);
    }
    create('p', 'alarmDesc', auditionGameVariables.errors, modalContent);
    for (let i = 0; i < failArray.length; i++) {
      create('div', 'statistic', `&#9834; ${failArray[i].word.word}-${failArray[i].word.translate}`, modalContent, ['audio', failArray[i].word.audio]);
    }
    create('p', 'alarmDesc', auditionGameVariables.idkBtn, modalContent);
    for (let i = 0; i < idkArray.length; i++) {
      create('div', 'statistic', `&#9834; ${idkArray[i].word.word}-${idkArray[i].word.translate}`, modalContent, ['audio', idkArray[i].word.audio]);
    }
    create('button', 'cancelToClose', auditionGameVariables.cancel, modalContent);
    this.closeEventHandler();
    this.eventHandler();
  }

  closeEventHandler() {
    document.querySelector('.cancelToClose').addEventListener('click', () => {
      document.querySelector('.audition-game__wrapper').remove();
      document.querySelector('.main-content').innerHTML = '';
      //document.querySelector('.audition-game__startScreen').classList.toggle('hide');
      const audition = new AuditionGame();
    audition.render(auditionGameVariables.Lives,auditionGameVariables.Rounds);
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
