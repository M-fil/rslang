import {
  estimateButtonsTypes,
  vocabularyConstants,
} from '../constants/constants';

import {
  createUserWord,
  updateUserWord,
} from '../service/service';

const {
  GOOD, HARD, EASY,
} = estimateButtonsTypes;

const {
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

const getDaysIntervalByEstimation = (estimation, mainSettings) => {
  const {
    intervalEasy,
    intervalNormal,
    intervalDifficult,
  } = mainSettings;

  switch (estimation) {
    case EASY:
    default:
      return intervalEasy
    case GOOD:
      return intervalNormal
    case HARD:
      return intervalDifficult
  }
}

const createWordDataForBackend = (
  currentWord, estimation, vocabulary = WORDS_TO_LEARN_TITLE, mainSettings,
) => {
  const daysInterval = getDaysIntervalByEstimation(estimation, mainSettings);
  const wordData = {
    id: currentWord.id || currentWord._id,
    word: currentWord.word,
    difficulty: estimation.text || GOOD.text,
    vocabulary: vocabulary || WORDS_TO_LEARN_TITLE,
    daysInterval,
    valuationDate: new Date(),
    allData: currentWord,
  };
  const {
    id: wordId, word, difficulty, valuationDate, allData,
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
  vocabularyType = WORDS_TO_LEARN_TITLE, buttonType = GOOD.text,
  wordToAdd, userData, mainSettings,
) => {
  const { userId, token } = userData;
  try {
    const data = await createWordDataForBackend(wordToAdd, buttonType, vocabularyType, mainSettings);
    await updateUserWord(userId, data.optional.wordId, data, token);
  } catch (error) {
    const data = await createWordDataForBackend(wordToAdd, buttonType, vocabularyType, mainSettings);
    await createUserWord(userId, data.optional.wordId, data, token);
  }
};

export {
  addWordToTheVocabulary,
  createWordDataForBackend,
};
