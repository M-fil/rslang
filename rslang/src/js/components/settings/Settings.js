import create from '../../utils/сreate';
import {
  settingsText,
} from '../../constants/constants';
import {
  setUserSettings,
  getUserSettings,
} from '../../service/service';
import ModalWindow from '../modal-window/modalwindow';
import Preloader from '../preloader/Preloader';

const SettingsConst = {
  differenceBetweenNewAndMax: 5,
  minStepBetweenEasyAndNormal: 1,
  minStepBetweenNormalAndDifficult: 1,
  convertToMilliseconds: 1000,
};

export default class Settings {
  constructor(userData) {
    if (Settings.exists) {
      return Settings.instance;
    }

    this.user = userData || false;

    Settings.exists = true;
    Settings.instance = this;
    this.initialized = false;

    this.modalWindow = new ModalWindow('settings__modal', 'settings_modal', settingsText.title);
    this.preloader = new Preloader();
  }

  async init() {
    if (!this.initialized) {
      this.initialized = true;
      await this.loadSettings();

      this.renderSettingsWindow();
      this.preloader.render();
    }
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

    this.modalWindow.setContent(div);
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
    const newCardsPerDay = Settings.createNumberTabElement('newMainCardsPerDay', settingsText.tabs.mainGame.newCardsPerDay, this.options.main.newCardsPerDay, false, (event) => {
      const maxCardsEl = document.querySelector('.settings-form__input[name=maxMainCardsPerDay]');
      const newCards = Number(event.target.value);
      const maxCardsMin = newCards + SettingsConst.differenceBetweenNewAndMax;
      maxCardsEl.setAttribute('min', maxCardsMin);
      if (Number(maxCardsEl.value) < (maxCardsMin)) maxCardsEl.value = maxCardsMin;
    });
    const maxCardsMin = this.options.main.newCardsPerDay + SettingsConst.differenceBetweenNewAndMax;
    const maxCardsValue = (this.options.main.maxCardsPerDay < maxCardsMin)
      ? maxCardsMin
      : this.options.main.maxCardsPerDay;
    const maxCardsPerDay = Settings.createNumberTabElement('maxMainCardsPerDay', settingsText.tabs.mainGame.maxCardsPerDay, maxCardsValue, false, undefined, ['min', maxCardsMin]);
    const TranslateWord = Settings.createCheckboxTabElement('isMainShowTranslateWord', settingsText.tabs.mainGame.showTranslateWord, this.options.main.showTranslateWord, Settings.checkboxMainControllerHandler);
    const WordMeaning = Settings.createCheckboxTabElement('isMainShowWordMeaning', settingsText.tabs.mainGame.showWordMeaning, this.options.main.showWordMeaning, Settings.checkboxMainControllerHandler);
    const WordExample = Settings.createCheckboxTabElement('isMainShowWordExample', settingsText.tabs.mainGame.showWordExample, this.options.main.showWordExample, Settings.checkboxMainControllerHandler);
    const Transcription = Settings.createCheckboxTabElement('isMainShowTranscription', settingsText.tabs.mainGame.showTranscription, this.options.main.showTranscription, Settings.checkboxMainControllerHandler);
    const ImageAssociations = Settings.createCheckboxTabElement('isMainShowImageAssociations', settingsText.tabs.mainGame.showImageAssociations, this.options.main.showImageAssociations, Settings.checkboxMainControllerHandler);
    Settings.checkboxMainController(
      TranslateWord,
      WordMeaning,
      WordExample,
      Transcription,
      ImageAssociations,
    );

    const ButtonShowAnswer = Settings.createCheckboxTabElement('isMainShowButtonShowAnswer', settingsText.tabs.mainGame.showButtonShowAnswer, this.options.main.showButtonShowAnswer);
    const ButtonDelete = Settings.createCheckboxTabElement('isMainShowButtonDelete', settingsText.tabs.mainGame.showButtonShowDelete, this.options.main.showButtonDelete);
    const ButtonHard = Settings.createCheckboxTabElement('isMainShowButtonHard', settingsText.tabs.mainGame.showButtonShowHard, this.options.main.showButtonHard);
    const ButtonsEasyDifficult = Settings.createCheckboxTabElement('isMainShowButtons', settingsText.tabs.mainGame.showButtons, this.options.main.showButtons, (event) => {
      const easyEl = document.querySelector('.settings-form__input[name=mainIntervalEasy]');
      const normalEl = document.querySelector('.settings-form__input[name=mainIntervalNormal]');
      const difficultEl = document.querySelector('.settings-form__input[name=mainIntervalDifficult]');
      easyEl.disabled = !event.target.checked;
      normalEl.disabled = !event.target.checked;
      difficultEl.disabled = !event.target.checked;
    });
    const intervalEasy = Settings.createNumberTabElement('mainIntervalEasy', settingsText.tabs.mainGame.mainIntervalEasy, this.options.main.intervalEasy, !this.options.main.showButtons, Settings.intervalLimitsHandler, ['min', this.options.main.intervalNormal + SettingsConst.minStepBetweenEasyAndNormal]);
    const intervalNormal = Settings.createNumberTabElement('mainIntervalNormal', settingsText.tabs.mainGame.mainIntervalNormal, this.options.main.intervalNormal, !this.options.main.showButtons, Settings.intervalLimitsHandler, ['min', this.options.main.intervalDifficult + SettingsConst.minStepBetweenNormalAndDifficult]);
    const intervalDifficult = Settings.createNumberTabElement('mainIntervalDifficult', settingsText.tabs.mainGame.mainIntervalDifficult, this.options.main.intervalDifficult, !this.options.main.showButtons, Settings.intervalLimitsHandler);

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
    const AudioExample = Settings.createCheckboxTabElement('isDictionaryShowAudioExample', settingsText.tabs.dictionary.audioExample, this.options.dictionary.showAudioExample);
    const TranslateWord = Settings.createCheckboxTabElement('isDictionaryShowTranslateWord', settingsText.tabs.dictionary.translateWord, this.options.dictionary.showTranslateWord);
    const WordMeaning = Settings.createCheckboxTabElement('isDictionaryShowWordMeaning', settingsText.tabs.dictionary.wordMeaning, this.options.dictionary.showWordMeaning);
    const WordExample = Settings.createCheckboxTabElement('isDictionaryShowWordExample', settingsText.tabs.dictionary.wordExample, this.options.dictionary.showWordExample);
    const Transcription = Settings.createCheckboxTabElement('isDictionaryShowTranscription', settingsText.tabs.dictionary.transcription, this.options.dictionary.showTranscription);
    const ImageAssociations = Settings.createCheckboxTabElement('isDictionaryShowImageAssociations', settingsText.tabs.dictionary.imageAssociations, this.options.dictionary.showImageAssociations);

    const div = create('div', 'settings-tabs__item', [AudioExample, TranslateWord, WordMeaning, WordExample, Transcription, ImageAssociations], undefined, ['tabId', 2]);

    return div;
  }

