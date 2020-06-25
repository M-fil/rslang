import {
  estimateButtonsTypes,
  vocabularyConstants,
} from '../constants/constants';

import {
  createUserWord,
  updateUserWord,
} from '../service/service';

const {
  HARD, 
} = estimateButtonsTypes;

const {
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

const createWordDataForBackend = (
  currentWord, estimation, vocabulary = WORDS_TO_LEARN_TITLE,
) => {
  const wordData = {
    id: currentWord.id || currentWord._id,
    word: currentWord.word,
    difficulty: estimation.text || GOOD.text,
    vocabulary: vocabulary || WORDS_TO_LEARN_TITLE,
    daysInterval: estimation.daysInterval,
    valuationDate: new Date(),
    allData: currentWord,
  };
  const {
    id: wordId, word, difficulty, daysInterval, valuationDate, allData,
  } = wordData;
  const dataToRecieve = {
    difficulty,
    optional: {
      wordId,
      word,
      daysInterval,
      vocabulary,
      valuationDate: valuationDate.toString(),
      allData: JSON.stringify(allData),
    },
  };

  return dataToRecieve;
};

const addWordToTheVocabulary = async (
  vocabularyType = WORDS_TO_LEARN_TITLE, buttonType = HARD.text, wordToAdd, userData,
) => {
  const { userId, token } = userData;
  try {
    const data = await createWordDataForBackend(wordToAdd, buttonType, vocabularyType);
    await updateUserWord(userId, wordToAdd.id, data, token);
  } catch (error) {
    const data = await createWordDataForBackend(wordToAdd, buttonType, vocabularyType);
    await createUserWord(userId, wordToAdd.id, data, token);
  }
};

export {
  addWordToTheVocabulary,
  createWordDataForBackend,
};
