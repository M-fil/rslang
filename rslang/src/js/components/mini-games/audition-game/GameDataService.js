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
    const wordsInfo = [];
    if (
      this.vocabulary?.length >= auditionGameVariables.possibleWordsAmount
      && this.collection === wordsToLearnSelectConstants.SELECT_OPTION_LEARNED_WORDS_VALUE
      && this.collectionLength
    ) {
      this.shuffledValue = this.vocabulary.sort(simpleShuffle);
    } else {
      this.data = await getWords(Math.floor(Math.random() * Math.floor(auditionGameVariables.maxPages)), this.group);
      this.shuffledValue = this.data.sort(simpleShuffle);
    }

    for (let i = 0; i < this.shuffledValue.length - 1; i += 1) {
      const test = await getWordsAdditionalInfo(this.shuffledValue[i].word);
      const partOfSpeech = test.results ? test?.results[0]?.partOfSpeech : auditionGameVariables.IDK;
      if (this.shuffledValue[i]?.wordTranslate) {
        wordsInfo.push({
          word: this.shuffledValue[i].word, wordTranslate: this.shuffledValue[i].wordTranslate, audio: this.shuffledValue[i].audio, partOfSpeech, image: this.shuffledValue[i].image, id: this.shuffledValue[i].id,
        });
      } else if (this.shuffledValue[i]?.translate) {
        wordsInfo.push({
          word: this.shuffledValue[i].word, wordTranslate: this.shuffledValue[i].wordTranslate, audio: this.shuffledValue[i].audio, partOfSpeech, image: this.shuffledValue[i].image, id: this.shuffledValue[i].id,
        });
      }
    }

    const filteredWordsInfo = wordsInfo.filter((word) => word.partOfSpeech === auditionGameVariables.noun);
    const possibleAnswers = filteredWordsInfo.slice(0, auditionGameVariables.possibleWordsAmount);
    const mainWordToAsk = possibleAnswers[0];
    if (this.vocabulary.length >= auditionGameVariables.possibleWordsAmount && this.collection === wordsToLearnSelectConstants.SELECT_OPTION_LEARNED_WORDS_VALUE && this.collectionLength) {
      const index = this.vocabulary.indexOf(mainWordToAsk);
      this.vocabulary.splice(index, 1);
    }
    const shuffledPossibleAnswers = shuffle(possibleAnswers);

    return { mainWordToAsk, array: shuffledPossibleAnswers };
  }
}
