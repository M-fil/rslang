const urls = {
  WORDS_DATA_URL: 'https://afternoon-falls-25894.herokuapp.com/words?',
  WORDS_AUDIOS_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
};

const savannahConstants = {
  SAVANNAH_SECONDS_COUNT: 3,
  RULES: 'Тренировка Саванна развивает словарный запас. Чем больше слов ты знаешь, тем больше очков опыта получишь.',
  START_BUTTON: 'Начать',
  LAST_NUMBER: 1,
  MAX_PAGE: 29,
  MODAL_TITLE: 'Тренировка не закончена!',
  MODAL_WARNING: 'Если вы вернетесь к списку, ваши требования не будут сохранены',
  CLOSE_BUTTON: 'Закрыть',
  CANCEL_BUTTON: 'Отмена',
  RANDOM_WORDS: 3,
  LIVES: 5,
  END_ANIMATION: 6500,
  FRAME: 24,
  DIVIDER: 20,
  ADD_LIVES: 5,
  ERROR_STAT: 'Ошибок',
  CORRECT_STAT: 'Знаю',
  STAT: 'Статистика',
  PLUS_LIVE: '+1 &#9829',
  AUDIO_CORRECT: './src/assets/audio/correct.mp3',
  AUDIO_ERROR: './src/assets/audio/error.mp3',
  AUDIO_BONUS: './src/assets/audio/bonus.mp3',
  STAT_IMAGE_AUDIO: './src/assets/images/statistica_sound.png',
  LIVES_IMAGE_BLACK: './src/assets/images/heart_black.png',
  LIVES_IMAGE_INHERIT: './src/assets/images/heart_inherit.png',
  MAX_WORDS: 20,
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

export {
  urls,
  savannahConstants,
  findAPairText,
  authenticationTexts,
  errorTypes,
};
