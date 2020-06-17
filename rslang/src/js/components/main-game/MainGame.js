import { getWords } from '../../service/service';
import create from '../../utils/сreate';
import { urls } from '../../constants/constants';
import { checkIsManyMistakes } from '../../utils/calculations';

import WordCard from './components/word-card/WordCard';
import SettingsControls from './components/settings-controls/SettingsControls';
import EstimateButtonsBlock from './components/estimate-buttons/EstimateButtonsBlock';

const {
  WORDS_AUDIOS_URL,
} = urls;

class MainGame {
  constructor() {
    this.state = {
      currentWordIndex: 0,
      wordsArray: [],
      audio: new Audio(),
      audios: [],
      isAudioEnded: true,
      gameSetting: {
        isAudioPlaybackEnabled: true,
        isTranslationsEnabled: true,
      },
    };
  }

  async render() {
    const { currentWordIndex } = this.state;

    const words = await getWords();
    this.state.wordsArray = words;

    console.log(words);
    const wordCard = MainGame.createWordCard(words[currentWordIndex]);
    this.setAudiosForWords(words[currentWordIndex]);
    const gameSettingsBlock = new SettingsControls();

    const mainGameHTML = create('div', 'main-game', [gameSettingsBlock.render(), wordCard.render()]);
    document.body.append(mainGameHTML);
    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.activateGameSettingsEvents();
    this.activateNextButton();
    this.activateShowAnswerButton();
    MainGame.activateInputWordsHandler();
    this.activateEstimateButtons();
  }

  renderWordCard(currentWordCard) {
    const wordCard = MainGame.createWordCard(currentWordCard);
    this.setAudiosForWords(currentWordCard);
    const mainGameHTML = document.querySelector('.main-game');
    mainGameHTML.append(wordCard.render());

    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.activateNextButton();
    this.activateShowAnswerButton();
    MainGame.activateInputWordsHandler();
  }

  activateGameSettingsEvents() {
    const autoplaybackSettingCheckbox = document.querySelector('.main-game__autoplayback');
    const translationSettingCheckbox = document.querySelector('.main-game__translations');

    autoplaybackSettingCheckbox.addEventListener('change', (event) => {
      this.state.gameSetting.isAudioPlaybackEnabled = event.target.checked;
    });

    translationSettingCheckbox.addEventListener('change', (event) => {
      const wordTransaltionHTML = document.querySelector('.word-card__translation');
      wordTransaltionHTML.style.opacity = event.target.checked ? 1 : 0;
      this.state.gameSetting.isTranslationsEnabled = event.target.checked;
    });
  }

  switchToTheNextWordCard(isForShowAnswerButton = false) {
    const inputHTML = document.querySelector('.word-card__input');
    const wordCardHTML = document.querySelector('.main-game__word-card');
    const nextButtonHTML = document.querySelector('.main-game__next-button');
    const sentencesWords = document.querySelectorAll('.word-card__sentence-word');
    const showAnswerButton = document.querySelector('.main-game__show-answer-button');

    const { currentWordIndex, wordsArray } = this.state;
    const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;

    if (currentWordIndex + 1 !== wordsArray.length) {
      const trimedValue = inputHTML.value.trim();
      const numberOfMistakes = MainGame.checkWord(wordsArray[currentWordIndex].word);

      if (isAudioPlaybackEnabled && this.state.isAudioEnded) {
        this.playAudiosInTurns(0);
      }
      if (isTranslationsEnabled) {
        MainGame.toggleTranslations();
      }

      if ((numberOfMistakes === 0 && trimedValue.length) || isForShowAnswerButton) {
        sentencesWords.forEach((word) => {
          word.classList.add('word-card__sentence-word_visible');
        });
        inputHTML.value = '';
        inputHTML.setAttribute('disabled', 'disabled');
        nextButtonHTML.setAttribute('disabled', 'disabled');
        showAnswerButton.setAttribute('disabled', 'disabled');

        wordCardHTML.append(new EstimateButtonsBlock().render());
      }
    }
  }