  renderFindAPairTab() {
    const delayBeforeClosing = Settings.createNumberTabElement('delayBeforeClosingCard', settingsText.tabs.findapair.delayBeforeClosingCard, (this.options.findapair.delayBeforeClosingCard / SettingsConst.convertToMilliseconds), false, undefined, ['min', 0.5], ['max', 5], ['step', 0.1]);
    const cardTextOnStart = Settings.createCheckboxTabElement('showCardsTextOnStart', settingsText.tabs.findapair.showCardsTextOnStart, this.options.findapair.showCardsTextOnStart, (event) => {
      const elem = document.querySelector('.settings-form__input[name=showingCardsTime]');
      elem.disabled = !event.target.checked;
    });
    const showingCardsTime = Settings.createNumberTabElement('showingCardsTime', settingsText.tabs.findapair.showingCardsTime, (this.options.findapair.showingCardsTime / SettingsConst.convertToMilliseconds), !this.options.findapair.showCardsTextOnStart, undefined, ['min', 1], ['max', 59]);

    const div = create('div', 'settings-tabs__item', [delayBeforeClosing, cardTextOnStart, showingCardsTime], undefined, ['tabId', 3]);

    return div;
  }

  static createCheckboxTabElement(name, label, checked, clickHandler) {
    const InputElement = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', name]);
    InputElement.checked = checked;
    if (clickHandler) {
      InputElement.addEventListener('click', clickHandler);
    }
    const LabelElement = create('label', 'settings-form__label', [InputElement, ` ${label}`]);

    return LabelElement;
  }

