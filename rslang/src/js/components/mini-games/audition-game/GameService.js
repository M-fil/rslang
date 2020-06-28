/* eslint-disable class-methods-use-this */
import GameDataService from './GameDataService';
import GameStatistic from './GameStatistic';
import create from '../../../utils/сreate';
import { shuffle } from '../../../utils/shuffle';
import { urls, auditionGameVariables } from '../../../constants/constants';
import Preloader from '../../preloader/Preloader';

export default class GameService {
  constructor(user) {
    this.user = user;
  }

  preloaderInit() {
    this.preloader = new Preloader();
    this.preloader.render();
    this.isMuted = false;
    this.isHintAvailable = true;
    this.correctAnswersCounter = 0;
  }

  async initRound(lives, roundsAll, currentRound, roundResults) {
    this.preloader.show();
    const gameDataService = new GameDataService();
    const data = await gameDataService.mapping(currentRound, this.isMuted);
    const answers = document.querySelector('.audition-game__answers');
    const arr = data.array;
    const mainWord = data.mainWordToAsk;
    this.createPossibleWords(arr, answers);
    const audio = new Audio(`${urls.mainAudioPath}${mainWord.audio}`);
    audio.play();
    this.preloader.hide();
    this.sound = document.querySelector('.audition-game__sound__button');
    document.querySelector('.audition-game__container').classList.remove('hide');
    this.mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    this.idkBtnHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    this.repeatAudioHandler(audio);
    this.closeBtnHandler();
    this.progressBarHandler(roundsAll, currentRound);
    this.bgRandomize();
    this.keyboardEventsHandler();
    this.soundHandler();
    this.hintHandler(mainWord);
  }

  nextRound(lives, roundsAll, currentRound, roundResults) {
    if (lives > 0 && currentRound !== roundsAll) {
      let curr = currentRound;
      curr += 1;
      this.initRound(lives, roundsAll, curr, roundResults);
    } else {
      const gameStats = new GameStatistic();
      gameStats.statistics(roundResults);
      document.querySelector('.progress').style.width = auditionGameVariables.zeroPercent;
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
        document.querySelector('.audition-game__correctanswer').innerText = `${mainWord.word} - ${mainWord.translate}`;
        document.querySelector('.audition-game__audio__pulse').style.backgroundImage = `url(${urls.mainAudioPath}${mainWord.image})`;
        if (event.target.innerText.includes(mainWord.translate)) {
          event.target.innerHTML = `${auditionGameVariables.checkMark}${event.target.innerText}`;
          const audioRoundResult = new Audio(urls.correctSound);
          if (!this.sound.classList.contains('audition-game__sound__buttonMuted')) audioRoundResult.play();
          roundResults.push({ result: auditionGameVariables.correct, word: mainWord });
          this.correctAnswersCounter += 1;
          if (this.correctAnswersCounter > 2) this.isHintAvailable = true;

          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults);
        } else {
          this.correctAnswersCounter = 0;
          const audioRoundResult = new Audio(urls.errorSound);
          if (!this.sound.classList.contains('audition-game__sound__buttonMuted')) audioRoundResult.play();
          event.target.classList.toggle('line-through');
          roundResults.push({ result: auditionGameVariables.fail, word: mainWord });
          this.nextRoundEventHandler(nextBtn, --lives, roundsAll, currentRound, roundResults);
        }
      }
    });
  }

  nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults) {
    nextBtn.addEventListener('click', () => {
      document.querySelector('.audition-game__container').remove();
      this.nextRound(lives, roundsAll, currentRound, roundResults);
    }, { once: true });
    document.addEventListener('keydown', (event) => {
      if (event.code === auditionGameVariables.Enter && document.querySelector('.audition-game__button__next')?.innerText !== auditionGameVariables.idkBtn) {
        nextBtn.click();
      }
    }, { once: true });
  }

  idkBtnHandler(lives, mainWord, roundsAll, currentRound, roundResults) {
    const idkButton = document.querySelector('.audition-game__button__next');
    idkButton.addEventListener('click', (event) => {
      if (event.target.innerText === auditionGameVariables.idkBtn) {
        this.correctAnswersCounter = 0;
        const nextBtn = document.querySelector('.audition-game__button__next');
        nextBtn.innerHTML = auditionGameVariables.arrowSymbol;
        document.querySelector('.audition-game__correctanswer').innerText = `${mainWord.word} - ${mainWord.translate}`;
        document.querySelector('.audition-game__audio__pulse').style.backgroundImage = `url(${urls.mainAudioPath}${mainWord.image})`;
        const elements = document.querySelectorAll('.audition-game__element');
        this.designUncheckedPossibleWords(elements);
        setTimeout(() => {
          roundResults.push({ result: auditionGameVariables.IDK, word: mainWord });
          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults);
          idkButton.click();
        }, 3000);
      }
    });
  }

  hintHandler(mainWord) {
    document.querySelector('.audition-game__hint__button').addEventListener('click', () => {
      if (this.isHintAvailable) {
        this.correctAnswersCounter = 0;
        const elements = Array.from(document.querySelectorAll('.audition-game__element'));
        let cnt = 0;
        const el = shuffle(elements);
        for (let i = 0; i < el.length; i += 1) {
          if (!el[i].innerText.includes(mainWord.translate)) {
            cnt += 1;
            el[i].classList.add('unchecked');
            el[i].classList.add('line-through');
            if (cnt === 2) {
              break;
            }
          }
        }
      }
      this.isHintAvailable = false;
    });
  }

  repeatAudioHandler(audio) {
    document.querySelector('.audition-game__audio__pulse').addEventListener('click', () => {
      if (!this.sound.classList.contains('audition-game__sound__buttonMuted')) audio.play();
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
    const { bg } = auditionGameVariables;
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
      document.querySelector('.progress').style.width = auditionGameVariables.zeroPercent;
    });
    document.querySelector('.cancelToClose').addEventListener('click', () => {
      document.querySelector('.modal').remove();
    });
  }

  keyboardEventsHandler() {
    document.addEventListener('keydown', (event) => {
      const choose = document.querySelector(`.${event.code}`);
      if (auditionGameVariables.digits.includes(event.code)) {
        choose.click();
      }
    });
  }

  soundHandler() {
    document.querySelector('.audition-game__sound__button').addEventListener('click', (event) => {
      event.target.classList.toggle('audition-game__sound__buttonMuted');
      this.isMuted = !this.isMuted;
    });
  }
}
