import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class GameStatistic{
    statistics(resultObj){
        console.log('result:',resultObj);
      const correctArray = resultObj.filter(res=>res.result === 'correct');
      const failArray = resultObj.filter(res=>res.result === 'fail');
      console.log('corr',correctArray,'fail',failArray)
        const body = document.querySelector('body');
    this.modal = create('div', 'modal', '', body);
    this.modalContent = create('div', 'modal-content', '', this.modal);
    this.modalHeader = create('h2', 'alarmMessage', 'Статистика', this.modalContent);
    create('p', 'alarmDesc', 'Знаю', this.modalContent);
    for(let i=0;i<correctArray.length;i++){
    create('div', 'statistic', `${correctArray[i].word.word}-${correctArray[i].word.translate}`, this.modalContent,['audio',correctArray[i].word.audio]);}
    create('p', 'alarmDesc', 'Ошибок', this.modalContent);
    for(let i=0;i<failArray.length;i++){
      create('div', 'statistic', `${failArray[i].word.word}-${failArray[i].word.translate}`, this.modalContent,['audio',failArray[i].word.audio]);}
    this.modalCancelBtn = create('button', 'cancelToClose', auditionGameVariables.cancel, this.modalContent);
    this.closeEventHandler();
    this.eventHandler()
    }
    closeEventHandler(){
      document.querySelector('.cancelToClose').addEventListener('click', () => {
        document.querySelector('.modal').remove();
        document.querySelector('.startScreen').classList.toggle('hide');
      });
    }
    eventHandler(){
      document.addEventListener('click',(event)=>{
        if(event.target.classList.contains('statistic')){
        const audio= new Audio(`${auditionGameVariables.mainAudioPath}${event.target.getAttribute('data-audio')}`);
        audio.play();
        }
      });
    }

}