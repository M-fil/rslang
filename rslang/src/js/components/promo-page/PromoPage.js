import create from '../../utils/сreate';
import { promoPage } from '../../constants/constants';

const {
  PROMO,
  PROMO_VIDEO,
  IMG_CHICKEN1,
  IMG_CHICKEN2,
  IMG_CHICKEN3,
  IMG_CHICKEN4,
  BACK_BUTTON,
  ADVANTAGES,
  ADVANTAGES_TEXT,
  VOCABULARY,
  VOCABULARY_TEXT,
  INTERVAL,
  INTERVAL_TEXT,
  SETTING,
  SETTING_TEXT,
  STATISTICS,
  STATISTICS_TEXT,
  GAMES,
  SPEAKIT,
  SPEAKIT_TEXT,
  PUZZLE,
  PUZZLE_TEXT,
  SAVANNAH,
  SAVANNAH_TEXT,
  AUDIO,
  AUDIO_TEXT,
  FIND_PAIR,
  FIND_PAIR_TEXT,
} = promoPage;

export default class PromoPage {
  constructor() {
    const mainContent = document.querySelector('.main-content');
    this.container = create('div', 'promo-page-container', '', mainContent);
    this.backButton = create('button', '', BACK_BUTTON, this.container, ['id', 'button-go-to-main-page']);
    this.ptomoTitle = create('h3', 'promo_title', PROMO, this.container);
    this.promoBlock = create('div', 'promo_block', '', this.container);
  }

  render() {
    this.promoVideo = create('iframe', '', '', this.promoBlock);
    this.promoVideo.src = PROMO_VIDEO;

    this.advantagesBlock = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.advantagesBlock, ADVANTAGES, ADVANTAGES_TEXT);

    this.createChicken('promo_chicken-left', IMG_CHICKEN1);
    this.vocabularyBlock = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.vocabularyBlock, VOCABULARY, VOCABULARY_TEXT);

    this.intervalBlock = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.intervalBlock, INTERVAL, INTERVAL_TEXT);

    this.settingBlock = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.settingBlock, SETTING, SETTING_TEXT);

    this.createChicken('promo_chicken-right', IMG_CHICKEN2);
    this.statisticsBlock = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.statisticsBlock, STATISTICS, STATISTICS_TEXT);

    this.miniGames = create('h3', 'promo_games', GAMES, this.promoBlock);

    this.speakitGame = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.speakitGame, SPEAKIT, SPEAKIT_TEXT);

    this.createChicken('promo_chicken-left', IMG_CHICKEN3);
    this.puzzleGame = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.puzzleGame, PUZZLE, PUZZLE_TEXT);

    this.savannahGame = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.savannahGame, SAVANNAH, SAVANNAH_TEXT);

    this.createChicken('promo_chicken-right', IMG_CHICKEN4);
    this.audioGame = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.audioGame, AUDIO, AUDIO_TEXT);

    this.findPairGame = create('div', 'promo_block-block', '', this.promoBlock);
    PromoPage.createBlocks(this.findPairGame, FIND_PAIR, FIND_PAIR_TEXT);
  }

  static createBlocks(parentBlock, blockTitle, blockText) {
    create('h4', 'promo_title-blocks', blockTitle, parentBlock);
    create('p', 'promo-text', blockText, parentBlock);
  }

  createChicken(classImg, imgSrc) {
    this.chick = create('img', `chicken ${classImg}`, '', this.promoBlock);
    this.chick.src = imgSrc;
  }
}
