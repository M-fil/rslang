import MainBlock from './components/main-block';
import createResultBlock from './components/result-block';
import create from '../../../utils/сreate';
import {
  viewElement,
  cleanParentNode,
} from './components/dom-actions';
import {
  getWords,
} from '../../../service/service';
import getRandomInteger from '../../../utils/random';
import {
  urls,
  wordsToLearnSelectConstants,
  vocabularyConstants,
  StatisticsGameCodes,
} from '../../../constants/constants';
import {
  GAME_BLOCK,
  RESULT_FORM,
  START_WINDOW,
} from '../../../constants/constatntsForEP';
import createCanvasElements from './components/game-field';
import findPainting from './components/select-painting';
import Preloader from '../../preloader/Preloader';
import StartWindow from '../common/StartWindow';
import Vocabulary from '../../vocabulary/Vocabulary';
import Statistics from '../../statistics/Statistics';

const {
  SELECT_OPTION_LEARNED_WORDS_VALUE,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE,
} = wordsToLearnSelectConstants;

export default class EnglishPuzzle {
  constructor(obj) {
    this.backData = obj;
    this.gameForm = null;
    this.startMenu = null;
    this.resultForm = createResultBlock();
    this.vocabulary = new Vocabulary(this.backData.user);
    this.statistics = new Statistics(this.backData.user);
    this.preloader = new Preloader();

    this.sinth = window.speechSynthesis;
    this.actualSentenses = null;

    this.words = null;
    this.actualTranslate = null;
    this.actualCards = null;
    this.activeSentenseCounter = 0;
    this.rightAnswers = [];
    this.falseAnswers = [];
    this.dropped = null;
    this.activeSentenseForCheck = null;
    this.painting = null;
  }

  async start(elementQuery) {
    await this.vocabulary.init();
    await this.statistics.init();

    const gameZone = new MainBlock();
    this.startWindow = new StartWindow((this.startMenuButtonAction).bind(this));
    this.startWindow.gameWindow.classList.add('english-puzzle__start-game-window');
    this.gameForm = gameZone.createMainForm();
    this.backData.closeButton.show();
    this.gameForm.appendChild(this.backData.closeButton.render());
    this.startMenu = create('div', 'start-window');
    await this.checkWordsCollections();

    this.preloader.render();

    const container = document.querySelector(elementQuery);
    this.wrapper = create('div', 'english-puzzle-wrapper', [this.startMenu, this.gameForm, this.resultForm]);
    container.appendChild(this.wrapper);

    this.backData.closeButton.addCloseCallbackFn((this.actionOnCloseButton).bind(this));
    this.actionsOnSupportButtons();
    this.controlButtonsAction();
  }

  async checkWordsCollections() {
    cleanParentNode(this.startMenu);
    this.words = this.vocabulary.getWordsByVocabularyType(vocabularyConstants.LEARNED_WORDS_TITLE);
    const isShowLearnedWordsOption = this.words.length >= GAME_BLOCK.gameZoneRows;
    const startBlock = this.startWindow.render(START_WINDOW.title, START_WINDOW.description, isShowLearnedWordsOption);
    this.startMenu.appendChild(startBlock);
  }

  async getCardsAndStartGame(status = false) {
    try {
      this.preloader.show();
      await this.getGameCards(status);
      this.preloader.hide();
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      document.querySelector('.bonus-button').classList.remove('active-bonus');
    } catch (e) {
      this.preloader.hide();
    }
  }

  async getGameCards(status = false) {
    status ? this.page : this.page = getRandomInteger(0, GAME_BLOCK.gamePages) + 1;
    const lvl = getRandomInteger(0, GAME_BLOCK.gameLevels) + 1;
    switch (this.gameStatus) {
      case SELECT_OPTION_LEARNED_WORDS_VALUE:
        this.words = this.vocabulary
          .getWordsByVocabularyType(vocabularyConstants.LEARNED_WORDS_TITLE);
        this.words = this.words.map((el) => el.optional.allData);
        this.painting = findPainting(lvl, this.page);
        viewElement([document.querySelector('.new-lvl-button_container')], []);
        break;
      default:
        this.words = await getWords(this.page, this.gameLvl);
        this.painting = findPainting(this.gameLvl + 1, this.page);
        viewElement([], [document.querySelector('.new-lvl-button_container')]);
        break;
    }
    const imageUrl = urls.GET_PAINTING(this.painting.imageSrc);
    this.paintingText = `${this.painting.author}, ${this.painting.name} (${this.painting.year})`;
    this.actualSentenses = [];
    this.actualTranslate = [];
    this.rightAnswers = [];
    this.falseAnswers = [];
    this.activeSentenseCounter = 0;
    this.activeRow = document.querySelectorAll('.puzzle-row')[this.activeSentenseCounter];

    document.querySelectorAll('.puzzle-row').forEach((el) => cleanParentNode(el));
    document.querySelector('.game-block_field--background').style.backgroundImage = `url(${imageUrl})`;

    for (let i = 0; i < GAME_BLOCK.gameZoneRows; i += 1) {
      this.actualSentenses.push(this.words[i].textExample);
      this.actualTranslate.push(this.words[i].textExampleTranslate);
    }
    this.actualCards = await createCanvasElements({
      src: imageUrl,
      wordsList: this.actualSentenses,
    });
  }

