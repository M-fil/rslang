import create from '../../../utils/сreate';
import { getWords } from '../../../service/service';
import {
  urls,
  sprint,
  vocabularyConstants,
  sprintAudios,
} from '../../../constants/constants';
import Preloader from '../../preloader/preloader';
import StartWindow from '../common/StartWindow';
import Vocabulary from '../../vocabulary/Vocabulary';
import Statistics from '../../statistics/Statistics';

const {
  WORDS_DATA_URL,
  WORDS_AUDIOS_URL,
  CORRECT_AUDIO_PATH,
  ERROR_AUDIO_PATH,
} = urls;

const {
  WORDS_TO_LEARN_TITLE,
  LEARNED_WORDS_TITLE,
} = vocabularyConstants;

const {
  GAME_AUDIO_4,
  END_AUDIO_PATH,
  GAME_AUDIO_PATH,
} = sprintAudios;

export default class SprintGame {
  constructor(miniGameParameters) {
    this.user = miniGameParameters.user;
    this.closeButton = miniGameParameters.closeButton;
    this.shortTermStatistics = miniGameParameters.shortTermStatistics;

    this.closeButton.exitButton.classList.add('sprint__exit-button');
    this.closeButton.addCloseCallbackFn((this.Home).bind(this));

    this.startWindow = new StartWindow((this.GameBegin).bind(this));
    this.vocabulary = new Vocabulary(this.user);
    this.statistics = new Statistics(this.user);
    this.preloader = new Preloader();

    this.counter = 4;
  }

  async SprintRender(elementQuery) {
    await this.vocabulary.init();
    await this.statistics.init();
    this.mainContainer = document.querySelector(elementQuery);
    create('div', 'container main-container', '', this.SprintGameWrapper);
    this.renderStartWindow();

    this.activateKeyDownEvent();
    this.activateGameButtons();
  }

  renderStartWindow() {
    const startWindowHTML = this.startWindow.render(
      sprint.GAME_NAME, sprint.GAME_RULES, this.CheckVocabularyLength(),
    );
    create('div', 'start-window-container', startWindowHTML, this.mainContainer);
  }

  createGameElements() {
    this.Score = create('div', 'sprint__score', '0', this.GameContainer);
    this.GameAnswers = create('div', 'game_answers-container', '', this.GameContainer);
    this.Factor = create('p', 'factor', '+10 очков за слово', this.GameContainer);
    this.Word = create('h1', 'word', 'СЛОВО', this.GameContainer);
    this.AudioWord = create('audio', 'audio-word_game', '', this.GameContainer);
    this.Translation = create('h1', 'Translation', 'ПЕРЕВОД', this.GameContainer);
    this.answerButtonsContainer = create('div', 'answers_buttons-container', '', this.GameContainer);
    this.noButtonElement = create('button', 'sprint-btn no-button', 'No', this.answerButtonsContainer);
    this.yesButtonElement = create('button', 'sprint-btn yes-button', 'Yes', this.answerButtonsContainer);
    this.countdown = create('div', 'countdown', '', this.SprintGameWrapper);
    this.StatContainer = create('div', 'stat-container none', '', this.SprintGameWrapper);
    this.finalScore = create('h1', 'final-score', '', this.StatContainer);
    this.IncorrectStatContainer = create('div', 'incorrect-stat-container', '', this.StatContainer);
    this.incorrect_answers = create('p', 'incorrect-answers', 'Ошибок: ', this.IncorrectStatContainer);
    this.CorrectStatContainer = create('div', 'correct-stat-container', '', this.StatContainer);
    this.correct_answers = create('p', 'correct-answers', 'Знаю: ', this.CorrectStatContainer);
    this.restartButton = create('button', 'sprint-btn restart-button', 'Новая игра', this.StatContainer);
  }

  setGameHTMLElements() {
    this.yesButton = document.querySelector('.yes-button');
    this.noButton = document.querySelector('.no-button');
    this.restartButtonHTML = document.querySelector('.restart-button');
    this.GameAudio = document.querySelector('.game-audio');
    this.WrongAnswer = document.querySelector('.wrong-answer');
    this.CorrectAnswer = document.querySelector('.correct-answer');
    this.SoundIcon = document.querySelector('.sound-icon');
    this.WordHTML = document.querySelector('.word');
    this.AudioWordHTML = document.querySelector('.audio-word_game');
    this.GameAudioButton = document.querySelector('.game-audio_button');
  }

