import { vocabularyConstants } from '../../pathes';

import ExtraVocabulary from './ExtraVocabulary';

const {
  DIFFUCULT_WORDS_TITLE,
} = vocabularyConstants;

class DifficultWordsVocabulary extends ExtraVocabulary {
  constructor(words, dictionary) {
    super(DIFFUCULT_WORDS_TITLE, words, dictionary);
  }
}

export default DifficultWordsVocabulary;
