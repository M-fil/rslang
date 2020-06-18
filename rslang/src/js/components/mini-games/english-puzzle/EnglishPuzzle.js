import createStartWindow from './components/start-menu';
import createWorkBlock from './components/main-block';
import createResultBlock from './components/result-block';
import create from '../../../utils/сreate';
import {
  hidingElement,
  showingElement,
  cleanParentNode,
} from './components/dom-actions';
import getWords from '../../../service/service';
import {
  GAME_BLOCK,
  RESULT_FORM,
} from '../../../constants/constatntsForEP';
import createCanvasElements from './components/game-field';

export default class EnglishPuzzle {
  constructor() {
    this.startMenu = createStartWindow();
    this.gameForm = createWorkBlock();
    this.resultForm = createResultBlock();
    this.sinth = window.speechSynthesis;
    /* this.actualSentenses = null;
    this.actualTranslate = null;
    this.actualCards = null;
    this.activeSentenseCounter = 0;
    this.rightAnswers = [];
    this.falseAnswers = []; */
    this.dropped = null;
    this.activeSentenseForCheck = null;
  }

  start() {
    [this.body] = document.getElementsByTagName('body');
    this.wrapper = create('div', 'wrapper', [this.startMenu, this.gameForm, this.resultForm]);
    this.body.appendChild(this.wrapper);

    this.startMenuButtonAction();
    this.actionsOnSupportButtons();
    this.controlButtonsAction();
  }

  async getGameCards() {
    const level = document.querySelector('.level').value - 1;
    const page = document.querySelector('.page').value - 1;
    const words = await getWords(page, level);

    this.actualSentenses = [];
    this.actualTranslate = [];
    this.rightAnswers = [];
    this.falseAnswers = [];
    this.activeSentenseCounter = 0;

    document.querySelectorAll('.puzzle-row').forEach((el) => cleanParentNode(el));

    for (let i = 0; i < GAME_BLOCK.gameZoneRows; i += 1) {
      this.actualSentenses.push(words[i].textExample);
      this.actualTranslate.push(words[i].textExampleTranslate);
    }

    this.actualCards = await createCanvasElements({
      src: 'https://raw.githubusercontent.com/Shnyrkevich/rslang_data_paintings/master/level1/9th_wave.jpg',
      wordsList: this.actualSentenses,
      fontFamily: 'Arial',
      fontRatio: 0.7,
      fontType: 'bold',
      borderPuzzle: 1,
      shadowPuzzle: 2,
      borderText: 1,
      shadowText: 10,
      colorBorder: 'rgb(255,255,250)',
      colorShadowText: 'black',
      solidTextColor: 'white',
      fontStyle: 'fillText',
    });
  }

  async switchGamePageOrLvl() {
    if (this.activeSentenseCounter + 1 < GAME_BLOCK.gameZoneRows) {
      this.activeSentenseCounter += 1;
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      if (document.querySelector('.sound-button').classList.contains('active-sintez')) {
        this.speachActiveSentens(this.actualSentenses[this.activeSentenseCounter]);
      }
      hidingElement(document.querySelector('.continue-button'));
      showingElement(document.querySelector('.check-button'), document.querySelector('.show-result-button'));
    } else if (this.activeSentenseCounter + 1 === GAME_BLOCK.gameZoneRows) {
      if (this.rightAnswers.length === GAME_BLOCK.gameZoneRows) {
        const page = document.querySelector('.page');
        page.value = Number(page.value) + 1;
        await this.getGameCards();
        // Можно сделать отдельную функцию
        this.gameStart();
        this.showTranslate();
        this.dragAndDropActions();
        showingElement(document.querySelector('.check-button'), document.querySelector('.show-result-button'));
        hidingElement(document.querySelector('.continue-button'), document.querySelector('.result-button'));
      } else {
        hidingElement(document.querySelector('.continue-button'));
        showingElement(document.querySelector('.repeat-button'), document.querySelector('.result-button'));
      }
    }
  }

