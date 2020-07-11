import GameDataService from './GameDataService';
import create from '../../../utils/сreate';
import { shuffle } from '../../../utils/shuffle';
import { urls, auditionGameVariables, vocabularyConstants } from '../../../constants/constants';
import Preloader from '../../preloader/Preloader';
import Vocabulary from '../../vocabulary/Vocabulary';
import Statistics from '../../statistics/Statistics';

export default class GameService {
  constructor(miniGameObj, lives, roundsAll, roundResults, collectionLengthEnough) {
    this.user = miniGameObj.user;
    this.ShortTermStatistics = miniGameObj.shortTermStatistics;
    this.lives = lives;
    this.roundsAll = roundsAll;
    this.roundResults = roundResults;
    this.collectionLengthEnough = collectionLengthEnough;
    this.closeButton = miniGameObj.closeButton;
  }

  startGame(collection, group) {
    this.collection = collection;
    this.group = group;
    this.preloaderInit();
    this.initRound(this.lives, this.roundsAll, 1, this.roundResults);
    document.querySelector('.audition-game__startScreen').classList.toggle('hide');
    document.querySelector('.audition-game__wrapper').appendChild(this.closeButton.render());
    this.closeButton.show();
  }

  async getVocabularyData() {
    this.voc = new Vocabulary(this.user);
    await this.voc.init();
    this.vocabulary = await this.voc
      .getWordsByVocabularyType(vocabularyConstants.LEARNED_WORDS_TITLE, true);
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
    this.genGame();
    const gameDataService = new GameDataService(
      this.vocabulary, this.collection, this.group, this.collectionLengthEnough,
    );
    const data = await gameDataService.mapping();
    const answers = document.querySelector('.audition-game__answers');
    const arr = data.array;
    const mainWord = data.mainWordToAsk;
    GameService.createPossibleWords(arr, answers);
    const audio = new Audio(`${urls.mainAudioPath}${mainWord.audio}`);
    audio.play();
    this.preloader.hide();
    this.sound = document.querySelector('.audition-game__sound__button');
    document.querySelector('.audition-game__container').classList.remove('hide');
    this.mainEventHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    this.idkBtnHandler(lives, mainWord, roundsAll, currentRound, roundResults);
    this.repeatAudioHandler(audio);
    GameService.progressBarHandler(roundsAll, currentRound);
    GameService.bgRandomize();
    this.keyboardEventsHandler();
    this.soundHandler();
    this.hintHandler(mainWord);
  }

  genGame() {
    const wrapper = document.querySelector('.audition-game__wrapper');
    this.container = create('div', 'audition-game__container hide', '', wrapper);
    const soundCont = create('div', 'audition-game__sound__container', '', this.container);
    const hintCont = create('div', 'audition-game__hint__container', '', this.container);
    if (!this.isMuted) create('div', 'audition-game__sound__button', '', soundCont);
    else create('div', 'audition-game__sound__button audition-game__sound__buttonMuted', '', soundCont);
    document.querySelector('.audition-game__sound__button');
    create('div', 'audition-game__hint__button', '', hintCont);
    const game = create('div', 'audition-game__game', '', this.container);
    const audioPulse = create('div', 'audition-game__audio__pulse', '', game);
    audioPulse.style.backgroundImage = `url(${urls.audioPNG})`;
    create('p', 'audition-game__correctanswer', '', game);
    create('div', 'audition-game__answers', '', game);
    create('button', 'audition-game__button__next Enter', `${auditionGameVariables.idkBtn}`, game);
  }

  nextRound(lives, roundsAll, currentRound, roundResults) {
    if (lives > 0 && currentRound !== roundsAll) {
      let curr = currentRound;
      curr += 1;
      this.initRound(lives, roundsAll, curr, roundResults);
    } else {
      document.querySelector('.progress').style.width = auditionGameVariables.zeroPercent;
      document.querySelector('.audition-game__wrapper').className = 'audition-game__wrapper';
      const correctArray = GameService.normalize(
        roundResults.filter((res) => res.result === auditionGameVariables.correct),
      );
      const failArray = GameService.normalize(
        roundResults.filter((res) => res.result === auditionGameVariables.fail),
      );
      const idkArray = GameService.normalize(
        roundResults.filter((res) => res.result === auditionGameVariables.IDK),
      );
      this.ShortTermStatistics.render(failArray, correctArray, idkArray);
      const stat = new Statistics(this.user);
      stat.init();
      setTimeout(() => {
        stat.saveGameStatistics('auditiongame', correctArray.length, failArray.length);
      }, 5000);
    }
  }

  static normalize(arrayToNormalize) {
    const res = [];
    for (let i = 0; i < arrayToNormalize.length; i += 1) {
      res.push(arrayToNormalize[i].word);
    }
    return res;
  }