  activateEstimateButtons() {
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('main-game__estimate-button')) {
        const { wordsArray } = this.state;
        MainGame.removeWordCardFromDOM();

        this.state.currentWordIndex += 1;
        this.renderWordCard(wordsArray[this.state.currentWordIndex]);
        this.state.audio.pause();
        this.state.audio.src = '';
      };
    });
  }

  activateNextButton() {
    const form = document.querySelector('.main-game__form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.switchToTheNextWordCard();
    });
  }

  activateShowAnswerButton() {
    const showAnswerButton = document.querySelector('.main-game__show-answer-button');

    showAnswerButton.addEventListener('click', () => {
      this.switchToTheNextWordCard(true);
    });
  }

  static checkWord(word) {
    const correctLetters = word.split('');
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const inputValueLetters = inputHTML.value.trim().split('');

    userAnswerHTML.innerHTML = '';
    const numberOfMistakes = inputValueLetters
      .filter((letter, index) => letter !== correctLetters[index]).length;
    const isManyMistakes = checkIsManyMistakes(correctLetters.length, numberOfMistakes);

    correctLetters.forEach((letter, index) => {
      const isLetterCorrect = letter === inputValueLetters[index];
      let extraClassName = null;
      switch (true) {
        case isLetterCorrect:
        default:
          extraClassName = 'word-card-letter_correct';
          break;
        case !inputValueLetters.length:
          extraClassName = 'word-card-letter_many-mistakes';
          break;
        case !isLetterCorrect && !isManyMistakes:
          extraClassName = 'word-card-letter_not-many-mistakes';
          break;
        case !isLetterCorrect && isManyMistakes:
          extraClassName = 'word-card-letter_many-mistakes';
          break;
      }

      const letterHTML = create('span', `word-card-letter ${extraClassName}`, letter);
      userAnswerHTML.append(letterHTML);
    });

    if (numberOfMistakes === 0 && inputValueLetters.length) return 0;

    inputHTML.value = '';
    setTimeout(() => {
      userAnswerHTML.classList.add('word-card__user-answer_translucent');
    }, 1000);

    return numberOfMistakes;
  }

  static activateInputWordsHandler() {
    const formHTML = document.querySelector('.main-game__form');
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');

    formHTML.addEventListener('click', (event) => {
      if (event.target.closest('.word-card__user-answer')) {
        inputHTML.focus();
      }
    });

    inputHTML.addEventListener('input', () => {
      if (userAnswerHTML && userAnswerHTML.childElementCount > 0) {
        userAnswerHTML.innerHTML = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
      }
    });
  }

  static toggleTranslations(isToShow = true) {
    const translationElements = document.querySelectorAll('[data-translation-element]');

    translationElements.forEach((element) => {
      element.style.opacity = isToShow ? 1 : 0;
    });
  }

  playAudiosInTurns(number) {
    if (number < this.state.audios.length) {
      this.state.isAudioEnded = false;
      let firstAudioIndex = number;
      this.playAudio(this.state.audios[firstAudioIndex]);

      this.state.audio.onended = () => {
        if (firstAudioIndex === this.state.audios.length - 1) {
          this.state.isAudioEnded = true;
        }

        firstAudioIndex += 1;
        this.playAudiosInTurns(firstAudioIndex);
      };
    }
  }

  playAudio(source) {
    const { src, ended } = this.state.audio;
    console.log((/localhost/).test(src));
    console.log(src);
    if (src === '' || (/localhost/).test(src) || ended) {
      this.state.audio.src = source;
      this.state.audio.play();
    }
  }

  static createWordCard(currentWord) {
    const wordCard = new WordCard(
      currentWord.id,
      currentWord.word,
      currentWord.wordTranslate,
      currentWord.textMeaning,
      currentWord.textMeaningTranslate,
      currentWord.textExample,
      currentWord.textExampleTranslate,
      currentWord.audio,
      currentWord.image,
    );

    return wordCard;
  }

  static removeWordCardFromDOM() {
    const wordCardHTML = document.querySelector('.main-game__word-card');
    wordCardHTML.remove();
  }

  setAudiosForWords(currentWord) {
    this.state.audios = [
      `${WORDS_AUDIOS_URL}${currentWord.audio}`,
      `${WORDS_AUDIOS_URL}${currentWord.audioMeaning}`,
      `${WORDS_AUDIOS_URL}${currentWord.audioExample}`,
    ];
  }
}

export default MainGame;
