import { urls, errorTypes } from '../constants/constants';

const {
  WORDS_DATA_URL,
  CREATE_USER_URL,
  LOGIN_USER_URL,
  GET_USER_URL,
} = urls;

const {
  USER_ALREADY_EXISTS,
  ERROR_417,
  ERROR_404,
  INCORRECT_VALUES,
  STATUS_200,
  USER_NOT_FOUND,
} = errorTypes;

const getWords = async (page = 0, group = 0) => {
  const response = await fetch(`${WORDS_DATA_URL}page=${page}&group=${group}`);
  const data = await response.json();

  return data;
};

const createUser = async (user) => {
  const rawResponse = await fetch(CREATE_USER_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (rawResponse.status === ERROR_417) {
    throw new Error(USER_ALREADY_EXISTS);
  }

  if (rawResponse.status !== STATUS_200) {
    throw new Error(INCORRECT_VALUES);
  }

  const content = await rawResponse.json();
  return content;
};

const loginUser = async (user) => {
  const rawResponse = await fetch(LOGIN_USER_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (rawResponse.status === ERROR_417) {
    throw new Error(USER_ALREADY_EXISTS);
  }

  if (rawResponse.status === ERROR_404) {
    throw new Error(USER_NOT_FOUND);
  }

  if (rawResponse.status !== STATUS_200) {
    throw new Error(INCORRECT_VALUES);
  }

  const content = await rawResponse.json();
  return content;
};

const getUserById = async (id, token) => {
  const response = await fetch(`${GET_USER_URL}${id}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const content = await response.json();
  return content;
};

const createUserWord = async (userId, wordId, word, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });

  const content = await rawResponse.json();
  return content;
};

const getUserWord = async (userId, wordId, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const content = await rawResponse.json();
  return content;
};

const getAllUserWords = async (userId, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/words`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const content = await rawResponse.json();
  return content;
};

const updateUserWord = async (userId, wordId, word, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/words/${wordId}`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });

  const content = await rawResponse.json();
  return content;
};

const removeUserWord = async (userId, wordId, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/words/${wordId}`, {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const content = await rawResponse.json();
  return content;
};

const getAggregatedWordsByFilter = async (
  userId, token, wordsPerPage, filter = '{"userWord":null}',
) => {
  const rawResponse = await fetch(
    `${GET_USER_URL}${userId}/aggregatedWords?wordsPerPage=${wordsPerPage}&filter=${filter}`,
    {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  const content = await rawResponse.json();
  return content;
};

const updateStatistics = async (userId, token, body) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/statistics`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const content = await rawResponse.json();
  return content;
};

const getStatistics = async (userId, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/statistics`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const content = await rawResponse.json();
  return content;
};

const setUserSettings = async (userId, token, body) => {
  let content = false;
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/settings`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (rawResponse.status === 200) content = await rawResponse.json();
  return content;
};

const getUserSettings = async (userId, token) => {
  let content = false;
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/settings`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (rawResponse.status === 200) content = await rawResponse.json();
  return content;
};

const updateUserStatistics = async (userId, token, body) => {
  let content = false;
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/statistics`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (rawResponse.status === 200) content = await rawResponse.json();
  return content;
};

const getUserStatistics = async (userId, token) => {
  let content = false;
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/statistics`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (rawResponse.status === 200) content = await rawResponse.json();
  return content;
};

export {
  getWords,
  createUser,
  loginUser,
  getUserById,
  createUserWord,
  getUserWord,
  getAllUserWords,
  updateUserWord,
  removeUserWord,
  getAggregatedWordsByFilter,
  updateStatistics,
  getStatistics,
  setUserSettings,
  getUserSettings,
  updateUserStatistics,
  getUserStatistics,
};
