import { vocabularyConstants } from '../../pathes';
import ExtraVocabulary from './ExtraVocabulary';

const {
  REMOVED_WORDS_TITLE,
} = vocabularyConstants;

class RemovedWords extends ExtraVocabulary {
  constructor(words, dictionary) {
    super(REMOVED_WORDS_TITLE, words, dictionary);
  }
}

export default RemovedWords;
