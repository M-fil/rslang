export default function shuffle(array, requiredLenth) {
  const shuffledArr = array;
  let length = shuffledArr.length;
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
