import create, { urls, vocabularyConstants } from '../../pathes';
import LearningProgress from './LearningProgress';

const {
  WORDS_IMAGES_URL,
} = urls;

const {
  WORDS_TO_LEARN_TITLE,
} = vocabularyConstants;

class VocabularyItem {
  constructor(
    id, word, wordTranslate, transcription,
    textMeaning, textExample, image, nextTimeOfReivise,
    vocabularyType, settings,
  ) {
    this.HTML = null;
    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.transcription = transcription;
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.image = image;
    this.nextTimeOfReivise = nextTimeOfReivise;
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

    this.additionalContent = create('div', 'word-item__additional-data');
    const mainHTML = this.renderMainContent();

    this.HTML = create(
      'div', 'vocabulary__word-item', [mainHTML, this.additionalContent], null,
      ['vocabularyWordId', this.id], ['vocabularyType', this.vocabularyType],
    );

    const sentencesBlock = create('div', 'word-item__sentences');
    if (showWordMeaning) {
      create('div', 'word-item__sentence', this.textMeaning, sentencesBlock);
    }
    if (showWordExample) {
      create('div', 'word-item__sentence', this.textExample, sentencesBlock);
    }
    if (this.vocabularyType === WORDS_TO_LEARN_TITLE) {
      this.learningProgress = new LearningProgress(this.nextTimeOfReivise);
    }

    create('div', 'word-item__main-container',
      [sentencesBlock, this.learningProgress && this.learningProgress.render()],
      this.additionalContent);

    if (showImageAssociations) {
      const imageBlock = create('div', 'word-item__image-block', '', this.additionalContent);
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
      create('div', 'word-item__audio', volumeIcon, this.additionalContent);
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
