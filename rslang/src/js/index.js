import 'babel-polyfill';
import '../scss/style.scss';
import SprintGame from './components/mini-games/sprint/Sprint';
import App from './components/app/App';

// const app = new App();
// app.run();

const sprint = new SprintGame();
sprint.SprintRender();

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  sprint.GameBegin();
});

const WORD_CHOICE = document.querySelector('.words-select-container');
const H3_LVL_SELECT = document.querySelector('.h3_select');
const LVL_SELECT = document.querySelector('.lvl-select-container');
WORD_CHOICE.addEventListener('click', () => {
	if(WORD_CHOICE.value === 'Слова из коллекций') {
		H3_LVL_SELECT.classList.remove('none');
		LVL_SELECT.classList.remove('none');
	}
	else {
		H3_LVL_SELECT.classList.add('none');
		LVL_SELECT.classList.add('none');
	}
});

const closeButton = document.querySelector('.exit-button');
closeButton.addEventListener('click', () => {
  if (sprint.Close()) sprint.Home();
});

const yesButton = document.querySelector('.yes-button');
yesButton.addEventListener('click', () => {
  if (window.answer) sprint.Correct();
  else sprint.Incorrect();
  sprint.GetWordData();
  Disabled();
});

const noButton = document.querySelector('.no-button');
noButton.addEventListener('click', () => {
	  if (!window.answer) sprint.Correct();
  else sprint.Incorrect();
  sprint.GetWordData();
  Disabled();
});

const restartButton = document.querySelector('.restart-button');
restartButton.addEventListener('click', () => {
	  sprint.ClearGameData();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    if (window.answer) sprint.Correct();
    else sprint.Incorrect();
    sprint.GetWordData();
  }
  if (e.key === 'ArrowLeft') {
    if (!window.answer) sprint.Correct();
    else sprint.Incorrect();
    sprint.GetWordData();
  }
});

const STAT_CONTAINER = document.querySelector('.stat-container');
STAT_CONTAINER.addEventListener('click', (e) => {
  if (e.target.classList[0] === 'audio-icon');
  e.target.childNodes[0].play();
});

function Disabled() {
  yesButton.disabled = true;
  setTimeout(() => { yesButton.disabled = false; }, 1000);
  noButton.disabled = true;
  setTimeout(() => { noButton.disabled = false; }, 1000);
  yesButton.disabled = true;
}

const GameAudio = document.querySelector('.game-audio');
const WrongAnswer = document.querySelector('.wrong-answer');
const CorrectAnswer = document.querySelector('.correct-answer');
const SoundIcon = document.querySelector('.sound-icon');
SoundIcon.addEventListener('click', () => {
	SoundIcon.classList.toggle('muted');
	WrongAnswer.muted = (WrongAnswer.muted) ? false : true;
	CorrectAnswer.muted = (CorrectAnswer.muted) ? false : true;
	GameAudio.muted = (GameAudio.muted) ? false : true;
});

const Word = document.querySelector(".word");
const AudioWord = document.querySelector(".audio-word_game");
Word.addEventListener('click', () => {
  AudioWord.play();
});

let counter = 4;
const GameAudioButton = document.querySelector(".game-audio_button");
GameAudioButton.addEventListener('click', () => {
	if(counter != 7) counter++;
	else counter = 1;
  GameAudio.src = `src/assets/audio/game_audio/${counter}.mp3`;
  GameAudio.play();
});