  Disabled() {
    this.yesButton.disabled = true;
    setTimeout(() => { this.yesButton.disabled = false; }, 1000);
    this.noButton.disabled = true;
    setTimeout(() => { this.noButton.disabled = false; }, 1000);
    this.yesButton.disabled = true;
  }

  activateKeyDownEvent() {
    document.addEventListener('keydown', (e) => {
      if (e.key === sprint.KEYBOARD_BUTTON_CORRECT) {
        if (window.answer) this.Correct();
        else this.Incorrect();
        this.GetWordData();
      }
      if (e.key === sprint.KEYBOARD_BUTTON_WRONG) {
        if (!window.answer) this.Correct();
        else this.Incorrect();
        this.GetWordData();
      }
    });
  }

  activateGameButtons() {
    document.addEventListener('click', (e) => {
      if (e.target === this.yesButton) {
        if (window.answer) this.Correct();
        else this.Incorrect();
        this.GetWordData();
        this.Disabled();
      }
      if (e.target === this.noButton) {
        if (!window.answer) this.Correct();
        else this.Incorrect();
        this.GetWordData();
        this.Disabled();
      }

      switch (e.target) {
        case this.restartButtonHTML:
          this.ClearGameData();
          break;
        case this.SoundIcon:
          this.SoundIcon.classList.toggle('muted');
          this.WrongAnswer.muted = !this.WrongAnswer.muted;
          this.CorrectAnswer.muted = !this.CorrectAnswer.muted;
          this.GameAudio.muted = !this.GameAudio.muted;
          break;
        case this.WordHTML:
          this.AudioWordHTML.play();
          break;
        case this.GameAudioButton:
          if (this.counter !== 7) this.counter += 1;
          else this.counter = 1;
          this.GameAudio.src = `${GAME_AUDIO_PATH}${this.counter}.mp3`;
          this.GameAudio.play();
          break;
        case (this.closeButton):
          if (this.Close()) this.Home();
          break;
        case (document.querySelector('.fas')):
          if (this.Close()) this.Home();
          break;
        default:
          return;
      }

      if (e.target.classList[0] === 'audio-icon') {
        e.target.childNodes[0].play();
      }
    });
  }

  renderGameAfterStartButtonClick() {
    this.Timer = create('span', 'timer', '', this.SprintGameWrapper);
    this.TimerAudio = create('audio', 'timer-audio', '', this.SprintGameWrapper);
    this.TimerAudio.src = 'src/assets/audio/timer.mp3';
    this.GameContainer = create('div', 'game-container none', '', this.SprintGameWrapper);
    this.closeButton.show();
    this.GameContainer.append(this.closeButton.render());
  }

  setGameAudio() {
    this.GameAudio = create('audio', 'game-audio', '', this.GameContainer);
    this.GameAudio.src = GAME_AUDIO_4;
    this.GameAudio.loop = true;
    this.GameAudio.volume = 0.5;
    this.GameAudioButton = create('div', 'game-audio_button', '', this.GameContainer);

    this.audio = create('audio', 'audio', '', this.SprintGameWrapper);
    this.AudioAnswers = create('div', 'audio-answers', '', this.SprintGameWrapper);
    this.CorrectAnswer = create('audio', 'correct-answer', '', this.AudioAnswers);

    this.CorrectAnswer.src = CORRECT_AUDIO_PATH;
    this.WrongAnswer = create('audio', 'wrong-answer', '', this.AudioAnswers);
    this.WrongAnswer.src = ERROR_AUDIO_PATH;
    this.SoundIcon = create('div', 'sound-icon', '', this.GameContainer);
    this.EndSoundGame = create('audio', '', '', this.SprintGameWrapper);
    this.EndSoundGame.src = END_AUDIO_PATH;
  }

