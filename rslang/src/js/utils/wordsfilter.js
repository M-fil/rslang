export default function wordsFilter(array) {
  return array.filter((word) => word.word !== word.wordTranslate);
}