  checkSentenceAndLvlComplite() {
    const cardsWithAnswers = document.querySelectorAll('.active-card');
    let mistakeCounter = 0;

    for (let i = 0; i < cardsWithAnswers.length; i += 1) {
      cardsWithAnswers[i].classList.remove('correct-card');
      cardsWithAnswers[i].classList.remove('incorrect-card');
      if (cardsWithAnswers[i].getAttribute('data-word') === this.activeSentenseForCheck[i].getAttribute('data-word')) {
        cardsWithAnswers[i].classList.add('correct-card');
      } else {
        cardsWithAnswers[i].classList.add('incorrect-card');
        mistakeCounter += 1;
      }
    }

    if (mistakeCounter === 0) {
      this.rightAnswers.push(this.actualSentenses[this.activeSentenseCounter]);
      cardsWithAnswers.forEach((el) => {
        const elem = el;
        elem.classList.remove('active-card');
        elem.draggable = 'false';
        this.dropped = null;
      });
      if (this.rightAnswers.length === GAME_BLOCK.gameZoneRows) {
        showingElement(document.querySelector('.result-button'));
      }
      hidingElement(document.querySelector('.check-button'));
      showingElement(document.querySelector('.continue-button'));
    } else {
      showingElement(document.querySelector('.show-result-button'));
    }
  }

  showTranslate() {
    const translateSentense = document.querySelector('.translate-sentense');
    translateSentense.textContent = '';

    if (translateSentense.classList.contains('active-translate')) {
      translateSentense.textContent = this.actualTranslate[this.activeSentenseCounter];
    }
  }

  showCorrectSentens() {
    const sentensBase = document.querySelector('.game-block_field--description');
    const gameFieldRow = document.querySelectorAll('.puzzle-row')[this.activeSentenseCounter];

    cleanParentNode(sentensBase);
    cleanParentNode(gameFieldRow);

    this.falseAnswers.push(this.actualSentenses[this.activeSentenseCounter]);
    this.activeSentenseForCheck.forEach((el) => {
      const elem = el;
      elem.classList.remove('active-card');
      elem.draggable = 'false';
      gameFieldRow.appendChild(elem);
    });
  }

  static createCorrectSentence(sent) {
    return sent.split(' ').map((el) => {
      let elem = el;
      if (/<[^>]*>/g.test(el)) {
        elem = el.replace(/<[^>]*>/g, '');
      }
      return elem;
    }).join(' ');
  }

  speachActiveSentens(words) {
    const sentense = EnglishPuzzle.createCorrectSentence(words);
    const message = new SpeechSynthesisUtterance(sentense);
    const voices = this.sinth.getVoices().filter((el) => el.lang === GAME_BLOCK.langEn)[1];
    message.voice = voices;
    this.sinth.speak(message);
  }

  gameStart() {
    const cards = Array.from(this.actualCards[this.activeSentenseCounter].childNodes);
    this.activeSentenseForCheck = cards.slice();
    cards.sort(() => Math.random() - 0.5);
    const cardsContainer = document.querySelector('.game-block_field--description');
    cleanParentNode(cardsContainer);
    cards.forEach((el) => {
      cardsContainer.appendChild(el);
      el.classList.add('active-card');
    });
  }

  static checkFieldCompletion() {
    const sentensBase = document.querySelector('.game-block_field--description');
    if (!sentensBase.hasChildNodes()) {
      hidingElement(document.querySelector('.show-result-button'));
    }
  }

  // RESULT

  resultCollection() {
    const resultStatistic = document.querySelector('.result-block_statistic');
    cleanParentNode(resultStatistic);
    for (let i = 0; i < RESULT_FORM.statusTitle.length; i += 1) {
      const blockTitle = create('p', 'result-block_statistic--title', '', resultStatistic);
      blockTitle.textContent = RESULT_FORM.statusTitle[i];
      switch (i) {
        case 0:
          create('div', 'know-sentence-block', EnglishPuzzle.createResultRow(this.rightAnswers), resultStatistic);
          break;
        default:
          create('div', 'know-sentence-block', EnglishPuzzle.createResultRow(this.falseAnswers), resultStatistic);
          break;
      }
    }
  }

  static createResultRow(mas) {
    const sentenses = mas.map((el) => {
      const dinamic = create('div', 'result-row_sound');
      const text = create('p', 'result-row_text');
      text.textContent = EnglishPuzzle.createCorrectSentence(el);
      return create('div', 'result-row', [dinamic, text]);
    });
    return sentenses;
  }

  startMenuButtonAction() {
    document.querySelector('.information-button').addEventListener('click', async () => {
      await this.getGameCards();
      // Три метода в один левый
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      hidingElement(this.startMenu);
      showingElement(this.gameForm);
    });
  }