  GameBegin() {
    this.SprintGameWrapper = create('div', 'sprint-game-wrapper', '', this.mainContainer);
    this.renderGameAfterStartButtonClick();
    this.setGameAudio();
    this.createGameElements();
    this.setGameHTMLElements();

    document.querySelector('.start-window-container').remove();
    const { selectLevel, select } = this.startWindow.wordsToLearnSelect;
    this.WordSelected = select.value;
    this.LvlSelect = selectLevel.value;

    this.Timer.classList.add('block');
    this.StatContainer.classList.remove('flex');
    this.StatContainer.classList.add('none');

    setTimeout(() => {
      this.TimerAudio.play();
    }, 1000);
    const sec = 5;
    let timeLeft = sec;
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        this.Timer.innerHTML = timeLeft;
        timeLeft -= 1;
      } else {
        clearInterval(timer);
        this.TimerAudio.pause();
        this.TimerAudio.currentTime = 0;
        this.Game();
        this.GameTimerLeft();
      }
    }, 1000);
  }

  CheckVocabularyLength() {
    let result = false;
    if (this.vocabulary.getVocabularyWordsLength(WORDS_TO_LEARN_TITLE) > 30) result = true;
    return result;
  }

  static Random(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  Game() {
    this.Timer.classList.remove('block');
    this.Timer.innerHTML = '';
    this.GameContainer.classList.remove('none');
    this.GameContainer.classList.add('flex');
    window.correctAnswers = 0;
    this.GetWordData();
  }

  async GetWordData() {
    const vocLength = this.vocabulary.getVocabularyWordsLength(WORDS_TO_LEARN_TITLE);
    const vocWords = this.vocabulary.getWordsByVocabularyType(WORDS_TO_LEARN_TITLE);
    if (this.WordSelected === 'LEARNED_WORDS' && vocLength > 9) {
      await this.WordGameRender(
        vocWords[SprintGame.Random(vocLength)].optional.allData,
        vocWords[SprintGame.Random(vocLength)].optional.allData,
      );
    } else {
      const ARRAY_WORDS = await getWords(SprintGame.Random(30), this.LvlSelect);
      const RANDOM_WORD = await getWords(SprintGame.Random(30), this.LvlSelect);
      await this.WordGameRender(ARRAY_WORDS[SprintGame.Random(20)], RANDOM_WORD[SprintGame.Random(20)]);
    }
  }

  async WordGameRender(word, randomWord) {
  	const arr = [randomWord.wordTranslate, word.wordTranslate];
    this.Word.innerHTML = word.word;
    this.Translation.innerHTML = arr[SprintGame.Random(2)];
    window.answer = this.Translation.innerHTML === arr[1];
    window.ScoreTranslate = word.wordTranslate;
    this.playAudio(`${WORDS_AUDIOS_URL}${word.audio}`);
  }

  playAudio(source) {
    window.AUDIO_WORD_SRC = source;
    this.AudioWord.src = window.AUDIO_WORD_SRC;
  }

  Correct() {
  	let power = sprint.POWER1;
  	window.correctAnswers += 1;
  	this.GameAnswers.innerHTML += sprint.RIGHT_ANSWER;
  	if (window.correctAnswers >= sprint.CORRECT1) power = sprint.POWER2;
  	if (window.correctAnswers >= sprint.CORRECT2) power = sprint.POWER3;
  	if (window.correctAnswers >= sprint.CORRECT3) power = sprint.POWER4;
  	if (window.correctAnswers % sprint.BONUS_ANSWERS === 0 && window.correctAnswers !== 0) window.countdown += sprint.BONUS_TIME;
    if ((window.correctAnswers) % 4 === 0) this.GameAnswers.innerHTML = '';

  	const prevScore = this.Score.innerHTML;
  	this.Factor.innerHTML = `+${power * 10} очков за слово`;
  	this.Score.innerHTML = +prevScore + 10 * power;
  	const ANSWER_CONT = document.createElement('div');
  	ANSWER_CONT.classList.toggle('answer-cont');
  	this.CorrectStatContainer.append(ANSWER_CONT);
  	const AUDIO_DIV = document.createElement('div');
  	AUDIO_DIV.classList.toggle('audio-icon');
  	ANSWER_CONT.append(AUDIO_DIV);
  	const audio = document.createElement('audio');
  	audio.src = window.AUDIO_WORD_SRC;
  	AUDIO_DIV.append(audio);
  	const p = document.createElement('p');
  	p.classList.toggle('correct');
  	p.innerHTML = `${this.WordHTML.innerHTML} - ${window.ScoreTranslate}`;
  	ANSWER_CONT.append(p);
  	this.CorrectAnswer.play();
  }

  Incorrect() {
  	window.correctAnswers = 0;
  	this.Factor.innerHTML = '+10 очков за слово';
  	this.GameAnswers.innerHTML = '';
  	const ANSWER_CONT = document.createElement('div');
  	ANSWER_CONT.classList.toggle('answer-cont');
  	this.IncorrectStatContainer.append(ANSWER_CONT);
  	const AUDIO_DIV = document.createElement('div');
  	AUDIO_DIV.classList.toggle('audio-icon');
  	ANSWER_CONT.append(AUDIO_DIV);
  	const audio = document.createElement('audio');
  	audio.src = window.AUDIO_WORD_SRC;
  	AUDIO_DIV.append(audio);
  	const p = document.createElement('p');
  	p.classList.toggle('incorrect');
  	p.innerHTML = `${this.WordHTML.innerHTML} - ${window.ScoreTranslate}`;
  	ANSWER_CONT.append(p);
  	this.WrongAnswer.play();
  }

  GameTimerLeft() {
    this.countdown.innerHTML = `
		<div class="countdown-number"></div>
		<svg>
    	<circle r="18" cx="20" cy="20"></circle>
		</svg>`;
    this.GameAudio.play();
    const countdownNumberEl = document.querySelector('.countdown-number');
    window.countdown = sprint.GAME_TIMER;
    countdownNumberEl.textContent = window.countdown;
    const self = this;
    window.myTimer = setInterval(() => {
      window.countdown -= 1;
      if (window.countdown === 0) {
        clearInterval(window.myTimer);
        window.countdown = '';
        this.GameAudio.pause();
        this.GameAudio.currentTime = 0;
        self.EndGame();
      }
      countdownNumberEl.textContent = window.countdown;
    }, 1000);
  }

  EndGame() {
  	this.EndSoundGame.play();
    this.countdown.innerHTML = '';
    this.Factor.innerHTML = '+10 очков за слово';
    this.GameContainer.classList.remove('flex');
    this.GameContainer.classList.add('none');
    this.StatContainer.classList.add('flex');
    this.StatContainer.classList.remove('none');
    this.finalScore.innerHTML = `${sprint.SCORE} ${this.Score.innerHTML}`;
    const errors = document.getElementsByClassName('incorrect');
    this.incorrect_answers.innerHTML += errors.length;
    const rights = document.getElementsByClassName('correct');
    this.correct_answers.innerHTML += rights.length;
    this.Translation.innerHTML = 'ПЕРЕВОД';
    this.Word.innerHTML = 'СЛОВО';
    this.GameAudio.pause();
    this.GameAudio.currentTime = 0;
    this.statistics.saveGameStatistics('sprint', errors.length, rights.length);
  }

  ClearGameData() {
    this.incorrect_answers.innerHTML = sprint.CORRECT_ANSWERS;
    this.correct_answers.innerHTML = sprint.INCORRECT_ANSWERS;
    this.Score.innerHTML = '0';
    this.finalScore.innerHTML = '';
    this.GameAnswers.innerHTML = '';
    window.correctAnswers = 0;
    window.incorrectAnswers = 0;
    while (this.IncorrectStatContainer.childNodes.length > 1) {
      this.IncorrectStatContainer.removeChild(
        this.IncorrectStatContainer.lastChild,
      );
    }
 		while (this.CorrectStatContainer.childNodes.length > 1) {
    	this.CorrectStatContainer.removeChild(
        this.CorrectStatContainer.lastChild,
      );
    }

    this.GameBegin();
  }

  Close() {
    const answer = confirm(sprint.EXIT_ANSWER);
    return answer;
  }

  Home() {
    this.renderStartWindow();
    this.SprintGameWrapper.remove();
    this.GameContainer.classList.remove('flex');
    this.GameContainer.classList.add('none');
    this.Translation.innerHTML = 'ПЕРЕВОД';
    this.WordHTML.innerHTML = 'СЛОВО';
    this.countdown.innerHTML = '';
    clearInterval(window.myTimer);
    this.GameAudio.pause();
    this.GameAudio.currentTime = 0;
    this.GameAnswers.innerHTML = '';
  }
}
