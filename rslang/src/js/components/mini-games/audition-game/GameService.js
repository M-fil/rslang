/* eslint-disable class-methods-use-this */
import GameDataService from './GameDataService';
import create from '../../../utils/сreate';
import { auditionGameVariables } from '../../../constants/constants';

export default class GameService {
  async init(lives) {
    console.log(lives);
    const mp = new GameDataService();
    this.data = await mp.mapping();
    this.answers = document.querySelector('.answers');
    this.arr = this.data.array;
    const mainWord = this.data.mainWordToAsk;
    this.createPossibleWords(this.arr, this.answers);
    const audio = new Audio(`https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/${mainWord.audio}`);
    audio.play();
    this.mainEventHandler(lives, mainWord, audio);
    this.idkBtnHandler(audio);
    this.closeBtnHandler();
  }

  /* compare(obj) {
    console.log(this.word === obj.word);
    return this.word === obj.word;
  } */

  nextRound(lives) {
    if (lives > 0) {
      this.init(lives);
    } else {
      document.querySelector('.startScreen').classList.toggle('hide');
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

  mainEventHandler(lives, mainWord) {
    document.querySelector('.answers').addEventListener('click', (event) => {
      if (event.target.classList.contains('element') && !event.target.classList.contains('unchecked') && !event.target.classList.contains('checked')) {
        const nextBtn = document.querySelector('.nextBtn');
        nextBtn.innerHTML = auditionGameVariables.arrowSymbol;
        event.target.classList.toggle('checked');
        const elements = document.querySelectorAll('.element');
        this.designUncheckedPossibleWords(elements);
        if (event.target.innerText.includes(mainWord.translate)) {
          event.target.innerHTML = `${auditionGameVariables.checkMark}${event.target.innerText}`;
          const audio1 = new Audio('https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/correct.mp3');
          audio1.play();
          this.nextRoundEventHandler(nextBtn, lives);
        } else {
          const audio1 = new Audio('https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/error.mp3');
          audio1.play();
          event.target.classList.toggle('line-through');
          this.nextRoundEventHandler(nextBtn, --lives);
        }
      }
    });
  }

  nextRoundEventHandler(nextBtn, lives) {
    nextBtn.addEventListener('click', () => {
      document.querySelector('.container').remove();
      this.nextRound(lives);
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
      document.querySelector('.container').remove();
      document.querySelector('.startScreen').classList.toggle('hide');
    });
  }
}
