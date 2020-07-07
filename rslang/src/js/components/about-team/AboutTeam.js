import create from '../../utils/сreate';
import { aboutTeam } from '../../constants/constants';

const {
  NAME_FILANOVVICH,
  NAME_LATUSHKINA,
  NAME_ANTONOV,
  NAME_ZHDANOV,
  NAME_ANDREEV,
  NAME_SHNIRKEVICH,
  ABOUT_FILANOVVICH,
  ABOUT_LATUSHKINA,
  ABOUT_ANTONOV,
  ABOUT_ZHDANOV,
  ABOUT_ANDREEV,
  ABOUT_SHNIRKEVICH,
  WORK_FILANOVVICH,
  WORK_LATUSHKINA,
  WORK_ANTONOV,
  WORK_ZHDANOV,
  WORK_ANDREEV,
  WORK_SHNIRKEVICH,
} = aboutTeam;

export default class AboutTeam {
  constructor() {
    const mainContent = document.querySelector('.main-content');
    this.container = create('div', 'container', '', mainContent);
    this.backButton = create('div', '', '<i class="fas fa-long-arrow-alt-left"></i>', this.container, ['id', 'button-go-to-main-page']);
    this.teamTitle = create('div', 'team_title', 'Наша команда', this.container);
    this.teamBlock = create('div', 'team_block', '', this.container);
  }

  render() {
    this.createAboutPerson(NAME_FILANOVVICH, ABOUT_FILANOVVICH, WORK_FILANOVVICH, './src/assets/images/filanovich.jpg');
    this.createAboutPerson(NAME_LATUSHKINA, ABOUT_LATUSHKINA, WORK_LATUSHKINA, './src/assets/images/latushkina.png');
    this.createAboutPerson(NAME_ANTONOV, ABOUT_ANTONOV, WORK_ANTONOV, './src/assets/images/no_photo.png');
    this.createAboutPerson(NAME_ZHDANOV, ABOUT_ZHDANOV, WORK_ZHDANOV, './src/assets/images/no_photo.png');
    this.createAboutPerson(NAME_ANDREEV, ABOUT_ANDREEV, WORK_ANDREEV, './src/assets/images/andreev.png');
    this.createAboutPerson(NAME_SHNIRKEVICH, ABOUT_SHNIRKEVICH, WORK_SHNIRKEVICH, './src/assets/images/no_photo.png');
  }

  createAboutPerson(name, aboutPerson, work, photoSrc) {
    this.teamCard = create('div', 'team_card', '', this.teamBlock);
    this.personPhotoBlock = create('div', 'person-photo-block', '', this.teamCard);
    this.personPhoto = create('img', 'person-photo', '', this.personPhotoBlock);
    this.personPhoto.src = photoSrc;
    this.personName = create('h3', 'person-name', `${name}`, this.teamCard);
    this.personQuality = create('span', 'person-quality', `${aboutPerson}`, this.teamCard);
    this.personWork = create('p', 'person-work', `${work}`, this.teamCard);
  }
}
