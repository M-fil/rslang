export default class GameService{
    constructor(word){
        this.word=word;
        console.log(1,this.word);
    }
    init(){
        console.log("testInit");
    }
    compare(obj){
        console.log(this.word === obj.word);
        return this.word === obj.word;
    }
}