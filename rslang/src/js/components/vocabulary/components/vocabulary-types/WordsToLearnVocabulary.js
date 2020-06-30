import { vocabularyConstants } from '../../pathes';
import MainVocabulary from './MainVocabulary';

const {
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

class WordsToLearnVocabulary extends MainVocabulary {
  constructor(words, dictionary) {
    super(WORDS_TO_LEARN_TITLE, words, dictionary);
  }
}

export default WordsToLearnVocabulary;
