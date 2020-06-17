import GameService from './GameService';
import StartGameScreen from './StartGameScreen'


export default class AuditionGame{
   
    render(){
        const gameStartScreen= new StartGameScreen();
        const gameStartButton=gameStartScreen.createStartScreen();
        const gS = new GameService('toasty');
        const gameServ = new GameService('toast');
        gameStartButton.addEventListener('click',() => {
           document.querySelector('.startScreen').classList.toggle('hide');
           
           gameServ.init();
          // gameServ.compare(gS);
        });
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