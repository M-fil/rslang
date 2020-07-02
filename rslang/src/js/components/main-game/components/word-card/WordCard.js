import create, { urls } from '../../pathes';

const {
  WORDS_IMAGES_URL,
} = urls;

class WordCard {
  constructor(
    id, word, wordTranslate,
    textMeaning, textMeaningTranslate,
    textExample, textExampleTranslate,
    transcription, audio, image, wordCardSettings,
  ) {
    this.HTML = null;

    this.id = id;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.textMeaning = textMeaning;
    this.textMeaningTranslate = textMeaningTranslate;
    this.textExample = textExample;
    this.textExampleTranslate = textExampleTranslate;
    this.transcription = transcription;
    this.audio = audio;
    this.image = image;
    this.wordCardSettings = wordCardSettings;
  }

  render() {
    const {
      showWordMeaning,
      showWordExample,
      showImageAssociations,
    } = this.wordCardSettings;

    if (showWordMeaning && showWordExample) {
      this.sentencesBlock = this.renderSentences();
    }
    const imageBlock = create('div', 'word-card__image-block');

    if (showImageAssociations) {
      const wordImage = new Image();
      wordImage.src = `${WORDS_IMAGES_URL}${this.image}`;
      wordImage.onload = () => {
        imageBlock.innerHTML = `<img src="${wordImage.src}" alt="${this.word}" />`;
      };
    }

    this.HTML = create(
      'div', 'main-game__word-card',
      [
        (showWordMeaning && showWordExample) ? this.sentencesBlock : '',
        showImageAssociations ? imageBlock : '',
        this.renderWordInfo(),
      ],
      null, ['word', this.word], ['word-id', this.id],
    );

    return this.HTML;
  }

  static removeCurrentWordFromSentence(sentenceHTML) {
    const newNode = create('span', 'word-card__sentence-word-container');
    create('span', 'word-card__sentence-word', sentenceHTML.firstElementChild.textContent, newNode);
    sentenceHTML.replaceChild(newNode, sentenceHTML.firstElementChild);
  }

  renderWordInfo() {
    const {
      showTranscription,
      showTranslateWord,
    } = this.wordCardSettings;

    const container = create('div', 'word-card__word-info');
    const wordTranslationHTML = create(
      'div', 'word-card__translation',
      this.wordTranslate, null,
      ['translationElement', ''],
    );
    const wordCardTranscriptHTML = create('div', 'word-card__transcription', this.transcription);
    container.append(
      showTranslateWord ? wordTranslationHTML : '',
      showTranscription ? wordCardTranscriptHTML : '',
    );

    return container;
  }

  renderSentences() {
    const { showWordMeaning, showWordExample } = this.wordCardSettings;
    const container = create('div', 'word-card__sentences');

    if (showWordMeaning) {
      const textMeaningHTML = create('div', 'word-card__text-meaning', this.textMeaning, container);
      create(
        'div', 'word-card__text-meaning-translation hidden-translation',
        this.textMeaningTranslate, container,
        ['translationElement', ''],
      );
      WordCard.removeCurrentWordFromSentence(textMeaningHTML);
    }

    if (showWordExample) {
      const textExampleHTML = create('div', 'word-card__text-example', this.textExample, container);
      create(
        'div', 'word-card__text-example-translation hidden-translation',
        this.textExampleTranslate, container,
        ['translationElement', ''],
      );
      WordCard.removeCurrentWordFromSentence(textExampleHTML);
    }

    return container;
  }
}

export default WordCard;
