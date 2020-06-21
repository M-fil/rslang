/* eslint-disable class-methods-use-this */
import GameDataService from './GameDataService';
import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class GameService {
  async init(lives, roundsAll, currentRound) {
    const gameDataService = new GameDataService();
    this.data = await gameDataService.mapping();
    this.answers = document.querySelector('.answers');
    this.arr = this.data.array;
    const mainWord = this.data.mainWordToAsk;
    this.createPossibleWords(this.arr, this.answers);
    const audio = new Audio(`${auditionGameVariables.mainAudioPath}${mainWord.audio}`);
    audio.play();
    this.mainEventHandler(lives, mainWord, roundsAll, currentRound);
    this.idkBtnHandler(audio);
    this.closeBtnHandler();
    this.progressBarHandler(roundsAll, currentRound);
    this.bgRandomize();
  }

  nextRound(lives, roundsAll, currentRound) {
    if (lives > 0 && currentRound !== roundsAll) {
      let curr = currentRound;
      curr += 1;
      this.init(lives, roundsAll, curr);
    } else {
      document.querySelector('.startScreen').classList.toggle('hide');
      document.querySelector('.progress').style.width = '0%';
      document.querySelector('body').className = '';
    }
  }

  createPossibleWords(arrayOfWords, answersBlock) {
    for (let i = 0; i < 5; i += 1) {
      create('div', 'element', `${i + 1}.${arrayOfWords[i].translate}`, answersBlock);
    }
  }

  designUncheckedPossibleWords(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      if (!elements[i].classList.contains('checked')) elements[i].classList.add('unchecked');
    }
  }

  mainEventHandler(lives, mainWord, roundsAll, currentRound) {
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
          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound);
        } else {
          const audioRoundResult = new Audio(auditionGameVariables.errorSound);
          audioRoundResult.play();
          event.target.classList.toggle('line-through');
          this.nextRoundEventHandler(nextBtn, --lives, roundsAll, currentRound);
        }
      }
    });
  }

  nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound) {
    nextBtn.addEventListener('click', () => {
      document.querySelector('.container').remove();
      this.nextRound(lives, roundsAll, currentRound);
    });
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
}
