import create, { urls } from '../../pathes';

const {
  WORDS_IMAGES_URL,
} = urls;

class VocabularyItem {
  constructor(
    id, word, wordTranslate, transcription,
    textMeaning, textExample, image, vocabularyType,
    settings,
  ) {
    this.HTML = null;
    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.transcription = transcription;
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.image = image;
    this.vocabularyType = vocabularyType;
    this.settings = settings;

    this.audioElement = new Audio();
  }

  render() {
    const {
      showWordMeaning,
      showWordExample,
      showImageAssociations,
    } = this.settings;

    this.HTML = create(
      'div', 'vocabulary__word-item', '', null,
      ['vocabularyWordId', this.id], ['vocabularyType', this.vocabularyType],
    );

    const mainHTML = this.renderMainContent();
    const sentencesBlock = create('div', 'word-item__sentences', '', this.HTML);
    if (showWordMeaning) {
      create('div', 'word-item__sentence', this.textMeaning, sentencesBlock);
    }
    if (showWordExample) {
      create('div', 'word-item__sentence', this.textExample, sentencesBlock);
    }
    create('div', 'word-item__main-container', [mainHTML, sentencesBlock], this.HTML);

    if (showImageAssociations) {
      const imageBlock = create('div', 'word-item__image-block', '', this.HTML);
      const imageSrc = `${WORDS_IMAGES_URL}${this.image}`;
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        imageBlock.style.backgroundImage = `url(${imageSrc})`;
      };
    }

    return this.HTML;
  }

  renderMainContent(settings = this.settings) {
    const {
      showAudioExample,
      showTranslateWord,
      showTranscription,
    } = settings;
    if (showAudioExample) {
      const volumeIcon = create('i', 'fas fa-volume-up word-item__icon');
      create('div', 'word-item__audio', volumeIcon, this.HTML);
    }

    const translationText = showTranslateWord ? `- ${this.wordTranslate}` : '';
    const mainHTML = create('div', 'word-item__main');
    const mainInfoHTML = create('div', 'word-item__main-info', '', mainHTML);
    create('div', 'word-item__word', `${this.word} ${translationText}`, mainInfoHTML);
    if (showTranscription) {
      create('div', 'word-item__transcription', this.transcription, mainInfoHTML);
    }

    return mainHTML;
  }
}

export default VocabularyItem;
