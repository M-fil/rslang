import GameService from './GameService';
import create  from '../../../utils/сreate';

export default class AuditionGame{
   
    render(){
        const gS = new GameService('toasty');
        const gameServ = new GameService('toast');
        gameServ.init();
        gameServ.compare(gS);
    }
}
const  body  = document.querySelector('body');
const container = create('div','container','test',body);
console.log(container);
   
    console.log("wqrq!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    