  static createNumberTabElement(name, label, value, disabled = false, clickHandler, ...attributes) {
    const InputElement = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', name], ['value', value], ...attributes);
    InputElement.disabled = disabled;
    if (clickHandler) {
      InputElement.addEventListener('click', clickHandler);
    }
    const LabelElement = create('label', 'settings-form__label', [`${label}: `, InputElement]);

    return LabelElement;
  }

  openSettingsWindow() {
    this.modalWindow.openModal();
  }

  closeSettingsWindow() {
    this.modalWindow.closeModal();
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
    this.options = Settings.defaultSettingsOptions();
    if (res) this.options = res.optional;
    else {
      this.options = Settings.defaultSettingsOptions();
      await this.saveSettings();
    }
  }

  static defaultSettingsOptions() {
    const options = {
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

    return options;
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

    if (normalNum <= difficultNum + SettingsConst.minStepBetweenNormalAndDifficult) {
      normalNum = difficultNum + SettingsConst.minStepBetweenNormalAndDifficult;
      normalEl.value = normalNum;
    }
    if (easyNum <= normalNum + SettingsConst.minStepBetweenEasyAndNormal) {
      easyEl.value = normalNum + SettingsConst.minStepBetweenEasyAndNormal;
    }

    normalEl.setAttribute('min', difficultNum + SettingsConst.minStepBetweenNormalAndDifficult);
    easyEl.setAttribute('min', normalNum + SettingsConst.minStepBetweenEasyAndNormal);
  }

  static checkboxMainController(...args) {
    let showTranslateWord;
    let showWordMeaning;
    let showWordExample;
    let showTranscription;
    let showImageAssociations;
    if (!args.length) {
      const form = document.querySelector('#settings-form');
      showTranslateWord = form.querySelector('.settings-form__input[name=isMainShowTranslateWord]');
      showWordMeaning = form.querySelector('.settings-form__input[name=isMainShowWordMeaning]');
      showWordExample = form.querySelector('.settings-form__input[name=isMainShowWordExample]');
      showTranscription = form.querySelector('.settings-form__input[name=isMainShowTranscription]');
      showImageAssociations = form.querySelector('.settings-form__input[name=isMainShowImageAssociations]');
    } else {
      [
        showTranslateWord,
        showWordMeaning,
        showWordExample,
        showTranscription,
        showImageAssociations,
      ] = args;
      showTranslateWord = showTranslateWord.querySelector('.settings-form__input[name=isMainShowTranslateWord]');
      showWordMeaning = showWordMeaning.querySelector('.settings-form__input[name=isMainShowWordMeaning]');
      showWordExample = showWordExample.querySelector('.settings-form__input[name=isMainShowWordExample]');
      showTranscription = showTranscription.querySelector('.settings-form__input[name=isMainShowTranscription]');
      showImageAssociations = showImageAssociations.querySelector('.settings-form__input[name=isMainShowImageAssociations]');
    }

    if (!showWordMeaning.checked && !showWordExample.checked
      && !showTranscription.checked && !showImageAssociations.checked) {
      showTranslateWord.checked = true;
      showTranslateWord.disabled = true;
    } else {
      showTranslateWord.disabled = false;
    }
  }

  static checkboxMainControllerHandler() {
    Settings.checkboxMainController();
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
        delayBeforeClosingCard: Number(form.querySelector('.settings-form__input[name=delayBeforeClosingCard]').value) * SettingsConst.convertToMilliseconds,
        showCardsTextOnStart: form.querySelector('.settings-form__input[name=showCardsTextOnStart]').checked,
        showingCardsTime: Number(form.querySelector('.settings-form__input[name=showingCardsTime]').value) * SettingsConst.convertToMilliseconds,
      },
    };
    await this.saveSettings();
    this.closeSettingsWindow();
  }

  static openTabsHandler(event) {
    const TAB_ELEMENT = 'LI';
    if (event.target.tagName === TAB_ELEMENT) {
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
