const MAIN_URL = 'https://afternoon-falls-25894.herokuapp.com/';
const urls = {
  WORDS_DATA_URL: `${MAIN_URL}words?`,
  CREATE_USER_URL: `${MAIN_URL}users`,
  LOGIN_USER_URL: `${MAIN_URL}signin`,
  GET_USER_URL: `${MAIN_URL}users/`,
  WORDS_IMAGES_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  WORDS_AUDIOS_URL: 'https://raw.githubusercontent.com/M-fil/rslang-data/master/',
  STAT_IMAGE_AUDIO: './src/assets/images/statistica_sound.png',
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
  STAT_IMAGE_AUDIO: './src/assets/images/statistica_sound.png',
};

const startWindow = {
  START_BUTTON: 'Начать',
  GO_TO_MAIN_PAGE_BUTTON: 'На главную',
};

const sprint = {
  START_TIMER: 5,
  GAME_RULES: 'Лео-спринт – скоростная тренировка. За 60 секунд надо угадывать, правильный ли перевод предложен к английскому слову.<br>Допфункционал: за 12 подряд правильно угаданных слов даётся +5 секунд к таймеру игры.',
  POWER1: 1,
  POWER2: 2,
  POWER3: 4,
  POWER4: 8,
  CORRECT1: 4,
  CORRECT2: 8,
  CORRECT3: 12,
  BONUS_ANSWERS: 12,
  BONUS_TIME: 5,
  RIGHT_ANSWER: '✓',
  GAME_TIMER: 60,
  SCORE: 'Ваш счёт: ',
  CORRECT_ANSWERS: 'Знаю ',
  INCORRECT_ANSWERS: 'Ошибок ',
  EXIT_ANSWER: 'Вы, действительно, хотите вернуться в меню игры?',
};

export {
  urls,
  findAPairText,
  authenticationConstants,
  errorTypes,
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
  sprint,
};
