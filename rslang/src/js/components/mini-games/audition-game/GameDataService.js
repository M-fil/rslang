import create  from '../../../utils/сreate';
import {getWords} from '../../../service/service'
import {simpleShuffle}  from '../../../utils/shuffle';
import {shuffle}  from '../../../utils/shuffle';

export default class GameDataService{
     async mapping(){
        const data = await getWords(0,0);
        const shuffledValue = data.sort(simpleShuffle);
        const  body  = document.querySelector('body');
        const container = create('div','container','',body);
        const game = create('div','game','',container);
        const mainWord = create('div','audioPulse',/*shuffledValue[0].word*/'',game);
        const answers = create('div','answers','',game);
        const arr =[];
        for(let i=0; i<5; i++){
           arr.push({word: shuffledValue[i].word, translate:shuffledValue[i].wordTranslate,audio:shuffledValue[i].audio})
        }
        const mainWordToAsk=arr[0];
        const array = shuffle(arr);
        
        return {mainWordToAsk:mainWordToAsk,array:array};
    }
    
    
}

