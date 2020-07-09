const MAIN_CONTAINER = document.querySelector('.main-container');
const AUTH_CONTAINER = document.querySelector('.authorization-container');
function Close() {
	MAIN_CONTAINER.classList.add('none');
	AUTH_CONTAINER.classList.remove('none');
}