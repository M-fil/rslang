import { getWords, getWordsAdditionalInfo } from '../../../service/service';
import { simpleShuffle, shuffle } from '../../../utils/shuffle';
import { auditionGameVariables, wordsToLearnSelectConstants } from '../../../constants/constants';

export default class GameDataService {
  constructor(vocabulary, collection, group, collectionLengthEnough) {
    this.vocabulary = vocabulary;
    this.collection = collection;
    this.group = group;
    this.collectionLength = collectionLengthEnough;
  }

  async mapping() {
    this.wordsInfo = [];
    if (this.vocabulary?.length >= auditionGameVariables.possibleWordsAmount
      && this.collection === wordsToLearnSelectConstants.SELECT_OPTION_LEARNED_WORDS_VALUE
      && this.collectionLength
    ) {
      this.shuffledValue = await this.mappingHelper(this.vocabulary.sort(simpleShuffle));
    } else {
      this.data = await getWords(
        Math.floor(Math.random() * Math.floor(auditionGameVariables.maxPages)),
        this.group,
      );
      this.shuffledValue = await this.mappingHelper(this.data.sort(simpleShuffle));
    }

    const filteredWordsInfo = this.wordsInfo
      .filter((word) => word.partOfSpeech === auditionGameVariables.noun);
    const possibleAnswers = filteredWordsInfo.slice(0, auditionGameVariables.possibleWordsAmount);
    const mainWordToAsk = possibleAnswers[0];
    if (this.vocabulary?.length >= auditionGameVariables.possibleWordsAmount
      && this.collection === wordsToLearnSelectConstants.SELECT_OPTION_LEARNED_WORDS_VALUE
      && this.collectionLength
    ) {
      const index = this.vocabulary.indexOf(mainWordToAsk);
      this.vocabulary.splice(index, 1);
    }
    const shuffledPossibleAnswers = shuffle(possibleAnswers);

    return { mainWordToAsk, array: shuffledPossibleAnswers };
  }

  async mappingHelper(toShuffle) {
    const size = toShuffle.length >= 30 ? 30 : toShuffle.length - 1;
    for (let i = 0; i < size; i += 1) {
      if (toShuffle[i]?.partOfSpeech) {
        this.partOfSpeech = toShuffle[i].partOfSpeech;
      } else {
        const test = await getWordsAdditionalInfo(toShuffle[i].word);
        this.partOfSpeech = test.results
          ? test?.results[0]?.partOfSpeech
          : auditionGameVariables.IDK;
      }
      if (toShuffle[i]?.wordTranslate) {
        toShuffle[i].partOfSpeech = this.partOfSpeech;
        this.wordsInfo.push(toShuffle[i]);
      }
    }
  }
}
