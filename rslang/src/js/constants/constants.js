const urls = {
  WORDS_DATA_URL: 'https://afternoon-falls-25894.herokuapp.com/words?',
  CREATE_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users',
  LOGIN_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/signin',
  GET_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users/',
  mainAudioPath: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/',
  correctSound: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/correct.mp3',
  errorSound: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/error.mp3',
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

const auditionGameVariables = {
  maxPages:29,
  maxGroups:5,
  possibleWordsAmount:5,
  Lives: 5,
  Rounds: 5,
  gameTitle: 'Аудиовызов',
  gameDescription: 'Тренировка улучшает восприятие английской речи на слух.',
  gameStartBtn: 'Начать',
  idkBtn: 'Не знаю',
  modalAlarm: 'Тренировка не закончена!',
  modalDesc: 'Если вы вернётесь к списку, ваши результаты не будут сохранены',
  close: 'Закрыть',
  cancel: 'Отмена',
  arrowSymbol: '&rarr;',
  checkMark: '<span>&#10004;</span>',
  noun: 'noun',
  correct: 'correct',
  fail: 'fail',
  statist: 'Статистика',
  know: 'Знаю',
  errors: 'Ошибок',
  IDK: 'IDK',
  zeroPercent: '0%',
  Enter: 'Enter',
  bg: ['bg1', 'bg2', 'bg3', 'bg4'],
  digits: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'],
};
export {
  urls,
  auditionGameVariables,
  findAPairText,
  authenticationTexts,
  errorTypes,
};
