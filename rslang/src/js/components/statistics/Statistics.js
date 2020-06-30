import create from '../../utils/сreate';
import dateFormat from '../../utils/dateformat';
import {
  statisticsText,
} from '../../constants/constants';
import {
  updateUserStatistics,
  getUserStatistics,
} from '../../service/service';

export default class Statistics {
  constructor(userData) {
    if (Statistics.exists) {
      return Statistics.instance;
    }

    this.user = userData || false;

    Statistics.exists = true;
    Statistics.instance = this;
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      this.initialized = true;
      const date = new Date();
      this.currentdate = dateFormat(date.getDate(), date.getMonth() + 1, date.getFullYear());

      await this.loadStatistics();
    }
  }

  async loadStatistics() {
    const res = await getUserStatistics(this.user.userId, this.user.token);
    if (res) {
      this.statistics = {
        learnedWords: res.learnedWords,
        optional: res.optional || {},
      };
    } else {
      this.statistics = {
        learnedWords: 0,
        optional: {},
      };
    }
    console.log('>', this.statistics);
  }

  async saveStatistics() {
    await updateUserStatistics(this.user.userId, this.user.token, this.statistics);
  }

  async resetStatistics() {
    const body = {
      learnedWords: 0,
      optional: {},
    };
    await updateUserStatistics(this.user.userId, this.user.token, body);
  }

  getGameStatistics(group, requestedDate) {
    const date = requestedDate || this.currentdate;
    this.controlGroupInStatistics(group, date);

    return this.statistics.optional[date][group];
  }

  updateLearnedWords(wordsCount) {
    this.statistics.learnedWords += Number(wordsCount);

    if (Object.prototype.hasOwnProperty.call(this.statistics.optional[this.currentdate].maingame, 'learnedWords')) {
      this.statistics.optional[this.currentdate].maingame.learnedWords += wordsCount;
    } else {
      this.statistics.optional[this.currentdate].maingame.learnedWords = wordsCount;
    }
  }

  async saveGameStatistics(group, correct, wrong, learnedWords) {
    console.log(this.statistics);
    this.controlGroupInStatistics(group);

    this.statistics.optional[this.currentdate][group].playingCount += 1;
    this.statistics.optional[this.currentdate][group].correctAnswers += correct;
    this.statistics.optional[this.currentdate][group].wrongAnswers += wrong;

    if (learnedWords) {
      this.updateLearnedWords(learnedWords);
    }

    await this.saveStatistics();
  }

  static createStatisticObject() {
    const obj = {};

    return obj;
  }

  controlGroupInStatistics(group, requestedDate) {
    const date = requestedDate || this.currentdate;
    if (!Object.prototype.hasOwnProperty.call(this.statistics.optional, date)) {
      this.statistics.optional[this.currentdate] = {};
    }

    if (!Object.prototype.hasOwnProperty.call(this.statistics.optional[date], group)) {
      this.statistics.optional[this.currentdate][group] = Statistics.getDefaultStatisticObject();
    }
  }

  static getDefaultStatisticObject() {
    const obj = {
      playingCount: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    };

    return obj;
  }

  render() {
    this.container = create('div', 'statistics__container', [
      this.renderShortTerm(),
      this.renderLongTerm(),
    ]);

    create('div', 'statistics', [
      Statistics.renderNavigation(),
      this.container,
    ], document.body);
  }

  static renderNavigation() {
    const shortterm = create('li', 'statictics-tab-list__item statictics-tab-list_active', statisticsText.tabtitels.shortterm, undefined, ['tabId', 'shortterm']);
    const longterm = create('li', 'statictics-tab-list__item', statisticsText.tabtitels.longterm, undefined, ['tabId', 'longterm']);

    const ulNavigation = create('ul', 'statictics-tab-list', [shortterm, longterm]);
    ulNavigation.addEventListener('click', Statistics.changeTabHandler);

    const div = create('div', 'statistics__navigation', ulNavigation);

    return div;
  }

  renderShortTerm() {
    const gamesOptions = Statistics.getOptionsArrayForGames(statisticsText.gametitles);
    const gamesSelect = Statistics.createSelect('game_select', 'game_select', ...gamesOptions);
    gamesSelect.addEventListener('change', (this.selectOptionsHandler).bind(this));
    const games = create('label', 'statistics-selects__label', [`${statisticsText.select.game}: `, gamesSelect]);
    const datesOptions = Statistics.getOptionsArrayForDates(this.statistics.optional);
    const dateSelect = Statistics.createSelect('data_select', 'data_select', ...datesOptions);
    dateSelect.addEventListener('change', (this.selectOptionsHandler).bind(this));
    const dates = create('label', 'statistics-selects__label', [`${statisticsText.select.date}: `, dateSelect]);

    const selects = create('div', 'statistics-selects', [games, dates], document.body);

    const gamestat = create('div', 'statistics__game-statistic', this.selectOptionsController(gamesSelect, dateSelect), undefined, ['id', 'gamestatistics']);

    return create('div', 'statistics-tab__item statistics__short-term statistics-tab_active', [selects, gamestat], undefined, ['tabId', 'shortterm']);
  }

  renderLongTerm() {
    return create('div', 'statistics-tab__item statistics__long-term', undefined, undefined, ['tabId', 'longterm']);
  }

  static createSelect(name, id, ...options) {
    const select = create('select', 'statistics-selects__select', undefined, undefined, ['name', name], ['id', id]);
    options.forEach(([key, value], index) => {
      const el = create('option', 'statistics-selects__options', value, select, ['value', key]);
      if (index === 0) {
        el.selected = true;
      }
    });

    return select;
  }

  static getOptionsArrayForDates(obj) {
    const keysArr = Object.keys(obj);
    const options = [];
    keysArr.forEach((key) => {
      const keysOps = [key, key];
      options.push(keysOps);
    });

    return options.reverse();
  }

  static getOptionsArrayForGames(obj) {
    return Object.entries(obj);
  }

  selectOptionsHandler() {
    this.selectOptionsController();
  }

  selectOptionsController(...args) {
    let gameSelect;
    let dateSelect;
    if (!args.length) {
      gameSelect = document.querySelector('#game_select').value;
      dateSelect = document.querySelector('#data_select').value;
    } else {
      [
        gameSelect,
        dateSelect,
      ] = args;
      gameSelect = gameSelect.value;
      dateSelect = dateSelect.value;
    }

    return this.getShortGameStatistic(gameSelect, dateSelect);
  }

  getShortGameStatistic(game, date) {
    const gameStat = this.getGameStatistics(game, date);

    const {
      playingCount,
      correctAnswers,
      wrongAnswers,
      learnedWords,
    } = gameStat;
    const answers = correctAnswers + wrongAnswers;
    const correctPercents = Math.round((correctAnswers / answers) * 100);
    const wrongPercents = Math.round((wrongAnswers / answers) * 100);

    const pPlayingCount = create('p', '', `${statisticsText.texts.playingCount}: ${playingCount}`);
    const pCorrect = create('p', '', `${statisticsText.texts.correctAnswers}: ${correctAnswers} (${correctPercents || 0}%)`);
    const pWrong = create('p', '', `${statisticsText.texts.wrongAnswers}: ${wrongAnswers} (${wrongPercents || 0}%)`);
    let pLearnedWords;
    if (learnedWords) {
      pLearnedWords = create('p', '', `${statisticsText.texts.learnedWords}: ${learnedWords}`);
    }

    const gamestatistics = document.querySelector('#gamestatistics');
    if (gamestatistics) {
      gamestatistics.innerHTML = '';
      if (pLearnedWords) {
        gamestatistics.append(pLearnedWords);
      }
      gamestatistics.append(pPlayingCount, pCorrect, pWrong);
    }

    let elementsArr = [pPlayingCount, pCorrect, pWrong];
    if (pLearnedWords) {
      elementsArr = [pLearnedWords, ...elementsArr];
    }
    return elementsArr;
  }

  static changeTabHandler(event) {
    const TAB_EL = 'LI';
    if (event.target.tagName === TAB_EL) {
      const element = event.target;
      const id = element.dataset.tabId;
      const tabsList = document.querySelectorAll('.statictics-tab-list__item');
      tabsList.forEach((el) => el.classList.remove('statictics-tab-list_active'));
      element.classList.add('statictics-tab-list_active');

      const tabs = document.querySelectorAll('.statistics-tab__item');
      tabs.forEach((el) => {
        el.classList.remove('statistics-tab_active');
        if (el.dataset.tabId === id) {
          el.classList.add('statistics-tab_active');
        }
      });
    }
  }
}