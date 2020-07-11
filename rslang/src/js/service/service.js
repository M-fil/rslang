import { urls, errorTypes, HTTPCodesConstants } from '../constants/constants';

const {
  WORDS_DATA_URL,
  CREATE_USER_URL,
  LOGIN_USER_URL,
  GET_USER_URL,
  WORDS_DATA_URL_ADDITIONAL,
} = urls;

const {
  USER_ALREADY_EXISTS,
  INCORRECT_VALUES,
  USER_NOT_FOUND,
} = errorTypes;

const {
  HTTP_STATUS_200,
  HTTP_ERROR_404,
  HTTP_ERROR_417,
} = HTTPCodesConstants;

const getWords = async (page = 0, group = 0) => {
  const response = await fetch(`${WORDS_DATA_URL}page=${page}&group=${group}`);
  const data = await response.json();

  return data;
};

const getWordsAdditionalInfo = async (word) => {
  const response = await fetch(`${WORDS_DATA_URL_ADDITIONAL}${word}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      'x-rapidapi-key': 'bbfd4a02a1msh37e5e02afd1dafap13728ejsnfaf5795cd64b',
    },
  });

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

  if (rawResponse.status === HTTP_ERROR_417) {
    throw new Error(USER_ALREADY_EXISTS);
  }

  if (rawResponse.status !== HTTP_STATUS_200) {
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

  if (rawResponse.status === HTTP_ERROR_417) {
    throw new Error(USER_ALREADY_EXISTS);
  }

  if (rawResponse.status === HTTP_ERROR_404) {
    throw new Error(USER_NOT_FOUND);
  }

  if (rawResponse.status !== HTTP_STATUS_200) {
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

const saveUserData = async (id, token, body) => {
  let content = false;
  const response = await fetch(`${GET_USER_URL}${id}`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status === HTTP_STATUS_200) content = await response.json();
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

const getRefreshToken = async (userId, token) => {
  const rawResponse = await fetch(`${GET_USER_URL}${userId}/tokens`, {
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

  if (rawResponse.status === HTTP_STATUS_200) content = await rawResponse.json();
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

  if (rawResponse.status === HTTP_STATUS_200) content = await rawResponse.json();
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

  if (rawResponse.status === HTTP_STATUS_200) content = await rawResponse.json();
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

  if (rawResponse.status === HTTP_STATUS_200) content = await rawResponse.json();
  return content;
};

export {
  getWords,
  getWordsAdditionalInfo,
  createUser,
  loginUser,
  getUserById,
  saveUserData,
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
  getRefreshToken,
  updateUserStatistics,
  getUserStatistics,
};
