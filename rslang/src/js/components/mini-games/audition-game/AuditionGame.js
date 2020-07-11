import GameService from './GameService';
import create from '../../../utils/сreate';
import StartWindow from '../common/StartWindow';
import { auditionGameVariables, vocabularyConstants } from '../../../constants/constants';
import Vocabulary from '../../vocabulary/Vocabulary';

const {
  Lives, Rounds,
} = auditionGameVariables;

export default class AuditionGame {
  constructor(miniGameObj, container) {
    this.miniGameObj = miniGameObj;
    this.user = miniGameObj.user;
    this.closeButton = miniGameObj.closeButton;
    this.ShortTermStatistics = miniGameObj.shortTermStatistics;
    this.container = container;
  }

  async render(lives = Lives, roundsAll = Rounds) {
    this.wrapper = create('div', 'audition-game__wrapper', '', this.container);
    const roundResults = [];
    this.vocabulary = new Vocabulary(this.user);
    await this.vocabulary.init();
    this.wordsLength = this.vocabulary
      .getVocabularyWordsLength(vocabularyConstants.LEARNED_WORDS_TITLE);
    const collectionLengthEnough = (
      this.wordsLength >= (auditionGameVariables.possibleWordsAmount * roundsAll)
    );
    this.gameService = new GameService(
      this.miniGameObj, lives, roundsAll, roundResults, collectionLengthEnough,
    );
    this.gameService.getVocabularyData();
    this.showUserCollection = true;
    this.StartWindow = new StartWindow((this.gameService.startGame).bind(this.gameService));
    this.closeButton.addCloseCallbackFn((this.restart).bind(this));
    this.ShortTermStatistics.addCallbackFnOnClose((this.restart).bind(this));
    create('div', 'progress', '', this.wrapper);
    create('div', 'audition-game__startScreen', this.StartWindow.render(auditionGameVariables.gameTitle, auditionGameVariables.gameDescription, this.showUserCollection), this.wrapper);
  }

  restart() {
    this.container.innerHTML = '';
    this.render(auditionGameVariables.Lives, auditionGameVariables.Rounds);
  }
}
