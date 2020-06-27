const urls = {
  WORDS_DATA_URL: 'https://afternoon-falls-25894.herokuapp.com/words?',
  CREATE_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users',
  LOGIN_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/signin',
  GET_USER_URL: 'https://afternoon-falls-25894.herokuapp.com/users/',
  WORDS_IMAGES_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  WORDS_AUDIOS_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  DEAFAULT_SPEAKIT_WORD_IMAGE_URL: 'https://raw.githubusercontent.com/rolling-scopes-school/m-fil-RS2020Q1/speakit/speakit/src/assets/english.jpg?token=ANOB63H6THJPRBEB42AFKMK67BOEW',
  CORRECT_AUDIO_PATH: './src/assets/audio/correct.mp3',
  INCORRECT_AUDIO_PATH: './src/assets/audio/error.mp3',
  SUCCESS_AUDIO_PATH: './src/assets/audio/success.mp3',
};

const wordsToLearnSelectConstants = {
  SELECT_TITLE: 'Какие слова учить?',
  SELECT_OPTION_LEARNED_WORDS: 'Уже изученные слова',
  SELECT_OPTION_WORDS_FROM_COLLECTIONS: 'Слова из коллекций',
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
  SPEAKIT_TITLE: 'SpeakIt',
  RESTART_BUTTON: 'Начать занаво',
  START_GAME_BUTTON: 'Начать игру',
  RESULTS_BUTTON: 'Результаты',
  GAME_COMPLEXITY: 'Сложность игры',
  DESCRIPTION_OF_LEVELS: '1 - самый легкий уровень; 6 - самый сложный',
  FILES_PATH: 'files/',
  START_GAME_DESCRIPTION_1: 'Нажимайте на слова, чтобы услышать их звучание.',
  START_GAME_DESCRIPTION_2: 'Нажмите на кнопку и произнесите слова в микрофон.',
  START_GAME_DESCRIPTION_3: 'Если у Вас не получается правильно произнести слово, то Вы можете нажать кнопку',
  START_GAME_DESCRIPTION_4: 'Тогда слово добавиться в список "Я не знаю" в статистике мини-игры',
  START_PAGE_BUTTON_TEXT: 'Старт',
  CORRECT_WORDS_TEXT: 'Я знаю',
  INCORRECT_WORDS_TEXT: 'Я не знаю',
  NEW_GAME_BUTTON: 'Новая Игра',
  SKIP_BUTTON: 'Пропустить',
  NUMBER_OF_GROUPS: 6,
  NUMBER_OF_PAGES: 29,
  WORDS_LIMIT_NUMBER: 10,
};

const settingsText = {
  title: 'Настройки',
  tabList: {
    mainGame: 'Main Game',
    dictionary: 'Dictionary',
    findapair: 'Find a pair Game',
  },
  form: {
    submitButton: 'Сохранить',
  },
  tabs: {
    mainGame: {
      maxCardsPerDay: 'Количество карточек в день',
      newCardsPerDay: 'Количество новых карточек в день',
      showTranslateWord: 'Отображать перевод',
      showWordMeaning: 'Отображать значение слова',
      showWordExample: 'Отображать пример со словом',
      showTranscription: 'Отображать транскрипцию',
      showImageAssociations: 'Отображать изображение',
      showButtonAgain: 'Отображать кнопку "Снова"',
      showButtonShowAnswer: 'Отображать кнопку "Показать ответ"',
      showButtonShowDelete: 'Отображать кнопку "Удалить"',
      showButtonShowHard: 'Отображать кнопку "Сложные"',
      showButtons: 'Отображать кнопки "Снова", "Легко", "Хорошо", "Трудно" для слов',
      showButtonShowEasy: 'Отображать кнопк "Легко"',
      mainIntervalEasy: 'Интервал повторения "Легко"',
      showButtonShowNormal: 'Отображать кнопку "Хорошо"',
      mainIntervalNormal: 'Интервал повторения "Хорошо"',
      showButtonShowDifficult: 'Отображать кнопку "Трудно"',
      mainIntervalDifficult: 'Интервал повторения "Трудно"',
    },
    dictionary: {
      audioExample: 'Отображать "Аудио пример"',
      translateWord: 'Отображать перевод',
      wordMeaning: 'Отображать значение слова',
      wordExample: 'Отображать пример со словом',
      transcription: 'Отображать транскрипцию',
      imageAssociations: 'Отображать изображение',
    },
    findapair: {
      delayBeforeClosingCard: 'Задержка при закрытии карточек',
      showCardsTextOnStart: 'Показывать текст карточек при старте игры',
      showingCardsTime: 'Время показа карточек',
    },
  },
};

export {
  urls,
  findAPairText,
  authenticationTexts,
  errorTypes,
  speakItConstants,
  wordsToLearnSelectConstants,
  settingsText,
};
