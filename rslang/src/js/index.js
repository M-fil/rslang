import 'babel-polyfill';
import '../scss/style.scss';
import App from './components/app/App';
import Statistics from './components/statistics/Statistics';
import AuditionGame from './components/mini-games/audition-game/AuditionGame';
import { auditionGameVariables } from './constants/constants';

const app = new App();
app.run();
/*const audition = new AuditionGame();
audition.render(auditionGameVariables.Lives,auditionGameVariables.Rounds);*/

/*const user = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZmNlZGJmMjM3ODBlMDAxNzQ4N2MyYSIsImlhdCI6MTU5MzcxMTAxMSwiZXhwIjoxNTkzNzI1NDExfQ.ffkTcQtdTj6BvZnHiG9wbZ1cxgr_kK0IcjJ76bdnuSM',
  userId: '5efcedbf23780e0017487c2a',
  };
const stat = new Statistics(user);
stat.init();
setTimeout(()=>{
  stat.getLearnedWordsByDate();
  stat.getCharts();
  //stat.saveGameStatistics('maingame',222,30,143);
},5000);*/
