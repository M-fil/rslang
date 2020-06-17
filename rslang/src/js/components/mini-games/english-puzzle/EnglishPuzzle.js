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
} from '../../../constants/constatntsForEP';
import createCanvasElements from './components/game-field';

export default class EnglishPuzzle {
  constructor() {
    this.startMenu = createStartWindow();
    this.gameForm = createWorkBlock();
    this.resultForm = createResultBlock();
    this.actualSentenses = null;
    this.actualTranslate = null;
    this.actualCards = null;
    this.activeSentenseCounter = 0;
    this.rightAnswers = [];
    this.falseAnswers = [];
    this.dropped = null;
  }

  start() {
    [this.body] = document.getElementsByTagName('body');
    this.wrapper = create('div', 'wrapper', [this.startMenu, this.gameForm, this.resultForm]);
    this.body.appendChild(this.wrapper);

    this.startMenuButtonAction();
  }

  async getGameCards() {
    const level = document.querySelector('.level').value - 1;
    const page = document.querySelector('.page').value - 1;
    const words = await getWords(page, level);
    this.actualSentenses = [];
    this.actualTranslate = [];
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

  gameStart() {
    let cards = this.actualCards[this.activeSentenseCounter].childNodes;
    cards = Array.prototype.slice.call(cards).sort(() => Math.random() - 0.5);
    const cardsContainer = document.querySelector('.game-block_field--description');
    cleanParentNode(cardsContainer);
    cards.forEach((el) => {
      cardsContainer.appendChild(el);
      el.classList.add('active-card');
    });
  }

  startMenuButtonAction() {
    document.querySelector('.information-button').addEventListener('click', async () => {
      await this.getGameCards();
      this.gameStart();
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
      });
    });

    activeRow.addEventListener('drop', (event) => {
      event.preventDefault();
      event.target.appendChild(this.dropped);
      // this.checkFieldCompletion();
      event.target.classList.remove('row-hover');
    });
    activeRow.addEventListener('dragover', dragOver);
    activeRow.addEventListener('dragenter', dragEnter);
    activeRow.addEventListener('dragleave', dragLeave);

    document.querySelector('.game-block_field--description').addEventListener('drop', (event) => {
      event.preventDefault();
      event.target.appendChild(this.dropped);
      event.target.classList.remove('row-hover');
    });

    document.querySelector('.game-block_field--description').addEventListener('dragover', dragOver);
    document.querySelector('.game-block_field--description').addEventListener('dragenter', dragEnter);
    document.querySelector('.game-block_field--description').addEventListener('dragleave', dragLeave);
  }
}