  static createPossibleWords(arrayOfWords, answersBlock) {
    for (let i = 0; i < auditionGameVariables.possibleWordsAmount; i += 1) {
      create('div', `audition-game__element Digit${i + 1}`, `${i + 1}.${arrayOfWords[i]?.wordTranslate}`, answersBlock);
    }
  }

  static designUncheckedPossibleWords(elements) {
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
        GameService.designUncheckedPossibleWords(elements);
        document.querySelector('.audition-game__correctanswer').innerText = `${mainWord.word} - ${mainWord.wordTranslate}`;
        document.querySelector('.audition-game__audio__pulse').style.backgroundImage = `url(${urls.mainAudioPath}${mainWord.image})`;
        if (event.target.innerText.includes(mainWord.wordTranslate)) {
          event.target.innerHTML = `${auditionGameVariables.checkMark}${event.target.innerText}`;
          const audioRoundResult = new Audio(urls.correctSound);
          if (!this.sound.classList.contains('audition-game__sound__buttonMuted')) audioRoundResult.play();
          roundResults.push({ result: auditionGameVariables.correct, word: mainWord });
          this.correctAnswersCounter += 1;
          if (this.correctAnswersCounter > 2) this.isHintAvailable = true;

          this.nextRoundEventHandler(nextBtn, lives, roundsAll, currentRound, roundResults);
        } else {
          this.voc.addWordToTheVocabulary(mainWord, vocabularyConstants.WORDS_TO_LEARN_TITLE);
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

    this.keyEnterDownEvent = (event) => {
      if (event.code === auditionGameVariables.Enter && document.querySelector('.audition-game__button__next')?.innerText !== auditionGameVariables.idkBtn) {
        nextBtn.click();
      }
    };
    document.addEventListener('keydown', this.keyEnterDownEvent);
  }

  idkBtnHandler(lives, mainWord, roundsAll, currentRound, roundResults) {
    const idkButton = document.querySelector('.audition-game__button__next');
    idkButton.addEventListener('click', (event) => {
      if (event.target.innerText === auditionGameVariables.idkBtn) {
        this.correctAnswersCounter = 0;
        const nextBtn = document.querySelector('.audition-game__button__next');
        nextBtn.innerHTML = auditionGameVariables.arrowSymbol;
        document.querySelector('.audition-game__correctanswer').innerText = `${mainWord.word} - ${mainWord.wordTranslate}`;
        document.querySelector('.audition-game__audio__pulse').style.backgroundImage = `url(${urls.mainAudioPath}${mainWord.image})`;
        const elements = document.querySelectorAll('.audition-game__element');
        GameService.designUncheckedPossibleWords(elements);
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
          if (!el[i].innerText.includes(mainWord.wordTranslate)) {
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

  static progressBarHandler(roundsAll, currentRound) {
    document.querySelector('.progress').style.width = `${100 * (currentRound / roundsAll)}%`;
  }

  static bgRandomize() {
    const { bg } = auditionGameVariables;
    bg.sort(() => Math.random() - 0.5);
    const wrapper = document.querySelector('.audition-game__wrapper');
    wrapper.className = 'audition-game__wrapper';
    wrapper.classList.toggle(bg[0]);
  }

  modalDialog() {
    const wrapper = document.querySelector('body');
    this.modal = create('div', 'modalAudition', '', wrapper);
    this.modalContent = create('div', 'modal-content', '', this.modal);
    create('h2', 'alarmMessage', auditionGameVariables.modalAlarm, this.modalContent);
    create('p', 'alarmDesc', auditionGameVariables.modalDesc, this.modalContent);
    create('button', 'agreeToClose', auditionGameVariables.close, this.modalContent);
    create('button', 'cancelToClose', auditionGameVariables.cancel, this.modalContent);
    GameService.modalDialogEventsHandler();
  }

  static modalDialogEventsHandler() {
    document.querySelector('.agreeToClose').addEventListener('click', () => {
      document.querySelector('.audition-game__container').remove();
      document.querySelector('.audition-game__startScreen').classList.toggle('hide');
      document.querySelector('.modalAudition').remove();
      document.querySelector('.audition-game__wrapper').className = 'audition-game__wrapper';
      document.querySelector('.progress').style.width = auditionGameVariables.zeroPercent;
    });
    document.querySelector('.cancelToClose').addEventListener('click', () => {
      document.querySelector('.modalAudition').remove();
    });
  }

  keyboardEventsHandler() {
    this.digitDonwEvent = (event) => {
      const choose = document.querySelector(`.${event.code}`);
      if (auditionGameVariables.digits.includes(event.code)) {
        choose.click();
      }
    };

    document.addEventListener('keydown', this.digitDonwEvent);
  }

  soundHandler() {
    document.querySelector('.audition-game__sound__button').addEventListener('click', (event) => {
      event.target.classList.toggle('audition-game__sound__buttonMuted');
      this.isMuted = !this.isMuted;
    });
  }
}
