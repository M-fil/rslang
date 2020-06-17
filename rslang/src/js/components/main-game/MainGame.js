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

    const wordCard = MainGame.createWordCard(words[currentWordIndex]);
    this.setAudiosForWords(words[currentWordIndex]);
    const gameSettingsBlock = new SettingsControls();

    const mainGameHTML = create('div', 'main-game', [wordCard.render(), gameSettingsBlock.render()]);
    document.body.append(mainGameHTML);
    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.activateGameSettingsEvents();
    this.activateNextButton();
    MainGame.activateInputWordsHandler();
  }

  renderWordCard(currentWordCard) {
    const wordCard = MainGame.createWordCard(currentWordCard);
    this.setAudiosForWords(currentWordCard);
    const mainGameHTML = document.querySelector('.main-game');
    mainGameHTML.append(wordCard.render());

    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.activateNextButton();
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

  showTheNextWordCard() {
    const mainGameHTML = document.querySelector('.main-game');
    const inputHTML = document.querySelector('.word-card__input');
    const wordCardHTML = document.querySelector('.main-game__word-card');

    const { currentWordIndex, wordsArray } = this.state;
    const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;
    if (currentWordIndex + 1 !== wordsArray.length) {
      const numberOfMistakes = MainGame.checkWord(wordsArray[currentWordIndex].word);

      if (isAudioPlaybackEnabled) {
        this.playAudiosInTurns(0);
      }
      if (isTranslationsEnabled) {
        MainGame.toggleTranslations();
      }

      if (numberOfMistakes === 0) {
        inputHTML.value = '';
        inputHTML.setAttribute('disabled', 'disabled');

        wordCardHTML.append(new EstimateButtonsBlock().render());

        setTimeout(() => {
          MainGame.removeWordCardFromDOM();

          this.state.currentWordIndex += 1;
          this.renderWordCard(wordsArray[this.state.currentWordIndex]);
        }, 2000);
      }
    }
  }

  activateNextButton() {
    const form = document.querySelector('.main-game__form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.state.isAudioEnded) {
        this.showTheNextWordCard();
      }
    });
  }

  static checkWord(word) {
    const correctLetters = word.split('');
    const inputHTML = document.querySelector('.word-card__input');
    const userAnswerHTML = document.querySelector('.word-card__user-answer');
    const inputValueLetters = inputHTML.value.trim().split('');

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

    if (numberOfMistakes === 0) return 0;

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
        userAnswerHTML.innerHTML = '';
        inputHTML.focus();
      }
    });

    inputHTML.addEventListener('input', () => {
      if (userAnswerHTML && userAnswerHTML.childElementCount > 0) {
        userAnswerHTML.innerHTML = '';
        userAnswerHTML.classList.remove('word-card__user-answer_translucent');
        userAnswerHTML.children.forEach((child) => {
          child.className = 'word-card-letter';
        });
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
    if (this.state.audio.src === '' || this.state.audio.ended) {
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
