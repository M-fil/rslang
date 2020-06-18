function simpleShuffle() {
    return  Math.round(Math.random()) - 0.5;
}
function shuffle(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (array.length - i));

        let temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array.sort(()=>Math.random()-0.5);
}

  export {
    simpleShuffle,
    shuffle,
  };
  