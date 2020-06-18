import GameDataService from './GameDataService';
import create  from '../../../utils/сreate';
import AuditionGame from './AuditionGame'

export default class GameService{
    constructor(word){
        this.word=word;
     }
    async init(lives){
        const mp = new GameDataService();
        const data= await mp.mapping();
        const answers = document.querySelector('.answers');
        const arr= data.array;
        const  mainWord = data.mainWordToAsk;
      
       
        for(let i=0; i<5; i++){
            const element = create('div','element',arr[i].translate,answers);
        }
        const audio = new Audio(`https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/${mainWord.audio}`);
        audio.play();
        document.querySelector('.answers').addEventListener('click',(event)=>{
            if(event.target.classList.contains("element")){
        if(event.target.innerText===mainWord.translate){
            const audio1 = new Audio("https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/correct.mp3");
        audio1.play();
        const AG=new AuditionGame();
        AG.render(false,lives);
        document.querySelector('.container').remove();
        }
        else{
            const audio1 = new Audio("https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/error.mp3");
            audio1.play();
            const AG=new AuditionGame();
            AG.render(false,--lives);
            document.querySelector('.container').remove();
        }
    }
    });
    }
    compare(obj){
        console.log(this.word === obj.word);
        return this.word === obj.word;
    }
}
