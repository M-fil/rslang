import { vocabularyConstants } from '../../pathes';
import ExtraVocabulary from './ExtraVocabulary';

const {
  REMOVED_WORDS_TITLE,
} = vocabularyConstants;

class RemovedWords extends ExtraVocabulary {
  constructor(words) {
    super(REMOVED_WORDS_TITLE, words);
  }
}

export default RemovedWords;
