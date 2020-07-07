const MAIN_URL = 'https://afternoon-falls-25894.herokuapp.com/';

const urls = {
  WORDS_DATA_URL: `${MAIN_URL}words?`,
  CREATE_USER_URL: `${MAIN_URL}users`,
  LOGIN_USER_URL: `${MAIN_URL}signin`,
  GET_USER_URL: `${MAIN_URL}users/`,
  GET_PAINTING: (way) => `https://raw.githubusercontent.com/Shnyrkevich/rslang_data_paintings/master/${way}`,
  WORDS_IMAGES_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  WORDS_AUDIOS_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  STAT_IMAGE_AUDIO: './src/assets/images/statistica_sound.png',
  DEAFAULT_SPEAKIT_WORD_IMAGE_URL: './src/assets/images/speak-it-base-word-image.jpg',
  CORRECT_AUDIO_PATH: './src/assets/audio/correct.mp3',
  SUCCESS_AUDIO_PATH: './src/assets/audio/success.mp3',
};

const savannahConstants = {
  SAVANNAH_SECONDS_COUNT: 3,
  GAME_NAME: 'Саванна',
  RULES: 'Тренировка Саванна развивает словарный запас. За каждые изученные 5 слов, ты повышаешь количество жизней в игре.',
  START_BUTTON: 'Начать',
  LAST_NUMBER: 1,
  MAX_PAGE: 29,
  MAX_WORDS_LINE: 4,
  RANDOM_WORDS: 3,
  LIVES: 5,
  MIN_VOCABULARY_WORDS: 20,
  END_ANIMATION: 6000,
  FRAME: 24,
  DIVIDER: 20,
  ADD_LIVES: 5,
  PLUS_LIVE: '+1 &#9829',
  AUDIO_TICKING: './src/assets/audio/clock_ticking_loop.mp3',
  AUDIO_CORRECT: './src/assets/audio/correct.mp3',
  AUDIO_ERROR: './src/assets/audio/error.mp3',
  AUDIO_BONUS: './src/assets/audio/bonus.mp3',
  LIVES_IMAGE_BLACK: './src/assets/images/heart_black.png',
  LIVES_IMAGE_INHERIT: './src/assets/images/heart_inherit.png',
  MAX_WORDS: 20,
  mainAudioPath: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/',
  correctSound: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/correct.mp3',
  errorSound: 'https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/error.mp3',
  WORDS_DATA_URL_ADDITIONAL:'https://wordsapiv1.p.rapidapi.com/words/',
};

const authenticationConstants = {
  AUTHORIZATION_TITLE: 'Авторизация',
  REGISTRATION_TITLE: 'Регистрация',
  PASSWORD_LABEL_TEXT: 'пароль',
  EMAIL_LABEL_TEXT: 'email',
  NAME_LABEL_TEXT: 'Имя',
  LOGIN_BUTTON_TEXT: 'Войти',
  REGISTER_BUTTON_TEXT: 'Создать',
  AUTHORIZATION_KEY: 'authorization',
  REGISTRATION_KEY: 'registration',
  MAX_NAME_LENGTH: 30,

};

const wordsToLearnSelectConstants = {
  SELECT_TITLE: 'Какие слова учить?',
  SELECT_OPTION_LEARNED_WORDS: 'Уже изученные слова',
  SELECT_OPTION_WORDS_FROM_COLLECTIONS: 'Слова из коллекций',
  SELECT_OPTION_LEARNED_WORDS_VALUE: 'LEARNED_WORDS',
  SELECT_OPTION_WORDS_FROM_COLLECTIONS_VALUE: 'WORDS_FROM_COLLECTIONS',
  SELECT_GROUP_TITLE: 'Выберите группу сложности',
  SELECT_GROUP_OPTIONS_TITLE_LIST: [
    'Группа 1',
    'Группа 2',
    'Группа 3',
    'Группа 4',
    'Группа 5',
    'Группа 6',
  ],

};

const errorTypes = {
  EMPTY_FIELD: 'Имя, почта и пароль должны быть заполнены.',
  INCORRECT_VALUES: 'Поля заполнены неверно.',
  PASSWORD_REQUIRMENTS: 'Пароль должен содержать не менее 8 символов, как минимум одну прописную букву, одну заглавную букву, одну цифру и один спецсимвол',
  INCORRECT_EMAIL: 'email введен неверно.',
  USER_ALREADY_EXISTS: 'пользователь с такими данными уже существует',
  USER_IS_NOT_AUTHORIZED: 'Пользователь не авторизирован',
  USER_NOT_FOUND: 'Такого пользователя не существует. Пожалуйста, проверьте введенные данные.',
  EXCEEDED_NAME_LENGTH: 'Длина поля "Имя" не должна превышать 30 символов',
};

