import { getWords } from '../../service/service';
import create from '../../utils/сreate';
import { urls } from '../../constants/constants';

import WordCard from './components/word-card/WordCard';
import SettingsControls from './components/settings-controls/SettingsControls';

const {
  WORDS_AUDIOS_URL,
} = urls;

class MainGame {
  constructor() {
    this.state = {
      currentWordIndex: 0,
      wordsArray: [],
      audios: [],
      gameSetting: {
        isAudioPlaybackEnabled: true,
        isTranslationsEnabled: true,
      },
    };
  }

  async render() {
    const wordCard = await this.renderWordCard();
    const gameSettingsBlock = new SettingsControls();

    const mainGameHTML = create('div', 'main-game', [wordCard.render(), gameSettingsBlock.render()]);
    document.body.append(mainGameHTML);
    const wordCardInput = document.querySelector('.word-card__input');
    wordCardInput.focus();
    this.activateGameSettingsEvents();
    this.activateNextButton();
  }

  activateGameSettingsEvents() {
    const autoplaybackSettingCheckbox = document.querySelector('.main-game__autoplayback');
    const translationSettingCheckbox = document.querySelector('.main-game__translations');

    autoplaybackSettingCheckbox.addEventListener('change', (event) => {
      this.state.gameSetting.isAudioPlaybackEnabled = event.target.checked;
    });

    translationSettingCheckbox.addEventListener('change', (event) => {
      this.state.gameSetting.isTranslationsEnabled = event.target.checked;
    });
  }

  activateNextButton() {
    const form = document.querySelector('.main-game__form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const { currentWordIndex, wordsArray } = this.state;
      const { isAudioPlaybackEnabled, isTranslationsEnabled } = this.state.gameSetting;
      if (currentWordIndex + 1 !== wordsArray.length) {
        this.state.currentWordIndex += 1;
        if (isAudioPlaybackEnabled) {
          this.playAudiosInTurns(0);
        }
        if (isTranslationsEnabled) {
          MainGame.toggleTranslations();
        }
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
      let firstAudioIndex = number;
      const audio = new Audio(this.state.audios[firstAudioIndex]);
      audio.play();

      audio.onended = () => {
        firstAudioIndex += 1;
        this.playAudiosInTurns(firstAudioIndex);
      };
    }
  }

  async renderWordCard() {
    const { currentWordIndex } = this.state;
    const words = await getWords();
    this.state.wordsArray = words;
    this.state.audios = [
      `${WORDS_AUDIOS_URL}${words[currentWordIndex].audio}`,
      `${WORDS_AUDIOS_URL}${words[currentWordIndex].audioMeaning}`,
      `${WORDS_AUDIOS_URL}${words[currentWordIndex].audioExample}`,
    ];

    const currentWord = words[currentWordIndex];
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
}

export default MainGame;
