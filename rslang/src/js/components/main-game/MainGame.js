import WordCard from './components/word-card/WordCard';
import { getWords } from '../../service/service'; 

class MainGame {
  constructor() {}

  async render() {
    const words = await getWords();
    console.log(words);
  }
};

export default MainGame;