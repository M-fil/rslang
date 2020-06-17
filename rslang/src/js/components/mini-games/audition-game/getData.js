import {getWords} from '../../../service/service'
export default class getWordsData{
    async getObj(){
    const resp = await getWords(0,0);
        console.log(resp);
        return resp;
    }
}