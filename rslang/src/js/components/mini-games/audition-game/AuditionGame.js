import GameService from './GameService';
import StartGameScreen from './StartGameScreen'


export default class AuditionGame{
   
    render(start,lives){
        const gameServ = new GameService();
    if(lives>0){
      if(start===true){
        const gameStartScreen= new StartGameScreen();
        const gameStartButton=gameStartScreen.createStartScreen();
        gameStartButton.addEventListener('click',async() => {
            document.querySelector('.startScreen').classList.toggle('hide');
            gameServ.init(lives);
        });
    }
        else{
            console.log("lives:",lives);
            gameServ.init(lives);
        }
    }
    else{
        document.querySelector('.startScreen').classList.toggle('hide');}
}
}
/*window.onload=()=>{
document.querySelector('.gameStartButton').addEventListener("click",(event)=>{
    document.querySelector('.startScreen').classList.toggle('hide');
    const gS = new GameService('toasty');
    const gameServ = new GameService('toast');
    gameServ.init();
    gameServ.compare(gS);
    });
}*/