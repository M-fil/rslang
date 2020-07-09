import create from '../../../utils/сreate';
import { getWords } from '../../../service/service';

export default class SprintGame {
  constructor() {
    this.HTML = null;
  }

  SprintRender() {
    const { body } = document;
    const container = create('div', 'container main-container', '', body);
    const GameWindow = create('div', 'start-game-window', '', container);
    const GameRules = 'Лео-спринт – скоростная тренировка. За 60 секунд надо угадывать, правильный ли перевод предложен к английскому слову.';
    this.HTML = create('h2', 'game-name', 'Спринт', GameWindow);
    this.HTML = create('div', 'game-rules', GameRules, GameWindow);
    this.HTML = create('button', 'start-button', 'Start', GameWindow);
    this.exitButton = create('button', 'exit-button', 'X', body);
    this.Timer = create('span', 'timer', '', body);
    this.GameContainer = create('div', 'game-container', '', body);
    this.Score = create('div', 'score', '0', this.GameContainer);
    this.GameAnswers = create('div', 'game_answers-container', '', this.GameContainer);
    this.Word = create('h1', 'word', 'word', this.GameContainer);
    this.Translation = create('h1', 'Translation', 'Translation', this.GameContainer);
    this.answerButtonsContainer = create('div', 'answers_buttons-container', '', this.GameContainer);
    this.NoButton = create('button', 'no-button', 'No', this.answerButtonsContainer);
    this.YesButton = create('button', 'yes-button', 'Yes', this.answerButtonsContainer);
    this.countdown = create('div', 'countdown', '', body);
    this.StatContainer = create('div', 'stat-container', '', body);
    this.finalScore = create('h1', 'final-score', '', this.StatContainer);
    this.IncorrectStatContainer = create('div', 'incorrect-stat-container', '', this.StatContainer);
    this.incorrect_answers = create('p', 'incorrect-answers', 'Ошибок: ', this.IncorrectStatContainer);
    this.CorrectStatContainer = create('div', 'correct-stat-container', '', this.StatContainer);
    this.correct_answers = create('p', 'correct-answers', 'Знаю: ', this.CorrectStatContainer);
    this.restartButton = create('button', 'restart-button', 'Новая игра', this.StatContainer);
    return this.HTML;
  }

  GameBegin() {
    const StartGameWindow = document.querySelector('.start-game-window');
    StartGameWindow.style.display = 'none';
    this.Timer.style.display = 'block';
    this.exitButton.style.display = 'none';
    this.StatContainer.style.display = 'none';
    const sec = 5;
    let timeLeft = sec;
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        this.Timer.innerHTML = timeLeft;
        timeLeft -= 1;
      } else {
        clearInterval(timer);
        this.Game();
        this.GameTimerLeft();
      }
    }, 1000);
  }

  Random(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  Game() {
    this.Timer.style.display = 'none';
    this.exitButton.style.display = 'block';
    this.Timer.innerHTML = '';
    this.GameContainer.style.display = 'flex';
    window.correctAnswers = 0;
    this.GetWordData();
  }

  async GetWordData() {
    const ARRAY_WORDS = await getWords(this.Random(30), this.Random(6));
    const RANDOM_WORD = await getWords(this.Random(30), this.Random(6));
    this.WordGameRender(ARRAY_WORDS[this.Random(20)], RANDOM_WORD[this.Random(20)]);
  }

  WordGameRender(word, randomWord) {
  	const arr = [randomWord.wordTranslate, word.wordTranslate];
    this.Word.innerHTML = word.word;
    this.Translation.innerHTML = arr[this.Random(2)];
    window.answer = this.Translation.innerHTML === arr[1];
    window.ScoreTranslate = word.wordTranslate;
  }

  Correct() {
  	let power = 1;
  	window.correctAnswers += 1;
  	this.GameAnswers.innerHTML += '✓';
  	if (window.correctAnswers > 3) power = 2;
  	if (window.correctAnswers > 7) power = 4;
  	if (window.correctAnswers > 11) power = 8;
  	if ((window.correctAnswers) % 4 == 0) this.GameAnswers.innerHTML = '';
  	const prevScore = this.Score.innerHTML;
  	this.Score.innerHTML = +prevScore + 10 * power;
  	const p = document.createElement('p');
  	p.classList.toggle('correct');
  	p.innerHTML = `${this.Word.innerHTML} - ${window.ScoreTranslate}`;
  	this.CorrectStatContainer.append(p);
  }

  Incorrect() {
  	window.correctAnswers = 0;
  	this.GameAnswers.innerHTML = '';
  	const p = document.createElement('p');
  	p.classList.toggle('incorrect');
  	p.innerHTML = `${this.Word.innerHTML} - ${window.ScoreTranslate}`;
  	this.IncorrectStatContainer.append(p);
  }

  GameTimerLeft() {
    this.countdown.innerHTML = `
		<div class="countdown-number"></div>
		<svg>
    	<circle r="18" cx="20" cy="20"></circle>
		</svg>`;
    const countdownNumberEl = document.querySelector('.countdown-number');
    let countdown = 10;
    countdownNumberEl.textContent = countdown;
    const self = this;
    const myTimer = setInterval(() => {
      countdown -= 1;
      if (countdown == 0) {
        clearInterval(myTimer);
        countdown = '';
        self.EndGame();
      }
      countdownNumberEl.textContent = countdown;
    }, 1000);
  }

  EndGame() {
    this.countdown.innerHTML = '';
    this.GameContainer.style.display = 'none';
    this.StatContainer.style.display = 'flex';
    this.exitButton.style.display = 'none';
    this.finalScore.innerHTML = `Ваш счёт: ${this.Score.innerHTML}`;
    const errors = document.getElementsByClassName('incorrect');
    this.incorrect_answers.innerHTML += errors.length;
    const rights = document.getElementsByClassName('correct');
    this.correct_answers.innerHTML += rights.length;
  }

  ClearGameData() {
    this.incorrect_answers.innerHTML = 'Ошибок: ';
    this.correct_answers.innerHTML = 'Знаю: ';
    this.Score.innerHTML = '0';
    this.finalScore.innerHTML = '';
    this.GameAnswers.innerHTML = '';
    window.correctAnswers = 0;
    window.incorrectAnswers = 0;
    while (this.IncorrectStatContainer.childNodes.length > 1) {
    	this.IncorrectStatContainer.removeChild(this.IncorrectStatContainer.lastChild);
  	}
 		while (this.CorrectStatContainer.childNodes.length > 1) {
    	this.CorrectStatContainer.removeChild(this.CorrectStatContainer.lastChild);
  	}
    this.GameBegin();
  }

  Close() {
    const answer = confirm('Вы, действительно, хотите вернуться в меню игры?');
    return answer;
  }

  Home() {
    const StartGameWindow = document.querySelector('.start-game-window');
    StartGameWindow.style.display = 'flex';
    this.GameContainer.style.display = 'none';
  }
}
