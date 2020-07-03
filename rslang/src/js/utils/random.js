export default function getRandomInteger(min = 0, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
