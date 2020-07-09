import { mainGameConstants } from '../constants/constants';

const {
  NUMBER_OF_WORD_PAGES,
} = mainGameConstants;

const getRandomInteger = (min = 0, max = NUMBER_OF_WORD_PAGES - 1) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export default getRandomInteger;
