import GameService from './GameService';
import create from '../../../utils/сreate';
import StartWindow from '../common/StartWindow';
import { auditionGameVariables,vocabularyConstants } from '../../../constants/constants';
import Vocabulary from  '../../vocabulary/Vocabulary';
import CloseButton from '../common/CloseButton';

export default class AuditionGame {
  constructor(user) {
    this.user = user;
  }

  async render(lives, roundsAll) {
    this.wrapper = create('div', 'audition-game__wrapper', '', document.querySelector('.main-content'));
    const roundResults = [];
    this.vocabulary = new Vocabulary(this.user);
    await this.vocabulary.init();
    this.wordsLength = this.vocabulary.getVocabularyWordsLength(vocabularyConstants.LEARNED_WORDS_TITLE);
    const collectionLengthEnough = true;//(this.wordsLength <= (auditionGameVariables.possibleWordsAmount * roundsAll));
    this.gameService = new GameService(this.user,lives, roundsAll, roundResults, collectionLengthEnough);
    this.gameService.getVocabularyData();
    this.showUserCollection = true;
    this.StartWindow = new StartWindow((this.gameService.startGame).bind(this.gameService));
    this.closeButton = new CloseButton();
    this.closeButton.addCloseCallbackFn((this.restart).bind(this));
    //create('div', '', this.closeButton.render(), wrapper);
    this.wrapper.appendChild(this.closeButton.render());
    this.closeButton.show();
    create('div', 'progress', '', this.wrapper);
    create('div', 'audition-game__startScreen',this.StartWindow.render(auditionGameVariables.gameTitle,auditionGameVariables.gameDescription,this.showUserCollection),this.wrapper);
    /*gameStartButton.addEventListener('click', async () => {
    
      document.querySelector('.audition-game__startScreen').classList.toggle('hide');
      this.gameService.preloaderInit();
      this.gameService.initRound(lives, roundsAll, 1, roundResults);
      create('div', 'progress', '', wrapper);
    });*/
  }
  restart(){
    document.querySelector('.main-content').innerHTML = '';
    this.render(auditionGameVariables.Lives,auditionGameVariables.Rounds);
  }
}
