/* eslint-disable class-methods-use-this */
import GameDataService from './GameDataService';
import GameStatistic from './GameStatistic';
import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class GameService {
  async init(lives, roundsAll, currentRound, roundResults) {
    const gameDataService = new GameDataService();
    const data = await gameDataService.mapping();
    this.answers = document.querySelector('.answers');
    this.arr = data.array;
    const mainWord = data.mainWordToAsk;
    console.log("MAIN WORD:",mainWord)
    this.createPossibleWords(this.arr, this.answers);
    const audio = new Audio(`${auditionGameVariables.mainAudioPath}${mainWord.audio}`);
    audio.play();
    this.mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    
    this.idkBtnHandler(audio);
    this.closeBtnHandler();
    this.progressBarHandler(roundsAll, currentRound);
    this.bgRandomize();
    this.keyboardEventsHandler();
  }

  nextRound(lives, roundsAll, currentRound, roundResults) {
    if (lives > 0 && currentRound !== roundsAll) {
      console.log(roundResults);
      let curr = currentRound;
      curr += 1;
      this.init(lives, roundsAll, curr, roundResults);
    } else {
      const gameStats=new GameStatistic();
      gameStats.statistics(roundResults);
      // document.querySelector('.startScreen').classList.toggle('hide');
      document.querySelector('.progress').style.width = '0%';
      document.querySelector('body').className = '';
    }
  }

  createPossibleWords(arrayOfWords, answersBlock) {
    for (let i = 0; i < 5; i += 1) {
      create('div', `element Digit${i + 1}`, `${i + 1}.${arrayOfWords[i]?.translate}`, answersBlock);
    }
  }

  designUncheckedPossibleWords(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      if (!elements[i].classList.contains('checked')) elements[i].classList.add('unchecked');
    }
  }

  mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults) {
    document.querySelector('.answers').addEventListener('click', (event) => {
     if (event.target.classList.contains('element') && !event.target.classList.contains('unchecked') && !event.target.classList.contains('checked')) {
        const nextBtn = document.querySelector('.nextBtn');
        nextBtn.innerHTML = auditionGameVariables.arrowSymbol;
        event.target.classList.toggle('checked');
        const elements = document.querySelectorAll('.element');
        this.designUncheckedPossibleWords(elements);
        if (event.target.innerText.includes(mainWord.translate)) {
          event.target.innerHTML = `${auditionGameVariables.checkMark}${event.target.innerText}`;
          const audioRoundResult = new Audio(auditionGameVariables.correctSound);
          audioRoundResult.play();
          //const res = 'correct';
          roundResults.push({'result':'correct','word':mainWord});
          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults);
          //return {'result':'correct','word':mainWord};
        } else {
          const audioRoundResult = new Audio(auditionGameVariables.errorSound);
          audioRoundResult.play();
          event.target.classList.toggle('line-through');
          roundResults.push({'result':'fail','word':mainWord});
          this.nextRoundEventHandler(nextBtn, --lives, roundsAll, currentRound, roundResults);
         // return {'result':'fail','word':mainWord};
        }
      }
    });
  }

  nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults) {
    nextBtn.addEventListener('click', () => {
      document.querySelector('.container').remove();
      this.nextRound(lives, roundsAll, currentRound, roundResults);
    },{once:true});
    document.addEventListener('keydown', (event) => {
     if(event.code === 'Enter'&&document.querySelector('.nextBtn')?.innerText !== 'Не знаю'){
      //document.querySelector('.container').remove();
      //this.nextRound(lives, roundsAll, currentRound);
        nextBtn.click();
    }
    },{once:true});
  }

  idkBtnHandler(audio) {
    document.querySelector('.nextBtn').addEventListener('click', (event) => {
      if (event.target.innerText === auditionGameVariables.idkBtn) {
        audio.play();
      }
    });
  }

  closeBtnHandler() {
    document.querySelector('.close').addEventListener('click', () => {
      this.modalDialog();
    });
  }

  progressBarHandler(roundsAll, currentRound) {
    document.querySelector('.progress').style.width = `${100 * (currentRound / roundsAll)}%`;
  }

  bgRandomize() {
    const bg = ['bg1', 'bg2', 'bg3', 'bg4'];
    bg.sort(() => Math.random() - 0.5);
    const body = document.querySelector('body');
    body.className = '';
    body.classList.toggle(bg[0]);
  }

  modalDialog() {
    const body = document.querySelector('body');
    this.modal = create('div', 'modal', '', body);
    this.modalContent = create('div', 'modal-content', '', this.modal);
    this.modalAgreeBtn = create('h2', 'alarmMessage', auditionGameVariables.modalAlarm, this.modalContent);
    this.modalAgreeBtn = create('p', 'alarmDesc', auditionGameVariables.modalDesc, this.modalContent);
    this.modalAgreeBtn = create('button', 'agreeToClose', auditionGameVariables.close, this.modalContent);
    this.modalCancelBtn = create('button', 'cancelToClose', auditionGameVariables.cancel, this.modalContent);
    this.modalDialogEventsHandler();
  }

  modalDialogEventsHandler() {
    document.querySelector('.agreeToClose').addEventListener('click', () => {
      document.querySelector('.container').remove();
      document.querySelector('.startScreen').classList.toggle('hide');
      document.querySelector('.modal').remove();
      document.querySelector('body').className = '';
      document.querySelector('.progress').style.width = '0%';
    });
    document.querySelector('.cancelToClose').addEventListener('click', () => {
      document.querySelector('.modal').remove();
    });
  }
  keyboardEventsHandler(){    
    document.addEventListener('keydown',(event) =>{
      const choose = document.querySelector(`.${event.code}`);
      const normal = ['Digit1','Digit2','Digit3','Digit4','Digit5'];
      if(normal.includes(event.code)){
        choose.click();
      }
    });
  }
/*  keyboardEventsHandler(lives, mainWord, roundsAll, currentRound){
    
    document.addEventListener('keydown',(event) =>{
      console.log("EVENT:",event);
      const choose = document.querySelector(`.${event.code}`);
      const normal = ['Digit1','Digit2','Digit3','Digit4','Digit5'];
      if(normal.includes(event.code)){
        this.SAME(choose, lives, mainWord, roundsAll, currentRound);
      }
      else  if(event.code !== 'Enter' || document.querySelector('.checked')===null){
      this.keyboardEventsHandler(lives, mainWord, roundsAll, currentRound);
        console.log("NUL");
    }
    },{once:true});
    
  }*/
  
}
