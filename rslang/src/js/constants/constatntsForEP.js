const START_WINDOW = {
  title: 'ENGLISH PUZZLE',
  description: 'Нажимайте на слова, собирайте фразы. Слова могут быть перетянуты. \nВыберайте подсказки. После угаданного предложения используйте бонус.',
  startButton: 'Старт',
};

const RESULT_FORM = {
  buttonName: 'Продолжить',
  statusTitle: ['Я знаю', 'Я не знаю'],
};

const GAME_BLOCK = {
  game: 'englishPuzzle',
  langEn: 'en-US',
  level: 'Уровень',
  page: 'Страница',
  gameButtons: ['Я не знаю', 'Проверить', 'Продолжить', 'Результат', 'Повторить', 'Бонус'],
  gameLevels: 6,
  gamePages: 30,
  controlButtons: 2,
  gameZoneRows: 10,
};

const ERROR_CONTENT = {
  getDataError: 'Неудачная попытка получить слова',
};

const PUZZLE_PROPERTIES = {
  extraWidthValue: 10,
  fontFamily: 'Arial',
  fontRatio: 1,
  fontType: 'bold',
  borderPuzzle: 1,
  shadowPuzzle: 2,
  borderText: 1,
  shadowText: 10,
  colorBorder: 'rgb(0,255,250)',
  colorShadowBorder: 'rgb(255,255,250)',
  colorText: 'magenta',
  colorShadowText: 'black',
  solidTextColor: 'white',
  fontStyle: 'fillText',
};

export {
  START_WINDOW,
  GAME_BLOCK,
  RESULT_FORM,
  ERROR_CONTENT,
  PUZZLE_PROPERTIES,
};
