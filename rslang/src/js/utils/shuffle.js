function simpleShuffle() {
    return  Math.round(Math.random()) - 0.5;
}
function shuffleAudition(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (array.length - i));

        let temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array.sort(()=>Math.random()-0.5);
}
  
function shuffle(array, requiredLenth) {
  const shuffledArr = array;
  let { length } = shuffledArr;
  let buffer;
  let index;

  while (length) {
    length -= 1;
    index = Math.floor(Math.random() * length);
    buffer = shuffledArr[length];
    shuffledArr[length] = shuffledArr[index];
    shuffledArr[index] = buffer;
  }

  return (requiredLenth) ? shuffledArr.slice(0, requiredLenth) : shuffledArr;
}
export {
  simpleShuffle,
  shuffle,
  shuffleAudition,
};
