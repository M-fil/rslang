import create  from '../../../utils/сreate';
export default class MapAndShuffle{
     async mapping(obj){
        const data = await obj;
        const val = data.sort(shuffle);
        //console.log(knuthShuffle(data));
        //console.log("val:"+val[0].word);
        const  body  = document.querySelector('body');
        const container = create('div','container','',body);
        const game = create('div','game','',container);
        const mainWord = create('div','mainWord',val[0].word,game);
        const answers = create('div','answers','',game);
        const arr =[];
        for(let i=0; i<5; i++){
            //const el = create('div','element',val[i].word,answers);
            arr.push({word: val[i].word, translate:val[i].wordTranslate,audio:val[i].audio})
        }
        console.log(arr);
        return arr;
        //console.log(container);
    }
    
    
}
function shuffle() {
    return  Math.round(Math.random()) - 0.5;
}
