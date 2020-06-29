import 'babel-polyfill';
import '../scss/style.scss';

import App from './components/app/App';
import ShortTermStatistics from './components/mini-games/common/ShortTermStatistics';

const app = new App();
app.run();
const wrong = ['invite', 'love', 'cat'];
const right = ['boat', 'arrive', 'breackfast'];
const short = new ShortTermStatistics();
short.render(wrong, right);
