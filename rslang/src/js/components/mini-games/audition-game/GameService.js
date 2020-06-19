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
            const element = create('div','element',`${i+1}.${arr[i].translate}`,answers);
        }
        const audio = new Audio(`https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/${mainWord.audio}`);
        audio.play();
        document.querySelector('.answers').addEventListener('click',(event)=>{
            const AG=new AuditionGame();
            
        if(event.target.classList.contains("element") && !event.target.classList.contains('unchecked')&& !event.target.classList.contains('checked')){
                const nextBtn=document.querySelector('.nextBtn');
                nextBtn.innerHTML='&rarr;';
                event.target.classList.toggle('checked');
                const elements=document.querySelectorAll('.element');
                for(let i=0;i<elements.length;i++){
                    if(!elements[i].classList.contains("checked"))
                    elements[i].classList.add("unchecked");
                }
        if(event.target.innerText.includes(mainWord.translate)){
            event.target.innerHTML="<span>&#10004;</span>"+ event.target.innerText;
            const audio1 = new Audio("https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/correct.mp3");
        audio1.play();
       
    
        nextBtn.addEventListener('click',()=>{
        AG.render(false,lives);
        document.querySelector('.container').remove();
        });
        
        }
        else{
            const audio1 = new Audio("https://raw.githubusercontent.com/KirillZhdanov/rslang-data/master/files/error.mp3");
            audio1.play();
            event.target.classList.toggle('line-through');
            
           // const nextBtn=create('button','element','&rarr;',document.querySelector('.game'));
            nextBtn.addEventListener('click',()=>{
            AG.render(false,--lives);
            document.querySelector('.container').remove();
            });
        }
    }
    });
    document.querySelector('.nextBtn').addEventListener('click',(event)=>{
        if(event.target.innerText==="Не знаю")
        audio.play();
    });
    }
    compare(obj){
        console.log(this.word === obj.word);
        return this.word === obj.word;
    }
}
