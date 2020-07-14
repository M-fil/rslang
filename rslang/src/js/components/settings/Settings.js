import create from '../../utils/сreate';
import {
  settingsConstants,
} from '../../constants/constants';
import {
  saveUserData,
  setUserSettings,
  getUserSettings,
} from '../../service/service';
import {
  checkPassword,
  checkEmail,
} from '../../utils/validators';
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

    this.modalWindow = new ModalWindow('settings__modal', 'settings_modal', settingsConstants.title);
    this.preloader = new Preloader();
  }

  async init() {
    if (!this.initialized) {
      this.initialized = true;
      await this.loadSettings();

      this.renderSettingsWindow();

      this.modalWindow.addCallbackFnOnClose((this.renderSettingsWindow).bind(this));
      this.preloader.render();
    }
  }

  renderSettingsWindow() {
    this.modalWindow.content.innerHTML = '';
    const tabsList = Settings.renderTabList();

    this.resultTextElement = create('span', 'settings-results');

    const formProfile = Settings.createFormElement('settings-form', 'profile-form', [Settings.renderProfileEditTab()]);
    formProfile.addEventListener('submit', (this.formProfileSubmitHandler).bind(this));

    const formSettings = Settings.createFormElement('settings-form form-hidden', 'settings-form', [
      this.renderMainTab(),
      this.renderDictionaryTab(),
      this.renderFindAPairTab(),
    ]);
    formSettings.addEventListener('submit', (this.formSettingsSubmitHandler).bind(this));

    const div = create('div', 'settings', [
      this.resultTextElement,
      tabsList,
      formProfile,
      formSettings,
    ]);

    this.modalWindow.setContent(div, true);
  }

  static renderTabList() {
    const tabProfile = create('li', 'settings-tabs-list__item settings-tabs-list__item_active', settingsConstants.tabList.profile, undefined, ['tabId', 1], ['title', settingsConstants.tabList.profile]);
    const tabMain = create('li', 'settings-tabs-list__item', settingsConstants.tabList.mainGame, undefined, ['tabId', 2], ['title', settingsConstants.tabList.mainGame]);
    const tabDictionary = create('li', 'settings-tabs-list__item', settingsConstants.tabList.dictionary, undefined, ['tabId', 3], ['title', settingsConstants.tabList.dictionary]);
    const tabFindAPair = create('li', 'settings-tabs-list__item', settingsConstants.tabList.findapair, undefined, ['tabId', 4], ['title', settingsConstants.tabList.findapair]);
    const ul = create('ul', 'settings-tabs-list', [tabProfile, tabMain, tabDictionary, tabFindAPair]);

    ul.addEventListener('click', Settings.openTabsHandler);

    return ul;
  }

  static renderProfileEditTab() {
    const nameEl = Settings.createInputTabElement('text', 'userNewName', settingsConstants.tabs.profile.userName, '', false, undefined, ['autocomplete', 'off']);
    const emailEL = Settings.createInputTabElement('email', 'userNewEmail', settingsConstants.tabs.profile.userEmail, '', false, undefined, ['autocomplete', 'off']);
    const passwordEL = Settings.createInputTabElement('password', 'userNewPassword', settingsConstants.tabs.profile.userPassword, '', true, undefined, ['autocomplete', 'off']);

    const div = create('div', 'settings-tabs__item settings-tabs__item_active', [nameEl, emailEL, passwordEL], undefined, ['tabId', 1]);

    return div;
  }

  renderMainTab() {
    const newCardsPerDay = Settings.createNumberTabElement('newMainCardsPerDay', settingsConstants.tabs.mainGame.newCardsPerDay, this.options.main.newCardsPerDay, false, (event) => {
      const maxCardsEl = document.querySelector('.settings-form__input[name=maxMainCardsPerDay]');
      const newCards = Number(event.target.value);
      const maxCardsMin = newCards + SettingsConst.differenceBetweenNewAndMax;
      maxCardsEl.setAttribute('min', maxCardsMin);
      if (Number(maxCardsEl.value) < (maxCardsMin)) maxCardsEl.value = maxCardsMin;
    }, ['min', settingsConstants.minValues.newCardsPerDay]);
    const maxCardsMin = this.options.main.newCardsPerDay + SettingsConst.differenceBetweenNewAndMax;
    const maxCardsValue = (this.options.main.maxCardsPerDay < maxCardsMin)
      ? maxCardsMin
      : this.options.main.maxCardsPerDay;
    const maxCardsPerDay = Settings.createNumberTabElement('maxMainCardsPerDay', settingsConstants.tabs.mainGame.maxCardsPerDay, maxCardsValue, false, undefined, ['min', maxCardsMin]);
    const TranslateWord = Settings.createCheckboxTabElement('isMainShowTranslateWord', settingsConstants.tabs.mainGame.showTranslateWord, this.options.main.showTranslateWord, Settings.checkboxMainControllerHandler);
    const WordMeaning = Settings.createCheckboxTabElement('isMainShowWordMeaning', settingsConstants.tabs.mainGame.showWordMeaning, this.options.main.showWordMeaning, Settings.checkboxMainControllerHandler);
    const WordExample = Settings.createCheckboxTabElement('isMainShowWordExample', settingsConstants.tabs.mainGame.showWordExample, this.options.main.showWordExample, Settings.checkboxMainControllerHandler);
    const Transcription = Settings.createCheckboxTabElement('isMainShowTranscription', settingsConstants.tabs.mainGame.showTranscription, this.options.main.showTranscription, Settings.checkboxMainControllerHandler);
    const ImageAssociations = Settings.createCheckboxTabElement('isMainShowImageAssociations', settingsConstants.tabs.mainGame.showImageAssociations, this.options.main.showImageAssociations, Settings.checkboxMainControllerHandler);
    Settings.checkboxMainController(
      TranslateWord,
      WordMeaning,
      WordExample,
      Transcription,
      ImageAssociations,
    );

    const ButtonShowAnswer = Settings.createCheckboxTabElement('isMainShowButtonShowAnswer', settingsConstants.tabs.mainGame.showButtonShowAnswer, this.options.main.showButtonShowAnswer);
    const ButtonDelete = Settings.createCheckboxTabElement('isMainShowButtonDelete', settingsConstants.tabs.mainGame.showButtonShowDelete, this.options.main.showButtonDelete);
    const ButtonHard = Settings.createCheckboxTabElement('isMainShowButtonHard', settingsConstants.tabs.mainGame.showButtonShowHard, this.options.main.showButtonHard);
    const ButtonsEasyDifficult = Settings.createCheckboxTabElement('isMainShowButtons', settingsConstants.tabs.mainGame.showButtons, this.options.main.showButtons, (event) => {
      const easyEl = document.querySelector('.settings-form__input[name=mainIntervalEasy]');
      const normalEl = document.querySelector('.settings-form__input[name=mainIntervalNormal]');
      const difficultEl = document.querySelector('.settings-form__input[name=mainIntervalDifficult]');
      easyEl.disabled = !event.target.checked;
      normalEl.disabled = !event.target.checked;
      difficultEl.disabled = !event.target.checked;
    });
    const intervalEasy = Settings.createNumberTabElement('mainIntervalEasy', settingsConstants.tabs.mainGame.mainIntervalEasy, this.options.main.intervalEasy, !this.options.main.showButtons, Settings.intervalLimitsHandler, ['min', this.options.main.intervalNormal + SettingsConst.minStepBetweenEasyAndNormal]);
    const intervalNormal = Settings.createNumberTabElement('mainIntervalNormal', settingsConstants.tabs.mainGame.mainIntervalNormal, this.options.main.intervalNormal, !this.options.main.showButtons, Settings.intervalLimitsHandler, ['min', this.options.main.intervalDifficult + SettingsConst.minStepBetweenNormalAndDifficult]);
    const intervalDifficult = Settings.createNumberTabElement('mainIntervalDifficult', settingsConstants.tabs.mainGame.mainIntervalDifficult, this.options.main.intervalDifficult, !this.options.main.showButtons, Settings.intervalLimitsHandler, ['min', settingsConstants.minValues.intervalDifficult]);

    const div = create('div', 'settings-tabs__item', [
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
    ], undefined, ['tabId', 2]);

    return div;
  }

  renderDictionaryTab() {
    const AudioExample = Settings.createCheckboxTabElement('isDictionaryShowAudioExample', settingsConstants.tabs.dictionary.audioExample, this.options.dictionary.showAudioExample);
    const TranslateWord = Settings.createCheckboxTabElement('isDictionaryShowTranslateWord', settingsConstants.tabs.dictionary.translateWord, this.options.dictionary.showTranslateWord);
    const WordMeaning = Settings.createCheckboxTabElement('isDictionaryShowWordMeaning', settingsConstants.tabs.dictionary.wordMeaning, this.options.dictionary.showWordMeaning);
    const WordExample = Settings.createCheckboxTabElement('isDictionaryShowWordExample', settingsConstants.tabs.dictionary.wordExample, this.options.dictionary.showWordExample);
    const Transcription = Settings.createCheckboxTabElement('isDictionaryShowTranscription', settingsConstants.tabs.dictionary.transcription, this.options.dictionary.showTranscription);
    const ImageAssociations = Settings.createCheckboxTabElement('isDictionaryShowImageAssociations', settingsConstants.tabs.dictionary.imageAssociations, this.options.dictionary.showImageAssociations);

    const div = create('div', 'settings-tabs__item', [AudioExample, TranslateWord, WordMeaning, WordExample, Transcription, ImageAssociations], undefined, ['tabId', 3]);

    return div;
  }

  renderFindAPairTab() {
    const delayBeforeClosing = Settings.createNumberTabElement('delayBeforeClosingCard', settingsConstants.tabs.findapair.delayBeforeClosingCard, (this.options.findapair.delayBeforeClosingCard / SettingsConst.convertToMilliseconds), false, undefined, ['min', 0.5], ['max', 5], ['step', 0.1]);
    const cardTextOnStart = Settings.createCheckboxTabElement('showCardsTextOnStart', settingsConstants.tabs.findapair.showCardsTextOnStart, this.options.findapair.showCardsTextOnStart, (event) => {
      const elem = document.querySelector('.settings-form__input[name=showingCardsTime]');
      elem.disabled = !event.target.checked;
    });
    const showingCardsTime = Settings.createNumberTabElement('showingCardsTime', settingsConstants.tabs.findapair.showingCardsTime, (this.options.findapair.showingCardsTime / SettingsConst.convertToMilliseconds), !this.options.findapair.showCardsTextOnStart, undefined, ['min', 1], ['max', 59]);

    const div = create('div', 'settings-tabs__item', [delayBeforeClosing, cardTextOnStart, showingCardsTime], undefined, ['tabId', 4]);

    return div;
  }

  static createCheckboxTabElement(name, label, checked, clickHandler) {
    const InputElement = create('input', 'settings-form__input', undefined, undefined, ['type', 'checkbox'], ['name', name]);
    InputElement.checked = checked;
    if (clickHandler) {
      InputElement.addEventListener('click', clickHandler);
    }
    const LabelText = create('span', 'settings-form__text', `${label}: `);
    const LabelElement = create('label', 'settings-form__label', [LabelText, InputElement]);

    return LabelElement;
  }

  static createNumberTabElement(name, label, value, disabled = false, clickHandler, ...attributes) {
    const InputElement = create('input', 'settings-form__input', undefined, undefined, ['type', 'number'], ['name', name], ['value', value], ...attributes);
    InputElement.disabled = disabled;
    if (clickHandler) {
      InputElement.addEventListener('click', clickHandler);
    }
    const LabelText = create('span', 'settings-form__text', `${label}: `);
    const LabelElement = create('label', 'settings-form__label', [LabelText, InputElement]);

    return LabelElement;
  }

  static createInputTabElement(
    type, name, label, value, required = false, clickHandler, ...attributes
  ) {
    const InputElement = create('input', 'settings-form__input', undefined, undefined, ['type', type], ['name', name], ...attributes);
    InputElement.required = required;
    if (clickHandler) {
      InputElement.addEventListener('click', clickHandler);
    }
    const LabelText = create('span', 'settings-form__text', `${label}: `);
    const LabelElement = create('label', 'settings-form__label', [LabelText, InputElement]);

    return LabelElement;
  }

  static createFormElement(classes, id, innerElements) {
    const submitButton = create('input', 'settings-form__submit', undefined, undefined, ['type', 'submit'], ['value', settingsConstants.form.submitButton]);

    const form = create('form', classes, [
      ...innerElements,
      submitButton,
    ], undefined, ['id', id]);

    return form;
  }

  openSettingsWindow() {
    this.clearResultsElement();
    this.modalWindow.openModal();
  }

  closeSettingsWindow() {
    this.modalWindow.closeModal();
    this.clearResultsElement();
    this.renderSettingsWindow();
  }

  clearResultsElement() {
    this.resultTextElement.classList.remove('settings-results_correct');
    this.resultTextElement.classList.remove('settings-results_wrong');
    this.resultTextElement.innerHTML = '';
  }

  addCorrectResultText(text) {
    this.clearResultsElement();
    this.resultTextElement.classList.add('settings-results_correct');
    this.resultTextElement.innerText = text;
  }

  addWrongResultText(text) {
    this.clearResultsElement();
    this.resultTextElement.classList.add('settings-results_wrong');
    this.resultTextElement.innerText = text;
  }

  async saveSettings() {
    const body = {
      wordsPerDay: this.options.main.maxCardsPerDay,
      optional: this.options,
    };

    const res = await setUserSettings(this.user.userId, this.user.token, body);
    return res;
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

  formProfileSubmitHandler(event) {
    event.preventDefault();
    this.clearResultsElement();
    const FORM = document.querySelector('#profile-form');
    this.saveProfileFormData(FORM);
    return false;
  }

  async saveProfileFormData(form) {
    this.preloader.show();
    const newUserName = form.querySelector('.settings-form__input[name=userNewName]').value || '';
    const newUserEmail = form.querySelector('.settings-form__input[name=userNewEmail]').value || '';
    const newUserPassword = form.querySelector('.settings-form__input[name=userNewPassword]').value || '';

    if (newUserName || newUserEmail || newUserPassword) {
      const body = {};
      let errors = false;

      if (newUserName) {
        body.name = newUserName;
      }

      if (newUserEmail) {
        if (checkEmail(newUserEmail)) {
          body.email = newUserEmail;
        } else {
          if (!errors) {
            this.addWrongResultText(settingsConstants.results.wrongEmail);
          }
          this.preloader.hide();
          errors = true;
        }
      }

      if (newUserPassword) {
        if (checkPassword(newUserPassword)) {
          body.password = newUserPassword;
        } else {
          if (!errors) {
            this.addWrongResultText(settingsConstants.results.wrongPassword);
          }
          this.preloader.hide();
          errors = true;
        }
      }

      if (body && !errors) {
        const res = await saveUserData(this.user.userId, this.user.token, body);

        if (res) {
          this.addCorrectResultText(settingsConstants.results.dataSaved);
          if (this.userChangesListenerFn) {
            body.password = undefined;
            this.userChangesListenerFn(body);
          }
        } else {
          this.addWrongResultText(settingsConstants.results.dataNotSaved);
        }
      }
    }

    this.preloader.hide();
  }

  formSettingsSubmitHandler(event) {
    event.preventDefault();
    this.clearResultsElement();
    const FORM = document.querySelector('#settings-form');
    this.saveSettingsFormData(FORM);
    return false;
  }

  async saveSettingsFormData(form) {
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
    const res = await this.saveSettings();

    if (res) {
      this.addCorrectResultText(settingsConstants.results.dataSaved);
    } else {
      this.addWrongResultText(settingsConstants.results.dataNotSaved);
    }

    this.preloader.hide();
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
      let parentElement;
      tabs.forEach((el) => {
        el.classList.remove('settings-tabs__item_active');
        el.parentElement.classList.add('form-hidden');
        if (el.dataset.tabId === id) {
          el.classList.add('settings-tabs__item_active');
          parentElement = el.parentElement;
        }
      });
      parentElement.classList.remove('form-hidden');
    }
  }

  setUserChangesListener(listenerFn) {
    if (typeof listenerFn === 'function') {
      this.userChangesListenerFn = listenerFn;
    }
  }
}
