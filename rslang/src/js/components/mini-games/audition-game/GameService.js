/* eslint-disable class-methods-use-this */
import GameDataService from './GameDataService';
import GameStatistic from './GameStatistic';
import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';
import Preloader from '../../preloader/Preloader';

export default class GameService {
  constructor(user){
    this.user=user;
  }
  preloaderInit(){
    this.preloader = new Preloader();
    this.preloader.render();
  }
  async initRound(lives, roundsAll, currentRound, roundResults) {
    this.preloader.show();
    const gameDataService = new GameDataService();
    const data = await gameDataService.mapping(currentRound);
    const answers = document.querySelector('.audition-game__answers');
    const arr = data.array;
    const mainWord = data.mainWordToAsk;
    this.createPossibleWords(arr, answers);
    const audio = new Audio(`${auditionGameVariables.mainAudioPath}${mainWord.audio}`);
    audio.play();
    this.preloader.hide();
    document.querySelector('.audition-game__container').classList.remove('hide');
    this.mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    this.idkBtnHandler(audio);
    this.closeBtnHandler();
    this.progressBarHandler(roundsAll, currentRound);
    this.bgRandomize();
    this.keyboardEventsHandler();
  }

  nextRound(lives, roundsAll, currentRound, roundResults) {
    if (lives > 0 && currentRound !== roundsAll) {
      let curr = currentRound;
      curr += 1;
      this.initRound(lives, roundsAll, curr, roundResults);
    } else {
      const gameStats=new GameStatistic();
      gameStats.statistics(roundResults);
      document.querySelector('.progress').style.width = '0%';
      document.querySelector('.audition-game__wrapper').className = 'audition-game__wrapper';
    }
  }

  createPossibleWords(arrayOfWords, answersBlock) {
    for (let i = 0; i < auditionGameVariables.possibleWordsAmount; i += 1) {
      create('div', `audition-game__element Digit${i + 1}`, `${i + 1}.${arrayOfWords[i]?.translate}`, answersBlock);
    }
  }

  designUncheckedPossibleWords(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      if (!elements[i].classList.contains('checked')) elements[i].classList.add('unchecked');
    }
  }

  mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults) {
    document.querySelector('.audition-game__answers').addEventListener('click', (event) => {
     if (event.target.classList.contains('audition-game__element') && !event.target.classList.contains('unchecked') && !event.target.classList.contains('checked')) {
        const nextBtn = document.querySelector('.audition-game__button__next');
        nextBtn.innerHTML = auditionGameVariables.arrowSymbol;
        event.target.classList.toggle('checked');
        const elements = document.querySelectorAll('.audition-game__element');
        this.designUncheckedPossibleWords(elements);
       document.querySelector('.audition-game__correctanswer').innerText=`${mainWord.word} - ${mainWord.translate}`;
       document.querySelector('.audition-game__audio__pulse').style.backgroundImage=`url(${auditionGameVariables.mainAudioPath}${mainWord.image})`;
        if (event.target.innerText.includes(mainWord.translate)) {
          event.target.innerHTML = `${auditionGameVariables.checkMark}${event.target.innerText}`;
          const audioRoundResult = new Audio(auditionGameVariables.correctSound);
          audioRoundResult.play();
          roundResults.push({'result':'correct','word':mainWord});
          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults);
        } else {
          const audioRoundResult = new Audio(auditionGameVariables.errorSound);
          audioRoundResult.play();
          event.target.classList.toggle('line-through');
          roundResults.push({'result':'fail','word':mainWord});
          this.nextRoundEventHandler(nextBtn, --lives, roundsAll, currentRound, roundResults);
        }
      }
    });
  }

  nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults) {
    nextBtn.addEventListener('click', () => {
      document.querySelector('.audition-game__container').remove();
      this.nextRound(lives, roundsAll, currentRound, roundResults);
    },{once:true});
    document.addEventListener('keydown', (event) => {
     if(event.code === 'Enter' && document.querySelector('.audition-game__button__next')?.innerText !== 'Не знаю'){
        nextBtn.click();
    }
    },{once:true});
  }

  idkBtnHandler(audio) {
    document.querySelector('.audition-game__button__next').addEventListener('click', (event) => {
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
    const wrapper = document.querySelector('.audition-game__wrapper');
    wrapper.className = 'audition-game__wrapper';
    wrapper.classList.toggle(bg[0]);
  }

  modalDialog() {
    const wrapper = document.querySelector('body');
    this.modal = create('div', 'modal', '', wrapper);
    this.modalContent = create('div', 'modal-content', '', this.modal);
    create('h2', 'alarmMessage', auditionGameVariables.modalAlarm, this.modalContent);
    create('p', 'alarmDesc', auditionGameVariables.modalDesc, this.modalContent);
    create('button', 'agreeToClose', auditionGameVariables.close, this.modalContent);
    create('button', 'cancelToClose', auditionGameVariables.cancel, this.modalContent);
    this.modalDialogEventsHandler();
  }

  modalDialogEventsHandler() {
    document.querySelector('.agreeToClose').addEventListener('click', () => {
      document.querySelector('.audition-game__container').remove();
      document.querySelector('.audition-game__startScreen').classList.toggle('hide');
      document.querySelector('.modal').remove();
      document.querySelector('.audition-game__wrapper').className = 'audition-game__wrapper';
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
}
