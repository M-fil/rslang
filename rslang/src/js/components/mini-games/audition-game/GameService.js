import MapAndShuffle from './MapAndShuffle';
import getWordsData from './getData'
import create  from '../../../utils/сreate';

function shuffle(array) {
    console.log("12412412",array);
    const a = [];
    for(let i=0;i<array.length;i++){
        a.push(array[i]);
    }
    console.log("NOTshufled",a);
    array.sort(()=>Math.random()-0.5);
    console.log("shufled",array);
    const test2=shPlease(array);
    console.log("test2",test2);
    return test2;
}
function shPlease(array){
    const shuffledArr = array;
    let length = shuffledArr.length;
    let buffer;
    let index;
  
    while (length) {
      length -= 1;
      index = Math.floor(Math.random() * length);
      buffer = shuffledArr[length];
      shuffledArr[length] = shuffledArr[index];
      shuffledArr[index] = buffer;
    }
  
    return shuffledArr;
}

export default class GameService{
    constructor(word){
        this.word=word;
     }
    async init(){
        const response = new getWordsData();
        const data = await response.getObj();
        const mp = new MapAndShuffle();
        const array= await mp.mapping(data);
        console.log("arrray",array);
        const arr = shuffle(array); 
        const answers = document.querySelector('.answers');
        for(let i=0; i<5; i++){
            const element = create('div','element',array[i].translate,answers);
        }
        for(let i=0; i<5; i++){
            const element = create('div','element',arr[i].translate,answers);
        }
       // console.log("array:",array);
        
       // console.log("arr:",arr);
        //console.log(array.sort(()=>Math.round(Math.random()) - 0.5))
        const audio = new Audio(`https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/${array[0].audio}`);
        audio.play();
    }
    compare(obj){
        console.log(this.word === obj.word);
        return this.word === obj.word;
    }
}