const HTTPCodesConstants = {
  HTTP_STATUS_200: 200,
  HTTP_ERROR_404: 404,
  HTTP_ERROR_417: 417,
};

const mainGameConstants = {
  REMOVE_WORD_BUTTON: 'Удалить',
  ADD_TO_DIFFICULT_WORDS: 'Добавить в сложные',
  ADD_TO_DIFFICULT_WORDS_CLICKED: 'Добавлено',
  REMOVE_WORD_BUTTON_CLICKED: 'Удалено',
  NEXT_BUTTON: 'Дальше',
  CONTINUE_BUTTON: 'Продолжить',
  SHOW_ANSWER_BUTTON: 'Показать ответ',
  SETTINGS_AUTOPLABACK_TEXT: 'Автопроизношение',
  SETTINGS_TRANSLATIONS_LABEL_TEXT: 'Показывать переводы слова и предложений',
  WORDS_TYPES_SELECT_TITLE: 'Как изучать слова?',
  EMPTY_WORD_LIST: 'Данный список слов пуст.',
  DAILY_NORM_IS_COMPLETED: 'Поздравляем, дневная норма слов выполнена! На сегодня слов для изучения больше нет.',
  NUMBER_OF_WORD_GROUPS: 6,
  NUMBER_OF_WORD_PAGES: 30,
  HIGHEST_PERCENTAGE_STRING: '100%',
  DAYS_CONTRACTION: 'дн',
};

const dailyStatisticsConstants = {
  TITLE: 'Серия завершена',
  COMPLETED_CARDS_TEXT: 'Карточек завершено',
  CORRECT_ANSWERS_PERCENTAGE_TEXT: 'Процент правильных ответов',
  NEW_WORDS_TEXT: 'Новые слова',
  LONGEST_SERIES_OF_ANSWERS_TEXT: 'Саммая длинная серия правильных ответов',
  GO_TO_THE_MAIN_PAGE: 'Перейти на главную',
  DIFFICULT_WORDS_TITLE_TEXT: 'Поздравляем! Вы повторили все сложные слова!',
  DIFFICULT_WORDS_COUNT_TEXT: (count) => `Всего сложных слов: ${count}.`,
  REVISE_DIFFICULT_WORDS_AGAIN: 'Повторить еще раз',
};

const wordsToLearnOptions = {
  MIXED: 'Вперемешку',
  ONLY_NEW_WORDS: 'Только новые слова',
  ONLY_WORDS_TO_REPEAT: 'Только слова для повторения',
  ONLY_DIFFICULT_WORDS: 'Только сложные слова',
};

const estimateButtonsTypes = {
  AGAIN: {
    text: 'Снова',
  },
  HARD: {
    text: 'Трудно',
  },
  GOOD: {
    text: 'Хорошо',
  },
  EASY: {
    text: 'Легко',
  },
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
  CONTINUE_BUTTON: 'Продолжить',
  SKIP_BUTTON: 'Пропустить',
  GROUPS_OF_WORDS_TEXT: 'Группа слов:',
  NUMBER_OF_GROUPS: 6,
  NUMBER_OF_PAGES: 29,
  WORDS_LIMIT_NUMBER: 10,
  NOT_ENOUGHT_WORDS: 'Недостаточно слов',
};

const vocabularyConstants = {
  NUMBER_OF_WORDS_TEXT: 'Всего слов',
  LEARNED_WORDS_TITLE: 'Выученные слова',
  WORDS_TO_LEARN_TITLE: 'Слова для изучения',
  REMOVED_WORDS_TITLE: 'Удаленные слова',
  DIFFUCULT_WORDS_TITLE: 'Сложные слова',
  NEW_WORDS_TITLE: 'Новые слова',
  RESTORE_BUTTON_TEXT: 'Восстановить',
  EMPTY_VOCABULARY_MESSAGE: 'Словарь пуст.',
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
      delayBeforeClosingCard: 'Задержка при закрытии карточек (с)',
      showCardsTextOnStart: 'Показывать текст карточек при старте игры',
      showingCardsTime: 'Время показа карточек (с)',
    },
  },
};

