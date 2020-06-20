import create, { getWords, speakItConstants } from './pathes';

import WordCard from './components/words/WordCard';
import StartGamePage from './components/pages/StartGamePage';
import ImageBlock from './components/imageBlock/ImageBlock';
import Navigation from './components/navigation/Navigation';
import ButtonsBlock from './components/buttons/ButtonsBlock';
import StatisticsBlock from './components/statistics/StatisticsBlock';

const {
  FILES_PATH,
} = speakItConstants;

export default class SpeakIt {
  constructor() {
    this.words = [];
    this.recognition = SpeakIt.createSpeechRecongnition();

    this.state = {
      gameStarted: false,
      currentPage: 0,
      groupOfWords: 0,
      correct: 0,
      isMicroDisabled: true,
      isNavSwitched: false,
    };
  }

  run() {
    SpeakIt.renderStartGamePage();

    this.initMainGamePage();
  }

  static async getWords(page, group) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
    const res = await fetch(url);
    const json = await res.json();

    return res;
  }

  static renderStartGamePage() {
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');
    const startGamePage = new StartGamePage();

    mainContainerWrapper.append(startGamePage.render());
  }

  initMainGamePage() {
    const mainContainerWrapper = document.querySelector('.main-container__wrapper');

    document.querySelector('.start-page__button-start').addEventListener('click', async () => {
      mainContainerWrapper.innerHTML = '';
      document.querySelector('main').classList.add('in-game');

      const randomNumber = getRandomNumber(0, 29);
      this.state.currentPage = page;
      this.state.groupOfWords = 0;
      const data = await getWords(this.state.currentPage, this.state.groupOfWords);
      localStorage.setItem('words', JSON.stringify(data, null, 1));

      this.renderWordsOnThePage();
      this.wordCardClickEvent();
      this.startGame();
      this.activateRestartButton();
      this.activateMicroButton();

      this.activateNavigation();
      this.activateStatisticsBlock();
      this.acitavateRecognition();
      this.activateSoundForStatisticsWords();

      this.recognition.addEventListener('end', this.recognition.start);
      this.recognition.start();
    });
  }

  static renderNavigation() {
    create(
      'div', 'navigation',
      new Navigation().render(),
      document.querySelector('.main-container__wrapper')
    );
  }

  renderWords() {
    this.words = JSON.parse(localStorage.getItem('words')).slice(0, 10);

    const container = create('div', 'game-page');
    const wordsContainer = create('div', 'game-page__words', '', container);

    const imageBlock = new ImageBlock();
    container.prepend(imageBlock.render());

    this.words.forEach((word) => {
      const wordCard = new WordCard(
        word.word,
        word.transcription,
        word.image.replace(FILES_PATH, ''),
        word.audio.replace(FILES_PATH, ''),
      );

      wordsContainer.append(wordCard.render());
    });

    document.querySelector('.navigation').after(container);
  }

  renderWordsOnThePage() {
    SpeakIt.renderNavigation();
    this.renderWords();
    const statistics = new StatisticsBlock(this.words);
    document.body.append(statistics.render());

    const currentNavItem = document.querySelector(`[data-nav-number="${this.state.groupOfWords + 1}"]`);
    SpeakIt.selectSingleElementFromList(currentNavItem, 'navigation__item_selected');

    document.querySelector('.microphone-button').classList.remove('hidden');
    document.querySelector('.main-container__wrapper').append(new ButtonsBlock().render());
  }

  wordCardClickEvent() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.word-card');

      if (!target) return;
      if (target.classList.contains('playing')) return;
      if (this.state.gameStarted) return;

      const wordHTML = target.querySelector('.word-card__word').textContent;
      fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200421T185841Z.7d79d7403a3db65c.04818b18b6ce43075da4ba3ef7e85382856e7b02&text=${wordHTML}&lang=en-ru`)
        .then((response) => response.json())
        .then((data) => {
          SpeakIt.selectSingleElementFromList(target, 'word-card_selected');
          const tranlation = data.text;
          const audio = new Audio(`https://raw.githubusercontent.com/irinainina/rslang-data/master/data/${target.dataset.audio}`);

          audio.addEventListener('play', () => {
            target.classList.add('playing');
          });
          audio.onended = () => {
            target.classList.remove('playing');
          };
          audio.play();

          let currentImage = '../src/assets/english.jpg';
          if (document.querySelector('.game-page__image-block')) {
            document.querySelector('.game-page__image-block').remove();
          }
          if (document.querySelector('.game-page__word-info')) {
            document.querySelector('.game-page__word-info').remove();
          }

          currentImage = `https://raw.githubusercontent.com/irinainina/rslang-data/master/data/${target.dataset.image}`;
          const imageBlock = new ImageBlock(currentImage, wordHTML, tranlation);
          document.querySelector('.game-page').prepend(imageBlock.render());
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    });
  }

  static selectSingleElementFromList(target, selectedClass) {
    Array.from(document.querySelectorAll(`.${selectedClass}`)).forEach((elem) => {
      elem.classList.remove(selectedClass);
    });

    target.classList.add(selectedClass);
  }

  startGame() {
    document.querySelector('.start-game-button').addEventListener('click', () => {
      if (this.state.gameStarted) return;

      this.state.gameStarted = true;

      document.querySelector('.microphone-button').classList.remove('microphone-button_disabled');
      document.querySelector('.microphone-button i').className = 'fas fa-microphone';
      this.state.isMicroDisabled = false;

      document.querySelector('.word-info__speech-recognition').classList.remove('hidden');
      document.querySelector('.word-info__translation').classList.add('hidden');
      document.querySelector('.word-info__image').src = '../src/assets/english.jpg';

      Array.from(document.querySelectorAll('.word-card_selected')).forEach((elem) => {
        elem.classList.remove('word-card_selected');
      });
    });
  }

  getWordsFromThePage() {
    const array = [];
    this.words.forEach((word) => {
      array.push(word.word.toLowerCase());
    });

    return array;
  }

  static createSpeechRecongnition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    return recognition;
  }

  acitavateRecognition() {
    const listOfWords = this.getWordsFromThePage();

    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const recognitionList = new SpeechGrammarList();
    const grammar = `#JSGF V1.0; grammar words; public <words> = ${listOfWords.join(' | ')} ;`;
    recognitionList.addFromString(grammar, 1);
    this.recognition.grammars = recognitionList;
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', (event) => {
      if (!this.state.gameStarted) return;
      if (this.state.isMicroDisabled) return;

      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      const pronouncedWord = transcript.trim().toLowerCase();
      document.querySelector('.word-info__speech-recognition span').textContent = transcript;
      const currentWord = document.querySelector(`[data-word="${pronouncedWord}"]`);

      if (listOfWords.includes(pronouncedWord) && !currentWord.classList.contains('word-card_guessed')) {
        currentWord.classList.add('word-card_guessed');
        new Audio('./src/assets/correct.mp3').play();

        document.querySelector('.game-page__word-info').remove();

        const currentImage = `https://raw.githubusercontent.com/irinainina/rslang-data/master/data/${currentWord.dataset.image}`;
        const imageBlock = new ImageBlock(currentImage, pronouncedWord, '', false);
        document.querySelector('.game-page').prepend(imageBlock.render());
        document.querySelector('.word-info__speech-recognition span').textContent = pronouncedWord;

        document.querySelector('.score').textContent = `+${this.state.correct += 1}`;
        document.querySelector('.score').classList.remove('hidden');

        SpeakIt.updateStatistics(pronouncedWord);

        if (this.state.correct === listOfWords.length) {
          setTimeout(() => {
            new Audio('./src/assets/success.mp3').play();
            document.querySelector('.statistics').classList.remove('hidden');
            document.querySelector('.overlay').classList.remove('hidden');
            this.activateStatisticsButtons();
          }, 1500);
        }
      }
    });
  }

  static updateStatistics(target) {
    const correctContainer = document.querySelector('.statistics__correct');
    const mistakesContainer = document.querySelector('.statistics__mistakes');

    const wordElement = document.querySelector(`[data-score-word="${target}"]`);

    if (mistakesContainer.contains(wordElement)) {
      const word = mistakesContainer.removeChild(wordElement);
      correctContainer.append(word);
    }
  }

  activateNavigation() {
    document.querySelector('.navigation').addEventListener('click', (event) => {
      if (event.target.className !== 'navigation__item') return;

      this.state.isNavSwitched = true;
      this.state.groupOfWords = event.target.dataset.navNumber;
      this.switchOnTrainingMode();

      const statisticsBlock = document.querySelector('.statistics');
      if (statisticsBlock) statisticsBlock.remove();

      SpeakIt.selectSingleElementFromList(event.target, 'navigation__item_selected');
      this.renderMainGamePage(this.state.groupOfWords - 1);
    });
  }

  renderMainGamePage(groupNumber) {
    SpeakIt
      .getRandomNumber(0, 29)
      .then((page) => {
        this.state.currentPage = page;
      })
      .then(() => {
        SpeakIt.getWords(this.state.currentPage, groupNumber);

        document.querySelector('.game-page').remove();
      })
      .then(() => {
        this.renderWords();
        document.querySelector('.loading').remove();
      })
      .then(() => {
        const statistics = new StatisticsBlock(this.words);
        document.body.append(statistics.render());
        this.activateStatisticsBlock();
        this.acitavateRecognition();
      });
  }

  switchOnTrainingMode() {
    document.querySelector('.word-info__image').src = '../src/assets/english.jpg';
    document.querySelector('.word-info__translation').textContent = '';
    document.querySelector('.word-info__speech-recognition span').textContent = '';

    document.querySelector('.word-info__speech-recognition').classList.add('hidden');
    document.querySelector('.word-info__translation').classList.remove('hidden');

    document.querySelector('.score').classList.add('hidden');
    document.querySelector('.score').textContent = '';

    Array.from(document.querySelectorAll('.word-card')).forEach((elem) => {
      elem.classList.remove('word-card_guessed');
      elem.classList.remove('word-card_selected');
    });

    this.disableMicro();

    this.state.correct = 0;
    this.state.gameStarted = false;
  }

  disableMicro() {
    this.state.isMicroDisabled = true;
    const micro = document.querySelector('.microphone-button');
    micro.classList.add('microphone-button_disabled');
    micro.querySelector('i').className = 'fas fa-microphone-slash';
  }

  static async getRandomNumber(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  activateStatisticsBlock() {
    document.querySelector('.result-button').addEventListener('click', () => {
      document.querySelector('.statistics').classList.remove('hidden');
      document.querySelector('.overlay').classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      this.activateStatisticsButtons();
    });
  }

  activateStatisticsButtons() {
    const backButton = document.querySelector('.back-button');
    const newGameButton = document.querySelector('.new-game-button');

    document.addEventListener('click', (event) => {
      if (!document.body.contains(backButton)) return;
      if (!event.target.closest('.back-button')) return;

      document.querySelector('.statistics').classList.add('hidden');
      document.querySelector('.overlay').classList.add('hidden');
      document.body.style.overflow = 'auto';
    });

    document.addEventListener('click', (event) => {
      if (!document.body.contains(newGameButton)) return;
      if (!event.target.closest('.new-game-button')) return;

      document.querySelector('.overlay').classList.add('hidden');
      document.body.style.overflow = 'auto';

      this.switchOnTrainingMode();
      SpeakIt.selectSingleElementFromList(document.querySelector('[data-nav-number="1"]'), 'navigation__item_selected');
      this.renderMainGamePage(this.state.groupOfWords);

      document.querySelector('.statistics').remove();
    });
  }

  activateSoundForStatisticsWords() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.statistics__word');
      if (!target) return;
      if (target.classList.contains('playing')) return;

      const word = this.words.find((elem) => elem.word === target.dataset.scoreWord);

      const audio = new Audio(`https://raw.githubusercontent.com/irinainina/rslang-data/master/data/${word.audio.replace('files/', '')}`);

      audio.addEventListener('play', () => {
        target.classList.add('playing');
      });
      audio.onended = () => {
        target.classList.remove('playing');
      };
      audio.play();
    });
  }

  activateRestartButton() {
    document.querySelector('.restart-button').addEventListener('click', () => {
      this.switchOnTrainingMode();
    });
  }

  activateMicroButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.microphone-button');
      if (!target) return;

      this.state.isMicroDisabled = !this.state.isMicroDisabled;

      if (this.state.isMicroDisabled) {
        target.classList.add('microphone-button_disabled');
        target.querySelector('i').className = 'fas fa-microphone-slash';
      } else {
        target.classList.remove('microphone-button_disabled');
        target.querySelector('i').className = 'fas fa-microphone';
      }
    });
  }
}
