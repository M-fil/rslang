import { urls } from '../constants/constants';

const {
  WORDS_DATA_URL,
} = urls;

const getWords = async (page = 0, group = 0) => {
  const response = await fetch(`${WORDS_DATA_URL}page=${page}&group=${group}`);
  const data = await response.json();

  return data;
};
const getWordsAdditionalInfo = async (word) => {
  const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
		"x-rapidapi-key": "bbfd4a02a1msh37e5e02afd1dafap13728ejsnfaf5795cd64b"
	}
});
const data = await response.json();
console.log(data);
return data;
}
export {
  getWords,
  getWordsAdditionalInfo,
};
