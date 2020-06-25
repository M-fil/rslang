import create from '../../utils/сreate';
import {
  settingsText,
} from '../../constants/constants';
import {
  setUserSettings,
  getUserSettings,
} from '../../service/service';
import ModalForm from '../modal-form/modalform';
import Preloader from '../preloader/Preloader';

export default class Settings {
  constructor(userData) {
    if (Settings.exists) {
      return Settings.instance;
    }

    this.user = userData || false;

    Settings.exists = true;
    Settings.instance = this;

    this.modalForm = new ModalForm('settings__modal', 'settings_modal', settingsText.title);
    this.preloader = new Preloader();
  }

  async init() {
    await this.loadSettings();

    this.renderSettingsWindow();
    this.preloader.render();
  }

  renderSettingsWindow() {
    const tabsList = Settings.renderTabList();

    const submitButton = create('input', 'settings-form__submit', undefined, undefined, ['type', 'submit'], ['value', settingsText.form.submitButton]);
    const form = create('form', 'settings-form', [
      this.renderMainTab(),
      this.renderDictionaryTab(),
      this.renderFindAPairTab(),
      submitButton,
    ], undefined, ['id', 'settings-form']);

    form.addEventListener('submit', (this.formSubmitHandler).bind(this));

    const div = create('div', 'settings', [
      tabsList,
      form,
    ]);

    this.modalForm.setContent(div);
  }

  static renderTabList() {
    const tabMain = create('li', 'settings-tabs-list__item settings-tabs-list__item_active', settingsText.tabList.mainGame, undefined, ['tabId', 1], ['title', settingsText.tabList.mainGame]);
    const tabDictionary = create('li', 'settings-tabs-list__item', settingsText.tabList.dictionary, undefined, ['tabId', 2], ['title', settingsText.tabList.dictionary]);
    const tabFindAPair = create('li', 'settings-tabs-list__item', settingsText.tabList.findapair, undefined, ['tabId', 3], ['title', settingsText.tabList.findapair]);
    const ul = create('ul', 'settings-tabs-list', [tabMain, tabDictionary, tabFindAPair]);

    ul.addEventListener('click', Settings.openTabsHandler);

    return ul;
  }

