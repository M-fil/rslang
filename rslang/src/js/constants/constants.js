const MAIN_URL = 'https://afternoon-falls-25894.herokuapp.com/';
const urls = {
  WORDS_DATA_URL: `${MAIN_URL}words?`,
  CREATE_USER_URL: `${MAIN_URL}users`,
  LOGIN_USER_URL: `${MAIN_URL}signin`,
  GET_USER_URL: `${MAIN_URL}users/`,
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
  LONGEST_SERIES_OF_ANSWERS_TEXT: 'Самая длинная серия правильных ответов',
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

const progressLearningConstants = {
  NEXT_TIME_OF_REVISE_TEXT: 'Будет повторяться снова:',
};

const shortTermStatisticsConstants = {
  ERROR_STAT: 'Ошибок',
  CORRECT_STAT: 'Знаю',
  STAT_TITLE: 'Статистика',
  STAT_CLOSE: 'Закрыть',
};

const startWindow = {
  START_BUTTON: 'Начать',
  GO_TO_MAIN_PAGE_BUTTON: 'На главную',
};

const aboutTeam = {
  TEAM: 'Наша команда',
  BACK_BUTTON: '<i class="fas fa-long-arrow-alt-left"></i>',
  GITHUB: '<i class="fab fa-github"></i>',
  VK: '<i class="fab fa-vk"></i>',
  LINKEDIN: '<i class="fab fa-linkedin"></i>',
  NAME_FILANOVICH: 'Максим Филанович',
  NAME_LATUSHKINA: 'Екатерина Латушкина',
  NAME_ANTONOV: 'Максим Антонов',
  NAME_ZHDANOV: 'Кирилл Жданов',
  NAME_ANDREEV: 'Антон Андреев',
  NAME_SHNIRKEVICH: 'Евгений Шныркевич',
  GIT_FILANOVICH: 'https://github.com/M-fil',
  VK_FILANOVICH: 'https://vk.com/m__fil',
  LINKEDIN_FILANOVICH: 'https://www.linkedin.com/in/maxim-filanovich-a890111a2/',
  GIT_LATUSHKINA: 'https://github.com/kate-latushkina',
  VK_LATUSHKINA: 'https://vk.com/katya_latushkina',
  LINKEDIN_LATUSHKINA: 'https://www.linkedin.com/in/ekaterina-latushkina-7009b719b/',
  GIT_ANTONOV: 'https://github.com/BoL4oNoK',
  VK_ANTONOV: 'https://vk.com/bol4onok',
  LINKEDIN_ANTONOV: 'https://www.linkedin.com/in/maxim-antonov-a6127a68/',
  GIT_ZHDANOV: 'https://github.com/KirillZhdanov',
  VK_ZHDANOV: 'https://vk.com/zh_kiri',
  LINKEDIN_ZHDANOV: 'https://www.linkedin.com/in/кирилл-жданов-a79865152/',
  GIT_ANDREEV: 'https://github.com/toxAndreev',
  VK_ANDREEV: 'https://vk.com/toxandreev80',
  LINKEDIN_ANDREEV: 'https://www.linkedin.com/in/%D0%B0%D0%BD%D1%82%D0%BE%D0%BD-%D0%B0%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2-1635701b2/',
  GIT_SHNIRKEVICH: 'https://github.com/Shnyrkevich',
  VK_SHNIRKEVICH: 'https://vk.com/zendos1',
  LINKEDIN_SHNIRKEVICH: 'https://www.linkedin.com/in/zheny-shnyrkevich-0466b6174/',
  PHOTO_FILANOVICH: './src/assets/images/about-team/filanovich.jpg',
  PHOTO_LATUSHKINA: './src/assets/images/about-team/latushkina.jpg',
  PHOTO_ANTONOV: './src/assets/images/about-team/antonov.jpg',
  PHOTO_ZHDANOV: './src/assets/images/about-team/zhdanov.png',
  PHOTO_ANDREEV: './src/assets/images/about-team/andreev.png',
  PHOTO_SHNIRKEVICH: './src/assets/images/about-team/shnirkevich.png',
  WORK_FILANOVICH: `${'<i class="fas fa-user-edit"></i>'}  Авторизация/Регистрация${'<br>'}
  ${'<i class="fas fa-home"></i>'}  Главная страница приложения${'<br>'}
  ${'<i class="fas fa-gamepad"></i>'}  Основная игра${'<br>'}
  ${'<i class="fas fa-info"></i>'}  Методика интервального повторения${'<br>'}
  ${'<i class="fas fa-microphone-alt"></i>'}  Мини-игра SpeakIt${'<br>'}
  ${'<i class="fas fa-book"></i>'}  Словарь${'<br>'}
  ${'<i class="far fa-address-card"></i>'}  Описание для страницы «Промо»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для страниц: мини-игра SpeakIt, Главная страница приложения, Основная игра`,
  WORK_LATUSHKINA: `${'<i class="fas fa-paw"></i>'}  Мини-игра «Саванна»${'<br>'}
  ${'<i class="fas fa-network-wired"></i>'}  Общие элементы для мини-игр: модальные окна, краткосрочная статистика, стартовая страница${'<br>'}
  ${'<i class="fas fa-angle-double-down"></i>'}  Прелоудер для всего приложения${'<br>'}
  ${'<i class="far fa-address-card"></i>'}  Описание для страницы «Промо»${'<br>'}
  ${'<i class="fas fa-film"></i>'}  Видео для страницы «Промо»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для страниц: «Промо», «О Команде», мини-игра «Саванна»${'<br>'}
  ${'<i class="fas fa-user-friends"></i>'}  Страница «О Команде»`,
  WORK_ANTONOV: `${'<i class="fas fa-crosshairs"></i>'}  Мини-игра «Найди пару» («Своя игра»)${'<br>'}
  ${'<i class="fas fa-cog"></i>'}  Настройки${'<br>'}
  ${'<i class="far fa-chart-bar"></i>'}  Логика для страницы «Статистика»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для страниц: Настройки, Статистика, мини-игра «Найди пару».
  `,
  WORK_ZHDANOV: `${'<i class="fas fa-headset"></i>'}  Мини-игра «Аудиовызов»${'<br>'}
  ${'<i class="fas fa-chart-line"></i>'}  Графики для страницы «Статистика»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для страниц: Статистика, мини-игра «Аудиовызов»
  `,
  WORK_ANDREEV: `${'<i class="fas fa-stopwatch-20"></i>'}  Мини-игра «Спринт»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для мини-игры «Спринт» и Авторизации/Регистрации
  `,
  WORK_SHNIRKEVICH: `${'<i class="fas fa-puzzle-piece"></i>'}  Мини-игра «English Puzzle»${'<br>'}
  ${'<i class="fas fa-paint-brush"></i>'}  Дизайн и адаптив для мини-игры «English Puzzle» и страницы «Словарь»${'<br>'}
  ${'<i class="fas fa-palette"></i>'}  Стили и адптив для общих элементов мини-игр
  `,
};

const promoPage = {
  PROMO_VIDEO: 'https://www.youtube.com/embed/1XuOFg4p83o',
  IMG_CHICKEN1: './src/assets/images/promo/chick1.svg',
  IMG_CHICKEN2: './src/assets/images/promo/chick2.svg',
  IMG_CHICKEN3: './src/assets/images/promo/chick4_1.svg',
  IMG_CHICKEN4: './src/assets/images/promo/chick4_2.svg',
  BACK_BUTTON: '<i class="fas fa-long-arrow-alt-left"></i>',
  ADVANTAGES: 'Особенности и преимущества приложения',
  ADVANTAGES_TEXT: `Возможно ли изучать английский язык не в формате привычных скучных уроков?
  Однозначно - да. Для этого и предназначено данное приложение. 
  Благодаря методам и формам приложения, изучать английский язык становится весело и интересно. 
  Наши игры помогут Вам с лёгкостью выучить слова, а статистика покажет Ваш прогресс.`,
  VOCABULARY: 'Словарь',
  VOCABULARY_TEXT: `В приложении RSLANG слова сортируются по нескольким группам, которые называются «словарями». 
  Их всего 4 вида: «Слова для изучения», «Выученные слова», «Удаленные слова», «Сложные слова».${'<br>'}
  •	Слова для изучения – здесь собраны слова, которые пользователь будет изучать на текущей либо ближайшей тренировках.${'<br>'}
  •	Выученные слова – набор слов, которые пользователь угадал с 1-го раза в основной игре.${'<br>'}
  •	Удаленные слова – слова, которые пользователь решил снять с изучения. Все удаленные слова можно восстановить, добавив их в словарь «Слова для изучения». ${'<br>'}
  •	Сложные слова – список слов, который у пользователя вызывает затруднения в изучении. Данные слова можно изучать отдельно от остальных. ${'<br>'}
  Для этого в Основной игре нужно всего лишь выбрать пункт «Только сложные слова» в раскрывающемся списке «Какие слова изучать?».
  `,
  INTERVAL: 'Методика интервального повторения',
  INTERVAL_TEXT: `В приложении реализована «методика интервального повторения», которая позволяет пользователю не забывать уже изученные слова.
  Интервалы повторения зависят от 4-х кнопок в Основной игре приложения. После того, как слово угадано, пользователю предлагается оценить слово. 
  Есть 4 варианта: «Снова», «Трудно», «Хорошо» и «Легко». 
  После нажатие на кнопку «Снова» слово появится в изучении на текущей тренировке. 
  Для последних 3-х вариантов имеются свои интервалы времени, спустя которые слово появляется в тренировке. 
  Интервалы повторения пользователь может изменять в настройках, что дает ему возможность подстроить изучение слов под себя.
  `,
  SETTING: 'Настройки',
  SETTING_TEXT: 'Здесь указаны настройки, которые пользователь может индивидуально настроить для себя. Например, функции «транскрипция» поможет правильно произносить слова, функция «значение слова» отобразит наиболее существенные признаки и явления, помогающие отличить одно слово, от другого.',
  STATISTICS: 'Статистика',
  STATISTICS_TEXT: `В приложении представлены 2 типа статистики: краткосрочная и долгосрочная${'<br>'}
  ${'<u>'}Краткосрочная${'</u>'} – выводится с результатами после каждой игры. В ней пользователь может посмотреть, 
  сколько он угадал слов и сколько он сделал ошибок, что дает ему возможность оценить свои знания и способности в изучении языка. 
  Также в краткосрочной статистике можно воспроизвести аудио для каждого слова, которое присутствовало в сыгранном раунде игры. 
  Это позволяет пользователю улучшить произношение трудных для него слов. ${'<br>'}
  ${'<u>'}Долгосрочная${'</u>'} – выводит статистику за весь период обучения и по каждой игре. 
  Данная статистика позволяет пользователю отслеживать его прогресс с самого начала изучения языка в нашем приложении. 
  Также для визуализации прогресса используется график. Благодаря ему пользователь сможет увидеть свою динамику в изучении языка. 
  `,
  GAMES: 'Мини-игры',
  SPEAKIT: 'SpeakIt',
  SPEAKIT_TEXT: `На экране отображается слово, которое пользователь должен произнести. 
  Если пользователь произносит указанное на экране слово правильно, оно подсвечивается зеленым цветом. 
  Игра заканчивается, когда пользователь полностью угадал все слова, изображенные на экране.${'<br>'}
  ${'<u>'}Дополнительно:${'</u>'} В случае, если у пользователя пока не получается произнести слово, то он может нажать на кнопку «Пропустить», 
  которая появляется при наведении курсором на слово. После нажатия данной кнопки слово останется в группе слов «Я не знаю». 
  Затем пользователь может прослушать произношение не угаданного слова в краткосрочной статистике либо в режиме тренировки мини-игры SpeakIt, 
  чтобы впоследствии улучшить свое произношение.`,
  PUZZLE: 'English puzzle',
  PUZZLE_TEXT: `Игра заключается в сборе паззла: из множества слов в одно предложение. 
  Само предложение можно услышать в формате аудио, нажав на кнопку проигрывания предложения или увидев его перевод. 
  Слова можно как перетягивать на основной экран, так и кликать по ним и они автоматически попадут на основной экран. 
  Пользователь может выбрать уровень сложности и раунд игры. ${'<br>'}
  ${'<u>'}Дополнительно:${'</u>'} Если пользователь собрал целое предложение без ошибок, 
  то ему дается возможность автоматической подставки одного слова на правильное место в последующих предложениях.`,
  SAVANNAH: 'Саванна',
  SAVANNAH_TEXT: `Отображается английское слово и 4 варианта возможного перевода, где только 1 вариант является верным. 
  Пользователь должен выбрать свой ответ до того, как английское слово достигнет определенной границы (слово «плывет», спускаясь сверху вниз). 
  На это отведено 6 секунд. Как только слово достигает границы (как только английское слово опускается ниже русских слов) ответ засчитывается 
  как неправильный и происходит переход к новому слову. Слово можно выбрать 2мя способами: кликая по нему мышкой или нажатием на определенную
   цифру на клавиатуре (на словах указаны эти данные). Игроку дано 5 жизней, при неправильном ответе отнимается 1 жизнь. ${'<br>'}
   ${'<u>'}Дополнительно:${'</u>'} В ходе игры жизни можно получить с помощью 5 правильных ответов подряд. 
   Игра заканчивается, когда все жизни закончились или когда пользователь прошел раунд (1 раунд = 20 слов)`,
  AUDIO: 'Аудиовызов',
  AUDIO_TEXT: `Звучит произношение слова на английском языке. 
  Пользователь выбирает правильный перевод слова из пяти предложенных вариантов ответа. Слова можно угадывать, 
  выбирая их как кликами мышкой, так и нажатием кнопок клавиатуры, переход к следующему вопросу происходит как при клике по стрелке, 
  так и нажатием клавиши Enter. ${'<br>'}
  ${'<u>'}Дополнительно:${'</u>'} Убрать 2 неправильных перевода. Данная подсказка появляется в игре 1 раз и только после того, как пользователь угадал 5 слов подряд.`,
  SPRINT: 'Спринт',
  SPRINT_TEXT: `Пользователь видит 2 слова: английское и предполагаемый вариант перевода на русский язык. В игре нужно указать:  
  принадлежит ли данный перевод этому слову. Продолжительность раунда 1 минута (есть индикация времени), 
  в начале игры за каждое угаданное слово начисляется 10 баллов, каждые четыре правильных ответа подряд увеличивают количество баллов 
  за каждое угаданное слово вдвое, при ошибке за угаданное слово снова начисляется только 10 баллов. Слова можно угадывать, выбирая их как 
  кликами мышкой, так и нажатием стрелок на клавиатуре.${'<br>'}
  ${'<u>'}Дополнительно:${'</u>'} Если пользователь угадал 12 слов подряд, то время увеличивается на 5 секунд.
  `,
  FIND_PAIR: 'Найди пару',
  FIND_PAIR_TEXT: `Эта игра заключается в поиске пары для слова: на странице есть 20 карточек, все они изначально закрыты, карточка 
  переворачивается по клику на нее, пользователю нужно кликая по карточкам найти английское слово и его перевод. 
  На прохождение игры дается 90 секунд. 
  Игра заканчивается, когда вышло время или когда пользователь угадал все карточки до истечения указанного времени.`,
};

export {
  urls,
  savannahConstants,
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
  aboutTeam,
  progressLearningConstants,
  promoPage,
};
