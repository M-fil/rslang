import { vocabularyConstants } from '../../pathes';
import MainVocabulary from './MainVocabulary';

const {
  LEARNED_WORDS_TITLE,
} = vocabularyConstants;

class LearnedWordsVocabulary extends MainVocabulary {
  constructor(words) {
    super(LEARNED_WORDS_TITLE, words);
  }
}

export default LearnedWordsVocabulary;