  renderMainTab() {
    const newCardsPerDayInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'newMainCardsPerDay'], ['value', this.options.main.newCardsPerDay]);
    newCardsPerDayInput.addEventListener('click', (event) => {
      const maxCardsEl = document.querySelector('.settings-form__input[name=maxMainCardsPerDay]');
      const newCards = Number(event.target.value);
      maxCardsEl.setAttribute('min', newCards + 5);
      if (Number(maxCardsEl.value) < (newCards + 5)) maxCardsEl.value = newCards + 5;
    });
    const newCardsPerDay = create('label', 'settings-form__label', [`${settingsText.tabs.mainGame.newCardsPerDay}: `, newCardsPerDayInput]);
    const maxCardsPerDayInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'maxMainCardsPerDay'], ['value', this.options.main.maxCardsPerDay], ['min', this.options.main.newCardsPerDay + 5]);
    const maxCardsPerDay = create('label', 'settings-form__label', [`${settingsText.tabs.mainGame.maxCardsPerDay}: `, maxCardsPerDayInput]);
    const TranslateWordInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowTranslateWord']);
    TranslateWordInput.checked = this.options.main.showTranslateWord;
    const TranslateWord = create('label', 'settings-form__label', [TranslateWordInput, ` ${settingsText.tabs.mainGame.showTranslateWord}`]);
    const WordMeaningInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowWordMeaning']);
    WordMeaningInput.checked = this.options.main.showWordMeaning;
    const WordMeaning = create('label', 'settings-form__label', [WordMeaningInput, ` ${settingsText.tabs.mainGame.showWordMeaning}`]);
    const WordExampleInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowWordExample']);
    WordExampleInput.checked = this.options.main.showWordExample;
    const WordExample = create('label', 'settings-form__label', [WordExampleInput, ` ${settingsText.tabs.mainGame.showWordExample}`]);
    const TranscriptionInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowTranscription']);
    TranscriptionInput.checked = this.options.main.showTranscription;
    const Transcription = create('label', 'settings-form__label', [TranscriptionInput, ` ${settingsText.tabs.mainGame.showTranscription}`]);
    const ImageAssociationsInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowImageAssociations']);
    ImageAssociationsInput.checked = this.options.main.showImageAssociations;
    const ImageAssociations = create('label', 'settings-form__label', [ImageAssociationsInput, ` ${settingsText.tabs.mainGame.showImageAssociations}`]);
    const ButtonShowAnswerInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowButtonShowAnswer']);
    ButtonShowAnswerInput.checked = this.options.main.showButtonShowAnswer;
    const ButtonShowAnswer = create('label', 'settings-form__label', [ButtonShowAnswerInput, ` ${settingsText.tabs.mainGame.showButtonShowAnswer}`]);
    const ButtonDeleteInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowButtonDelete']);
    ButtonDeleteInput.checked = this.options.main.showButtonDelete;
    const ButtonDelete = create('label', 'settings-form__label', [ButtonDeleteInput, ` ${settingsText.tabs.mainGame.showButtonShowDelete}`]);
    const ButtonHardInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowButtonHard']);
    ButtonHardInput.checked = this.options.main.showButtonHard;
    const ButtonHard = create('label', 'settings-form__label', [ButtonHardInput, ` ${settingsText.tabs.mainGame.showButtonShowHard}`]);
    const ButtonsEasyDifficultInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isMainShowButtons']);
    ButtonsEasyDifficultInput.checked = this.options.main.showButtons;
    ButtonsEasyDifficultInput.addEventListener('click', (event) => {
      const easyEl = document.querySelector('.settings-form__input[name=mainIntervalEasy]');
      const normalEl = document.querySelector('.settings-form__input[name=mainIntervalNormal]');
      const difficultEl = document.querySelector('.settings-form__input[name=mainIntervalDifficult]');
      easyEl.disabled = !event.target.checked;
      normalEl.disabled = !event.target.checked;
      difficultEl.disabled = !event.target.checked;
    });
    const ButtonsEasyDifficult = create('label', 'settings-form__label', [ButtonsEasyDifficultInput, ` ${settingsText.tabs.mainGame.showButtons}`]);
    const intervalEasyInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'mainIntervalEasy'], ['value', this.options.main.intervalEasy], ['min', this.options.main.intervalNormal + 1]);
    intervalEasyInput.disabled = !this.options.main.showButtons;
    intervalEasyInput.addEventListener('click', Settings.intervalLimitsHandler);
    const intervalEasy = create('label', 'settings-form__label', [`${settingsText.tabs.mainGame.mainIntervalEasy}: `, intervalEasyInput]);
    const intervalNormalInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'mainIntervalNormal'], ['value', this.options.main.intervalNormal], ['min', this.options.main.intervalDifficult + 1]);
    intervalNormalInput.disabled = !this.options.main.showButtons;
    intervalNormalInput.addEventListener('click', Settings.intervalLimitsHandler);
    const intervalNormal = create('label', 'settings-form__label', [`${settingsText.tabs.mainGame.mainIntervalNormal}: `, intervalNormalInput]);
    const intervalDifficultInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'mainIntervalDifficult'], ['value', this.options.main.intervalDifficult]);
    intervalDifficultInput.disabled = !this.options.main.showButtons;
    intervalDifficultInput.addEventListener('click', Settings.intervalLimitsHandler);
    const intervalDifficult = create('label', 'settings-form__label', [`${settingsText.tabs.mainGame.mainIntervalDifficult}: `, intervalDifficultInput]);

    const div = create('div', 'settings-tabs__item settings-tabs__item_active', [
      newCardsPerDay,
      maxCardsPerDay,
      TranslateWord,
      WordMeaning,
      WordExample,
      Transcription,
      ImageAssociations,
      ButtonShowAnswer,
      ButtonDelete,
      ButtonHard,
      ButtonsEasyDifficult,
      intervalEasy,
      intervalNormal,
      intervalDifficult,
    ], undefined, ['tabId', 1]);

    return div;
  }

  renderDictionaryTab() {
    const AudioExampleInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowAudioExample']);
    AudioExampleInput.checked = this.options.dictionary.showAudioExample;
    const AudioExample = create('label', 'settings-form__label', [AudioExampleInput, ` ${settingsText.tabs.dictionary.audioExample}`]);
    const TranslateWordInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowTranslateWord']);
    TranslateWordInput.checked = this.options.dictionary.showTranslateWord;
    const TranslateWord = create('label', 'settings-form__label', [TranslateWordInput, ` ${settingsText.tabs.dictionary.translateWord}`]);
    const WordMeaningInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowWordMeaning']);
    WordMeaningInput.checked = this.options.dictionary.showWordMeaning;
    const WordMeaning = create('label', 'settings-form__label', [WordMeaningInput, ` ${settingsText.tabs.dictionary.wordMeaning}`]);
    const WordExampleInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowWordExample']);
    WordExampleInput.checked = this.options.dictionary.showWordExample;
    const WordExample = create('label', 'settings-form__label', [WordExampleInput, ` ${settingsText.tabs.dictionary.wordExample}`]);
    const TranscriptionInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowTranscription']);
    TranscriptionInput.checked = this.options.dictionary.showTranscription;
    const Transcription = create('label', 'settings-form__label', [TranscriptionInput, ` ${settingsText.tabs.dictionary.transcription}`]);
    const ImageAssociationsInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'isDictionaryShowImageAssociations']);
    ImageAssociationsInput.checked = this.options.dictionary.showImageAssociations;
    const ImageAssociations = create('label', 'settings-form__label', [ImageAssociationsInput, ` ${settingsText.tabs.dictionary.imageAssociations}`]);

    const div = create('div', 'settings-tabs__item', [AudioExample, TranslateWord, WordMeaning, WordExample, Transcription, ImageAssociations], undefined, ['tabId', 2]);

    return div;
  }

  renderFindAPairTab() {
    const delayBeforeClosingInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'delayBeforeClosingCard'], ['value', this.options.findapair.delayBeforeClosingCard]);
    const delayBeforeClosing = create('label', 'settings-form__label', [`${settingsText.tabs.findapair.delayBeforeClosingCard}: `, delayBeforeClosingInput]);

    const cardTextOnStartInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', 'showCardsTextOnStart']);
    cardTextOnStartInput.checked = this.options.findapair.cardTextOnStart;
    cardTextOnStartInput.addEventListener('click', (event) => {
      const elem = document.querySelector('.settings-form__input[name=showingCardsTime]');
      elem.disabled = !event.target.checked;
    });
    const cardTextOnStart = create('label', 'settings-form__label', [cardTextOnStartInput, ` ${settingsText.tabs.findapair.showCardsTextOnStart}`]);
    const showingCardsTimeInput = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', 'showingCardsTime'], ['value', this.options.findapair.showingCardsTime]);
    showingCardsTimeInput.disabled = !this.options.findapair.cardTextOnStart;
    const showingCardsTime = create('label', 'settings-form__label', [`${settingsText.tabs.findapair.showingCardsTime}: `, showingCardsTimeInput]);

    const div = create('div', 'settings-tabs__item', [delayBeforeClosing, cardTextOnStart, showingCardsTime], undefined, ['tabId', 3]);

    return div;
  }

  openSettingsWindow() {
    this.modalForm.openModal();
  }

  closeSettingsWindow() {
    this.modalForm.closeModal();
    this.preloader.hide();
  }

  async saveSettings() {
    const body = {
      wordsPerDay: this.options.main.maxCardsPerDay,
      optional: this.options,
    };

    await setUserSettings(this.user.userId, this.user.token, body);
  }

  async loadSettings() {
    const res = await getUserSettings(this.user.userId, this.user.token);
    if (res) this.options = res.optional;
    else {
      this.options = {
        main: {
          newCardsPerDay: 20,
          maxCardsPerDay: 25,
          showTranslateWord: true,
          showWordMeaning: true,
          showWordExample: true,
          showTranscription: true,
          showImageAssociations: true,
          showButtonShowAnswer: true,
          showButtonDelete: true,
          showButtonHard: true,
          showButtons: true,
          intervalEasy: 9,
          intervalNormal: 6,
          intervalDifficult: 3,
        },
        dictionary: {
          showAudioExample: true,
          showTranslateWord: true,
          showWordMeaning: true,
          showWordExample: true,
          showTranscription: true,
          showImageAssociations: true,
        },
        findapair: {
          delayBeforeClosingCard: 500,
          showCardsTextOnStart: true,
          showingCardsTime: 1000,
        },
      };
    }
  }

  getSettings() {
    return this.options;
  }

  getSettingsByGroup(group) {
    return this.options[group] || {};
  }

  static intervalLimitsHandler() {
    const easyEl = document.querySelector('.settings-form__input[name=mainIntervalEasy]');
    const normalEl = document.querySelector('.settings-form__input[name=mainIntervalNormal]');
    const difficultEl = document.querySelector('.settings-form__input[name=mainIntervalDifficult]');
    const difficultNum = Number(difficultEl.value);
    const easyNum = Number(easyEl.value);
    let normalNum = Number(normalEl.value);

    if (normalNum <= difficultNum) {
      normalNum = difficultNum + 1;
      normalEl.value = normalNum;
    }
    if (easyNum <= normalNum) easyEl.value = normalNum + 1;

    normalEl.setAttribute('min', difficultNum + 1);
    easyEl.setAttribute('min', normalNum + 1);
  }

  formSubmitHandler(event) {
    event.preventDefault();
    const FORM = document.querySelector('#settings-form');
    this.saveFormData(FORM);
    return false;
  }

  async saveFormData(form) {
    this.preloader.show();
    this.options = {
      main: {
        newCardsPerDay: Number(form.querySelector('.settings-form__input[name=newMainCardsPerDay]').value),
        maxCardsPerDay: Number(form.querySelector('.settings-form__input[name=maxMainCardsPerDay]').value),
        showTranslateWord: form.querySelector('.settings-form__input[name=isMainShowTranslateWord]').checked,
        showWordMeaning: form.querySelector('.settings-form__input[name=isMainShowWordMeaning]').checked,
        showWordExample: form.querySelector('.settings-form__input[name=isMainShowWordExample]').checked,
        showTranscription: form.querySelector('.settings-form__input[name=isMainShowTranscription]').checked,
        showImageAssociations: form.querySelector('.settings-form__input[name=isMainShowImageAssociations]').checked,
        showButtonShowAnswer: form.querySelector('.settings-form__input[name=isMainShowButtonShowAnswer]').checked,
        showButtonDelete: form.querySelector('.settings-form__input[name=isMainShowButtonDelete]').checked,
        showButtonHard: form.querySelector('.settings-form__input[name=isMainShowButtonHard]').checked,
        showButtons: form.querySelector('.settings-form__input[name=isMainShowButtons]').checked,
        intervalEasy: Number(form.querySelector('.settings-form__input[name=mainIntervalEasy]').value),
        intervalNormal: Number(form.querySelector('.settings-form__input[name=mainIntervalNormal]').value),
        intervalDifficult: Number(form.querySelector('.settings-form__input[name=mainIntervalDifficult]').value),
      },
      dictionary: {
        showAudioExample: form.querySelector('.settings-form__input[name=isDictionaryShowAudioExample]').checked,
        showTranslateWord: form.querySelector('.settings-form__input[name=isDictionaryShowTranslateWord]').checked,
        showWordMeaning: form.querySelector('.settings-form__input[name=isDictionaryShowWordMeaning]').checked,
        showWordExample: form.querySelector('.settings-form__input[name=isDictionaryShowWordExample]').checked,
        showTranscription: form.querySelector('.settings-form__input[name=isDictionaryShowTranscription]').checked,
        showImageAssociations: form.querySelector('.settings-form__input[name=isDictionaryShowImageAssociations]').checked,
      },
      findapair: {
        delayBeforeClosingCard: Number(form.querySelector('.settings-form__input[name=delayBeforeClosingCard]').value),
        showCardsTextOnStart: true,
        showingCardsTime: 1000,
      },
    };
    await this.saveSettings();
    this.closeSettingsWindow();
  }

  static openTabsHandler(event) {
    if (event.target.tagName === 'LI') {
      const element = event.target;
      const id = element.dataset.tabId;
      const tabsList = document.querySelectorAll('.settings-tabs-list__item');
      tabsList.forEach((el) => el.classList.remove('settings-tabs-list__item_active'));
      element.classList.add('settings-tabs-list__item_active');

      const tabs = document.querySelectorAll('.settings-tabs__item');
      tabs.forEach((el) => {
        el.classList.remove('settings-tabs__item_active');
        if (el.dataset.tabId === id) {
          el.classList.add('settings-tabs__item_active');
        }
      });
    }
  }
}
