import create  from '../../../utils/сreate';
import {getWords} from '../../../service/service'
import {getWordsAdditionalInfo} from '../../../service/service'
import {simpleShuffle}  from '../../../utils/shuffle';
import {shuffle}  from '../../../utils/shuffle';

export default class GameDataService{
     async mapping(){
        const data = await getWords(Math.floor(Math.random() * Math.floor(29)),0);
        const shuffledValue = data.sort(simpleShuffle);
        const  body  = document.querySelector('body');
        const container = create('div','container','',body);
        const game = create('div','game','',container);
        const mainWord = create('div','audioPulse',/*shuffledValue[0].word*/'',game);
        const answers = create('div','answers','',game);
        const nextBtn=create('button','nextBtn','Не знаю',game);
        const arr = [];
        const array1 = [];
        for(let i=0; i<shuffledValue.length-1; i++){
         const test = await getWordsAdditionalInfo(shuffledValue[i].word);
         const partOfSpeech = test.results!==undefined ? test?.results[0]?.partOfSpeech : "IDK";
         array1.push({word: shuffledValue[i].word, translate:shuffledValue[i].wordTranslate,audio:shuffledValue[i].audio,partOfSpeech:partOfSpeech})
        }
        const a=array1.filter((word)=>word.partOfSpeech==="noun");
        const arrTest=a.slice(0,5);
        console.log("FULLARRAY",array1);
        console.log("SliceARRAY",arrTest);
       /* for(let i=0; i<5; i++){
           arr.push({word: array1[i].word, translate:array1[i].wordTranslate,audio:array1[i].audio})
        }*/
        const mainWordToAsk=arrTest[0];
        const array = shuffle(arrTest);
       /* const test = await getWordsAdditionalInfo(mainWordToAsk.word)
        console.log(test?.results[0]?.partOfSpeech);*/
        return {mainWordToAsk:mainWordToAsk,array:array};
    }
    
    
}

