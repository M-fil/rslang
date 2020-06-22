import create, { urls } from '../../pathes';

const {
  WORDS_IMAGES_URL,
} = urls;

class VocabularyItem {
  constructor(
    id, word, wordTranslate, transcription,
    textMeaning, textExample, image,
  ) {
    this.HTML = null;
    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.transcription = transcription;
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.image = image;

    this.audioElement = new Audio();
  }

  render() {
    this.HTML = create('div', 'vocabulary__word-item', '', null, ['vacabularyWordId', this.id]);

    const volumeIcon = create('i', 'fas fa-volume-up word-item__icon');
    create('div', 'word-item__audio', volumeIcon, this.HTML);

    const mainHTML = create('div', 'word-item__main', this.HTML);
    const mainInfoHTML = create('div', 'word-item__main-info', mainHTML);
    create('div', 'word-item__word', `${this.word} - ${this.wordTranslate}`, mainInfoHTML);
    create('div', 'word-item__transcription', this.transcription, mainInfoHTML);

    const sentencesBlock = create('div', 'word-item__sentences', '', this.HTML);
    create('div', 'word-item__sentence', this.textMeaning, sentencesBlock);
    create('div', 'word-item__sentence', this.textExample, sentencesBlock);

    const imageBlock = create('div', 'word-item__image-block', '', this.HTML);
    imageBlock.style.backgroundImage = `url(${WORDS_IMAGES_URL}${this.image})`;

    return this.HTML;
  }
}

export default VocabularyItem;
