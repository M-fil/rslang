import 'babel-polyfill';
import '../scss/style.scss';
import SprintGame from './components/mini-games/sprint/Sprint';

const sprint = new SprintGame();
sprint.SprintRender();

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  sprint.GameBegin();
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
		Disabled()
});

const restartButton = document.querySelector('.restart-button');
	restartButton.addEventListener('click', () => {
	  sprint.ClearGameData();
});

document.addEventListener('keydown', function(e) {
	console.log(e.target.key);
	if(e.key == 'ArrowRight') {
		if (window.answer) sprint.Correct();
		else sprint.Incorrect();
		sprint.GetWordData();
	}
	if(e.key == 'ArrowLeft') {
		if (!window.answer) sprint.Correct();
		else sprint.Incorrect();
		sprint.GetWordData();
	}
});

function Disabled() {
	yesButton.disabled = true;
	setTimeout(function() { yesButton.disabled = false }, 1000);
	noButton.disabled = true;
	setTimeout(function() { noButton.disabled = false }, 1000);
	yesButton.disabled = true;
}