const statisticsText = {
  tabtitels: {
    shortterm: 'Краткосрочная',
    longterm: 'Долгосрочная',
  },
  gametitles: {
    maingame: 'Main Game',
    savannah: 'Savanna',
    findapair: 'Find a pair',
    auditiongame: 'Audition',
    sprint: 'Sprint',
    speakit: 'Speak It',
    englishpuzzle: 'English Puzzle',
  },
  select: {
    game: 'Игра',
    date: 'Дата',
  },
  texts: {
    learnedWords: 'Изучено новых слов',
    playingCount: 'Сыграно игр',
    correctAnswers: 'Правильны ответов',
    wrongAnswers: 'Ошибок',
  },
};

const StatisticsGameCodes = {
  MAIN_GAME_CODE: 'maingame',
  SAVANNA_GAME_CODE: 'savannah',
  FIND_A_PAIR_GAME_CODE: 'findapair',
  AUDITION_GAME_CODE: 'auditiongame',
  SPRINT_GAME_CODE: 'sprint',
  SPEAK_IT_GAME_CODE: 'speakit',
  ENGLISH_PUZZLE_GAME_CODE: 'englishpuzzle',
};

const modalConstants = {
  MODAL_TITLE: 'Тренировка не закончена!',
  MODAL_WARNING: 'Если вы вернетесь к списку, ваш прогресс не будет сохранен',
  CLOSE_BUTTON: 'Всё равно закрыть',
  CANCEL_BUTTON: 'Отмена',
};

const shortTermStatisticsConstants = {
  ERROR_STAT: 'Ошибок',
  CORRECT_STAT: 'Знаю',
  STAT_TITLE: 'Статистика',
  STAT_CLOSE: 'Закрыть',
};

const auditionGameVariables = {
  maxPages: 29,
  maxGroups: 5,
  possibleWordsAmount: 5,
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

const startWindow = {
  START_BUTTON: 'Начать',
  GO_TO_MAIN_PAGE_BUTTON: 'На главную',
};

const mainPageHeaderConstants = {
  STATISTICS_BUTTON_TEXT: 'Статистика',
  VOCABULARY_BUTTON_TEXT: 'Словарь',
  PROMO_BUTTON_TEXT: 'Промо',
  ABOUT_TEAM_TEXT: 'О Команде',
  STATISTICS_CODE: 'STATISTICS_CODE',
  VOCABULARY_CODE: 'VOCABULARY_CODE',
  PROMO_CODE: 'PROMO_CODE',
  ABOUT_TEAM_CODE: 'ABOUT_TEAM_CODE',
  SETTINGS_CODE: 'SETTINGS_CODE',
};

const gamesInfo = {
  mainGame: {
    code: 'MAIN_GAME_CODE',
    title: 'Основная игра',
    description: '',
  },
  savannah: {
    code: 'SAVANNAH_CODE',
    title: 'Саванна',
    description: '',
  },
  speakIt: {
    code: 'SPEAKIT_CODE',
    title: 'SpeakIt',
    description: '',
  },
  findAPair: {
    code: 'FINDAPAIR_CODE',
    title: 'Найди пару',
    description: '',
  },
  sprint: {
    code: 'SPRINT_CODE',
    title: 'Спринт',
    description: '',
  },
  audioGame: {
    code: 'AUDIOGAME_CODE',
    title: 'Аудиовызов',
    description: '',
  },
  englishPuzzle: {
    code: 'ENGLISH_PUZZLE_CODE',
    title: 'English Puzzle',
    description: '',
  },
};

const mainPageConstants = {
  GAME_TITLE_TEXT: 'Выберите чем хотите заниматься:',
};

export {
  urls,
  savannahConstants,
  auditionGameVariables,
  findAPairText,
  authenticationConstants,
  errorTypes,
  speakItConstants,
  mainGameConstants,
  estimateButtonsTypes,
  wordsToLearnOptions,
  vocabularyConstants,
  dailyStatisticsConstants,
  settingsText,
  statisticsText,
  StatisticsGameCodes,
  wordsToLearnSelectConstants,
  modalConstants,
  shortTermStatisticsConstants,
  startWindow,
  HTTPCodesConstants,
  mainPageHeaderConstants,
  gamesInfo,
  mainPageConstants,
};
