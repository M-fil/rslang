const urls = {
  WORDS_DATA_URL: 'https://afternoon-falls-25894.herokuapp.com/words?',
  CREATE_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users',
  LOGIN_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/signin',
  GET_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users/',
};

const authenticationTexts = {
  AUTHORIZATION_TITLE: 'Авторизация',
  REGISTRATION_TITLE: 'Регистрация',
  PASSWORD_LABEL_TEXT: 'пароль',
  EMAIL_LABEL_TEXT: 'email',
  LOGIN_BUTTON_TEXT: 'Войти',
  REGISTER_BUTTON_TEXT: 'Создать',
};

const errorTypes = {
  EMPTY_FIELD: 'Пароль и почта должны быть заполнены.',
  INCORRECT_VALUES: 'Поля заполнены неверно.',
  PASSWORD_REQUIRMENTS: 'Пароль должен содержать не менее 8 символов, как минимум одну прописную букву, одну заглавную букву, одну цифру и один спецсимвол',
  INCORRECT_EMAIL: 'email введен неверно.',
  ERROR_417: 417,
  USER_ALREADY_EXISTS: 'пользователь с такими данными уже существует',
};

const findAPairText = {
  startButton: 'Начать игру',
  level: 'Уровень',
  about: 'За 90 секунд необходимо найти все пары между карточками с английскими словами и их переводом на русский язык.',
  findedpairs: 'Найдено пар',
  pauseButton: 'Пауза',
  onPauseButton: 'Возобновить',
  startAgainButton: 'Начать снова',
  remainSec: 'Осталось времени',
  findCards: 'Найдено пар (всего)',
  resultText: 'Раунд завершен',
  nextLevel: 'Уровень игры',
  newGameButton: 'Сыграть снова',
};

const speakItConstants = {
  RESTART_BUTTON: 'Начать занаво',
  START_GAME_BUTTON: 'Начать игру',
  RESULTS_BUTTON: 'Результаты',
  GAME_COMPLEXITY: 'Сложность игры',
  DESCRIPTION_OF_LEVELS: '1 - самый легкий уровень; 6 - самый сложный',
  FILES_PATH: 'files/',
  START_GAME_DESCRIPTION_1: 'Нажимайте на слова, чтобы услышать их звучание.',
  START_GAME_DESCRIPTION_2: 'Нажмите на кнопку и произнесите слова в микрофон.',
  START_PAGE_BUTTON_TEXT: 'Старт',
  CORRECT_WORDS_TEXT: 'Я знаю',
  INCORRECT_WORDS_TEXT: 'Я не знаю',
  NEW_GAME_BUTTON: 'Новая Игра',
};

export {
  urls,
  findAPairText,
  authenticationTexts,
  errorTypes,
  speakItConstants,
};
