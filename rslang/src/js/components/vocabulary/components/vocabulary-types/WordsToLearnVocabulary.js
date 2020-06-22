import { vocabularyConstants } from '../../pathes';
import MainVocabulary from './MainVocabulary';

const {
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

class WordsToLearnVocabulary extends MainVocabulary {
  constructor(words) {
    super(WORDS_TO_LEARN_TITLE, words);
  }
}

export default WordsToLearnVocabulary;
