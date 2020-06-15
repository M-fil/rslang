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
};

export {
  urls,
  authenticationTexts,
  errorTypes,
};