  dragAndDropActions() {
    const activeRow = document.querySelectorAll('.puzzle-row')[this.activeSentenseCounter];

    function dragOver(ev) {
      ev.preventDefault();
    }

    function dragEnter(ev) {
      ev.preventDefault();
      this.classList.add('row-hover');
    }

    function dragLeave() {
      this.classList.remove('row-hover');
    }

    document.querySelectorAll('.active-card').forEach((el) => {
      el.addEventListener('dragstart', (event) => {
        if (!event.target.data) {
          this.dropped = event.target;
        }
      });
      el.addEventListener('click', (event) => {
        if (!event.target.data) {
          this.dropped = event.target;
        }
        activeRow.appendChild(this.dropped);
        EnglishPuzzle.checkFieldCompletion();
      });
    });

    activeRow.addEventListener('drop', (event) => {
      event.preventDefault();
      activeRow.appendChild(this.dropped);
      EnglishPuzzle.checkFieldCompletion();
      event.target.classList.remove('row-hover');
    });
    activeRow.addEventListener('dragover', dragOver);
    activeRow.addEventListener('dragenter', dragEnter);
    activeRow.addEventListener('dragleave', dragLeave);

    document.querySelector('.game-block_field--description').addEventListener('drop', (event) => {
      event.preventDefault();
      document.querySelector('.game-block_field--description').appendChild(this.dropped);
      event.target.classList.remove('row-hover');
    });

    document.querySelector('.game-block_field--description').addEventListener('dragover', dragOver);
    document.querySelector('.game-block_field--description').addEventListener('dragenter', dragEnter);
    document.querySelector('.game-block_field--description').addEventListener('dragleave', dragLeave);
  }

  actionsOnSupportButtons() {
    document.querySelector('.control-buttons_container').addEventListener('click', (event) => {
      if (event.target.classList.contains('help-button') && !event.target.classList.contains('button-logout')) {
        event.target.classList.toggle('active-button');
      }
    });

    document.querySelector('.button-logout').addEventListener('click', async () => {
      hidingElement(this.gameForm);
      showingElement(this.startMenu);
    });

    document.querySelector('.button-sintezise').addEventListener('click', () => {
      const status = JSON.parse(localStorage.userSettings);
      if (status.sound) {
        status.sound = false;
        this.sinth.cancel();
        document.querySelector('.sound-button').classList.remove('active-sintez');
      } else {
        status.sound = true;
        this.sinth.resume();
        document.querySelector('.sound-button').classList.add('active-sintez');
      }
      localStorage.userSettings = JSON.stringify(status);
    });

    document.querySelector('.button-trunslate').addEventListener('click', () => {
      const status = JSON.parse(localStorage.userSettings);
      if (status.translate) {
        status.translate = false;
        document.querySelector('.translate-sentense').classList.remove('active-translate');
      } else {
        status.translate = true;
        document.querySelector('.translate-sentense').classList.add('active-translate');
      }
      this.showTranslate();
      localStorage.userSettings = JSON.stringify(status);
    });

    document.querySelector('.sound-button').addEventListener('click', (event) => {
      if (event.target.classList.contains('active-sintez')) {
        this.speachActiveSentens(this.actualSentenses[this.activeSentenseCounter]);
      }
    });

    document.querySelector('.new_lvl-button').addEventListener('click', async () => {
      await this.getGameCards();
      // Три метода в один левый
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      hidingElement(document.querySelector('.result-button'), document.querySelector('.continue-button'), document.querySelector('.repeat-button'));
      showingElement(document.querySelector('.check-button'), document.querySelector('.show-result-button'));
    });
  }

  controlButtonsAction() {
    document.querySelector('.show-result-button').addEventListener('click', (event) => {
      this.showCorrectSentens();
      hidingElement(event.target, document.querySelector('.check-button'));
      showingElement(document.querySelector('.continue-button'));
    });

    document.querySelector('.check-button').addEventListener('click', () => {
      this.checkSentenceAndLvlComplite();
    });

    document.querySelector('.continue-button').addEventListener('click', async () => {
      await this.switchGamePageOrLvl();
    });

    document.querySelector('.result-button').addEventListener('click', () => {
      this.resultCollection();
      this.actionForResultSounds();
      hidingElement(this.gameForm);
      showingElement(this.resultForm);
    });

    document.querySelector('.repeat-button').addEventListener('click', async (event) => {
      await this.getGameCards();
      // Три метода в один левый
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      hidingElement(document.querySelector('.result-button'), event.target);
      showingElement(document.querySelector('.check-button'), document.querySelector('.show-result-button'));
    });

    document.querySelector('.result-button_continue').addEventListener('click', () => {
      hidingElement(this.resultForm);
      showingElement(this.gameForm);
    });
  }

  actionForResultSounds() {
    document.querySelectorAll('.result-row').forEach((el) => {
      const components = el.childNodes;
      components[0].addEventListener('click', () => this.speachActiveSentens(components[1].textContent));
    });
  }
}
