import { urls } from '../constants/constants';

const {
  WORDS_DATA_URL,
} = urls;

const getWords = async (page = 0, group = 0) => {
  const response = await fetch(`${WORDS_DATA_URL}page=${page}&group=${group}`);
  const data = await response.json();

  return data;
};

export default getWords;