  async switchGamePageOrLvl() {
    if (this.activeSentenseCounter + 1 < GAME_BLOCK.gameZoneRows) {
      this.activeSentenseCounter += 1;
      this.activeRow = document.querySelectorAll('.puzzle-row')[this.activeSentenseCounter];
      this.gameStart();
      this.showTranslate();
      this.dragAndDropActions();
      viewElement([document.querySelector('.continue-button')],
        [
          document.querySelector('.check-button'),
          document.querySelector('.show-result-button'),
        ]);
      if (document.querySelector('.bonus-button').classList.contains('active-bonus')) {
        viewElement([], [document.querySelector('.bonus-button')]);
      }
    } else if (this.activeSentenseCounter + 1 === GAME_BLOCK.gameZoneRows) {
      this.statistics.saveGameStatistics(
        StatisticsGameCodes.ENGLISH_PUZZLE_GAME_CODE,
        this.rightAnswers.length,
        this.falseAnswers.length,
      );
      if (this.rightAnswers.length === GAME_BLOCK.gameZoneRows) {
        await this.getCardsAndStartGame();
        viewElement([
          document.querySelector('.game-block_field--background'),
          document.querySelector('.continue-button'),
          document.querySelector('.result-button'),
          document.querySelector('.bonus-button'),
        ], [
          document.querySelector('.game-block_field--puzzle-container'),
          document.querySelector('.check-button'),
          document.querySelector('.show-result-button'),
        ]);
      } else {
        viewElement([
          document.querySelector('.continue-button'),
        ], [
          document.querySelector('.result-button'),
        ]);
        this.gameStatus === SELECT_OPTION_LEARNED_WORDS_VALUE
          ? viewElement([document.querySelector('.repeat-button')], [])
          : viewElement([], [document.querySelector('.repeat-button')]);
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
      this.speachActiveSentens(this.actualSentenses[this.activeSentenseCounter]);
      document.querySelector('.bonus-button').classList.add('active-bonus');
      cardsWithAnswers.forEach((el) => {
        const elem = el;
        elem.classList.remove('active-card');
        elem.removeAttribute('draggable');
      });
      if (this.rightAnswers.length === GAME_BLOCK.gameZoneRows) {
        viewElement([
          document.querySelector('.game-block_field--puzzle-container'),
        ], [
          document.querySelector('.game-block_field--background'),
          document.querySelector('.result-button'),
        ]);
        this.showActualPainting();
      }
      viewElement([
        document.querySelector('.check-button'),
        document.querySelector('.show-result-button'),
      ], [
        document.querySelector('.continue-button'),
      ]);
    } else {
      viewElement([], [document.querySelector('.show-result-button')]);
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

    cleanParentNode(sentensBase);
    cleanParentNode(this.activeRow);

    this.falseAnswers.push(this.actualSentenses[this.activeSentenseCounter]);
    this.addWordToCollectionWordsToLern();
    this.activeSentenseForCheck.forEach((el) => {
      const elem = el;
      elem.classList.remove('active-card');
      elem.removeAttribute('draggable');
      this.activeRow.appendChild(elem);
    });
  }

  async addWordToCollectionWordsToLern() {
    await this.vocabulary.addWordToTheVocabulary(this.words[this.activeSentenseCounter],
      vocabularyConstants.WORDS_TO_LEARN_TITLE);
  }

  showActualPainting() {
    const descr = create('p', 'painting-description', '', document.querySelector('.game-block_field--description'));
    descr.textContent = this.paintingText;
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

  speachActiveSentens(words, target) {
    const targetEl = target || document.querySelector('.sound-button');
    const sentense = EnglishPuzzle.createCorrectSentence(words);
    const message = new SpeechSynthesisUtterance(sentense);
    message.onstart = () => targetEl.classList.add('active-sound');
    message.onend = () => targetEl.classList.remove('active-sound');
    const voices = this.sinth.getVoices().filter((el) => el.lang === GAME_BLOCK.langEn)[1];
    message.voice = voices;
    this.sinth.speak(message);
  }

  gameStart() {
    const cards = Array.from(this.actualCards[this.activeSentenseCounter].childNodes);
    const cardsContainer = document.querySelector('.game-block_field--description');
    cleanParentNode(cardsContainer);

    this.activeSentenseForCheck = cards.slice();
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((el) => {
      const elem = el;
      elem.draggable = 'true';
      elem.classList.add('active-card');
      cardsContainer.appendChild(elem);
    });
  }

  static checkFieldCompletion() {
    const sentensBase = document.querySelector('.game-block_field--description');
    if (!sentensBase.hasChildNodes()) {
      viewElement([
        document.querySelector('.show-result-button'),
        document.querySelector('.bonus-button'),
      ], []);
    }
  }

  resultCollection() {
    const resultStatistic = document.querySelector('.result-block_statistic');
    const painting = document.querySelector('.result-block_painting').childNodes;
    cleanParentNode(painting[0]);
    cleanParentNode(resultStatistic);

    const image = document.querySelector('.game-block_field--background').cloneNode(false);
    image.classList.add('result-image');
    painting[0].appendChild(image);
    painting[1].textContent = this.paintingText;

    for (let i = 0; i < RESULT_FORM.statusTitle.length; i += 1) {
      const titleBlock = create('div', 'result-block-title--block', '', resultStatistic);
      const answersTitle = create('p', 'result-block_statistic--title', '', titleBlock);
      const counter = create('div', 'result-block_statistic--counter', '', titleBlock);
      answersTitle.textContent = RESULT_FORM.statusTitle[i];
      switch (i) {
        case 0:
          counter.textContent = (this.rightAnswers.length) ? this.rightAnswers.length : 0;
          counter.classList.add('result-block--incorrect');
          create('div', 'know-sentence-block', EnglishPuzzle.createResultRow(this.rightAnswers), resultStatistic);
          break;
        default:
          counter.classList.add('result-block--correct');
          counter.textContent = (this.falseAnswers.length) ? this.falseAnswers.length : 0;
          create('div', 'know-sentence-block', EnglishPuzzle.createResultRow(this.falseAnswers), resultStatistic);
          break;
      }
    }
  }

  static createResultRow(mas) {
    const sentenses = mas.map((el) => {
      const dinamic = create('div', 'result-row_sound', '<i class="fas fa-volume-up"></i>');
      const text = create('p', 'result-row_text');
      text.textContent = EnglishPuzzle.createCorrectSentence(el);
      return create('div', 'result-row', [dinamic, text]);
    });
    return sentenses;
  }

  additionalFunctionalForBonusButton() {
    const sentensBase = document.querySelector('.game-block_field--description');
    if (sentensBase.childNodes.length) {
      const bonusElement = this.activeSentenseForCheck[this.activeRow.childNodes.length];
      sentensBase.removeChild(bonusElement);
      this.activeRow.appendChild(bonusElement);
    }
  }

  async startMenuButtonAction(collection, lvl) {
    this.gameStatus = collection;
    if (this.gameStatus === SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE) {
      this.gameLvl = lvl;
    }
    viewElement([
      this.startMenu,
      document.querySelector('.result-button'),
      document.querySelector('.continue-button'),
      document.querySelector('.repeat-button'),
    ], [
      document.querySelector('.check-button'),
      document.querySelector('.show-result-button'),
    ]);
    await this.getCardsAndStartGame();
    viewElement([], [this.gameForm]);
  }

  cardClickAction(ev) {
    if (!ev.data) {
      this.dropped = ev;
    }
    this.activeRow.appendChild(this.dropped);
    this.activeRow.classList.remove('row-hover');
    EnglishPuzzle.checkFieldCompletion();
  }

  async actionOnCloseButton() {
    this.backData.shortTermStatistics.removeEvents();
    this.backData.closeButton.modalWindow.removeEvents();
    await this.checkWordsCollections();
    viewElement([this.gameForm], [this.startMenu]);
  }

  dragAndDropActions() {
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
    });

    this.activeRow.addEventListener('drop', (event) => {
      event.preventDefault();
      this.activeRow.appendChild(this.dropped);
      EnglishPuzzle.checkFieldCompletion();
      event.target.classList.remove('row-hover');
    });
    this.activeRow.addEventListener('dragover', dragOver);
    this.activeRow.addEventListener('dragenter', dragEnter);
    this.activeRow.addEventListener('dragleave', dragLeave);
    this.activeRow.addEventListener('click', (event) => {
      if (event.target.classList.contains('active-card')) {
        this.cardClickAction(event.target);
      }
    });
    document.querySelector('.game-block_field--description').addEventListener('drop', (event) => {
      event.preventDefault();
      document.querySelector('.game-block_field--description').appendChild(this.dropped);
      event.target.classList.remove('row-hover');
    });
    document.querySelector('.game-block_field--description').addEventListener('dragover', dragOver);
    document.querySelector('.game-block_field--description').addEventListener('dragenter', dragEnter);
    document.querySelector('.game-block_field--description').addEventListener('dragleave', dragLeave);
    document.querySelector('.game-block_field--description').addEventListener('click', (event) => {
      if (event.target.classList.contains('active-card')) {
        this.cardClickAction(event.target);
      }
    });
  }

  actionsOnSupportButtons() {
    document.querySelector('.control-buttons_container').addEventListener('click', (event) => {
      if (event.target.classList.contains('help-button')) {
        event.target.classList.toggle('active-button');
      } else if (event.target.classList.contains('fas') && event.target.parentNode.classList.contains('help-button')) {
        event.target.parentNode.classList.toggle('active-button');
      }
    });

    document.querySelector('.button-sintezise').addEventListener('click', () => {
      const status = JSON.parse(localStorage.userSettings);
      if (status.sound) {
        status.sound = false;
        this.sinth.cancel();
        document.querySelector('.sound-button').classList.remove('active-sound');
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
        this.speachActiveSentens(this.actualSentenses[this.activeSentenseCounter], event.target);
      } else if (event.target.parentNode.classList.contains('active-sintez')) {
        this.speachActiveSentens(
          this.actualSentenses[this.activeSentenseCounter],
          event.target.parentNode,
        );
      }
    });

    document.querySelector('.new_lvl-button').addEventListener('click', async () => {
      await this.getCardsAndStartGame();
      viewElement([
        document.querySelector('.result-button'),
        document.querySelector('.continue-button'),
        document.querySelector('.repeat-button'),
        this.startMenu,
      ], [
        document.querySelector('.check-button'),
        document.querySelector('.show-result-button'),
      ]);
    });
  }

  controlButtonsAction() {
    document.querySelector('.show-result-button').addEventListener('click', (event) => {
      this.showCorrectSentens();
      viewElement([
        event.target,
        document.querySelector('.check-button'),
        document.querySelector('.bonus-button'),
      ], [document.querySelector('.continue-button')]);
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
      viewElement([this.gameForm], [this.resultForm]);
    });

    document.querySelector('.repeat-button').addEventListener('click', async (event) => {
      await this.getCardsAndStartGame(true);
      viewElement([
        document.querySelector('.result-button'),
        event.target,
      ],
      [
        document.querySelector('.check-button'),
        document.querySelector('.show-result-button'),
      ]);
    });

    document.querySelector('.bonus-button').addEventListener('click', (event) => {
      this.additionalFunctionalForBonusButton();
      event.target.classList.remove('active-bonus');
      viewElement([event.target], []);
    });

    document.querySelector('.result-button_continue').addEventListener('click', () => {
      viewElement([this.resultForm], [this.gameForm]);
    });
  }

  actionForResultSounds() {
    document.querySelectorAll('.result-row').forEach((el) => {
      const components = el.childNodes;
      components[0].addEventListener('click', (event) => {
        if (event.target.classList.contains('result-row_sound')) {
          this.speachActiveSentens(components[1].textContent, event.target);
        } else if (event.target.parentNode.classList.contains('result-row_sound')) {
          this.speachActiveSentens(components[1].textContent, event.target.parentNode);
        }
        if (event.target.classList.contains('active-sound')) {
          this.sinth.cancel();
          event.target.classList.remove('active-sound');
        } else if (event.target.parentNode.classList.contains('active-sound')) {
          this.sinth.cancel();
          event.target.parentNode.classList.remove('active-sound');
        }
      });
    });
  }
}
