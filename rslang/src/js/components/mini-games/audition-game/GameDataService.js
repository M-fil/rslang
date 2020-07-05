import create from '../../../utils/сreate';
import { getWords, getWordsAdditionalInfo } from '../../../service/service';
import { simpleShuffle, shuffle } from '../../../utils/shuffle';
import { auditionGameVariables, vocabularyConstants } from '../../../constants/constants';
//import Vocabulary from  '../../vocabulary/Vocabulary'

export default class GameDataService {
  constructor(vocabulary){
    this.vocabulary = vocabulary;  
  }
  async mapping(currentRound, isMuted) {
    const curr = currentRound <= auditionGameVariables.maxGroups && currentRound > 0 ? currentRound - 1 : Math.floor(Math.random() * Math.floor(auditionGameVariables.maxGroups));
   // await this.vocabulary.init();
    //const tst =  this.vocabulary;//.getWordsByVocabularyType(vocabularyConstants.LEARNED_WORDS_TITLE,  true); 
    const wordsInfo = [];
  console.log( this.vocabulary);
    if( this.vocabulary?.length >= 5 &&  this.vocabulary[0]?.audio){
      this.shuffledValue =  this.vocabulary.sort(simpleShuffle);
     // alert('1');
    }
    else {
      this.data = await getWords(Math.floor(Math.random() * Math.floor(auditionGameVariables.maxPages)), curr);
     // alert('2');
    this.shuffledValue = this.data.sort(simpleShuffle);
  
    for (let i = 0; i < this.shuffledValue.length - 1; i += 1) {
      const test = await getWordsAdditionalInfo(this.shuffledValue[i].word);
      const partOfSpeech = test.results ? test?.results[0]?.partOfSpeech : auditionGameVariables.IDK;
      if (this.shuffledValue[i]?.wordTranslate) {
        wordsInfo.push({
          word: this.shuffledValue[i].word, translate: this.shuffledValue[i].wordTranslate, audio: this.shuffledValue[i].audio, partOfSpeech, image: this.shuffledValue[i].image, id: this.shuffledValue[i].id,
        });
      }
    }
   }
    //console.log('wordsINFO:',wordsInfo);
    const filteredWordsInfo = wordsInfo.length > 0 ? wordsInfo.filter((word) => word.partOfSpeech === auditionGameVariables.noun):this.vocabulary;
    const possibleAnswers = filteredWordsInfo.slice(0, auditionGameVariables.possibleWordsAmount);
    const mainWordToAsk = possibleAnswers[0];
    if(this.vocabulary.length >= auditionGameVariables.possibleWordsAmount){
    const index = this.vocabulary.indexOf(mainWordToAsk);
    this.vocabulary.splice(index,1);
    }
    const shuffledPossibleAnswers = shuffle(possibleAnswers);
    console.log({ mainWordToAsk, array: shuffledPossibleAnswers});
    return { mainWordToAsk, array: shuffledPossibleAnswers};
  }
}
