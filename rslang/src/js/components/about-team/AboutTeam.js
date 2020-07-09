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
  PHOTO_FILANOVVICH,
  PHOTO_LATUSHKINA,
  PHOTO_ANTONOV,
  PHOTO_ZHDANOV,
  PHOTO_ANDREEV,
  PHOTO_SHNIRKEVICH,
  TEAM,
  BACK_BUTTON,
  GITHUB,
  VK,
} = aboutTeam;

export default class AboutTeam {
  constructor() {
    const mainContent = document.querySelector('.main-content');
    this.container = create('div', 'container', '', mainContent);
    this.backButton = create('div', '', BACK_BUTTON, this.container, ['id', 'button-go-to-main-page']);
    this.teamTitle = create('div', 'team_title', TEAM, this.container);
    this.teamBlock = create('div', 'team_block', '', this.container);
  }

  render() {
    this.createAboutPerson(NAME_FILANOVVICH, ABOUT_FILANOVVICH, WORK_FILANOVVICH, PHOTO_FILANOVVICH);
    this.createAboutPerson(NAME_LATUSHKINA, ABOUT_LATUSHKINA, WORK_LATUSHKINA, PHOTO_LATUSHKINA);
    this.createAboutPerson(NAME_ANTONOV, ABOUT_ANTONOV, WORK_ANTONOV, PHOTO_ANTONOV);
    this.createAboutPerson(NAME_ZHDANOV, ABOUT_ZHDANOV, WORK_ZHDANOV, PHOTO_ZHDANOV);
    this.createAboutPerson(NAME_ANDREEV, ABOUT_ANDREEV, WORK_ANDREEV, PHOTO_ANDREEV);
    this.createAboutPerson(NAME_SHNIRKEVICH, ABOUT_SHNIRKEVICH, WORK_SHNIRKEVICH, PHOTO_SHNIRKEVICH);
  }

  createAboutPerson(name, aboutPerson, work, photoSrc, gitLink, vkLink) {
    this.teamCard = create('div', 'team_card', '', this.teamBlock);
    this.personPhotoBlock = create('div', 'person-photo-block', '', this.teamCard);
    this.personPhoto = create('img', 'person-photo', '', this.personPhotoBlock);
    this.personPhoto.src = photoSrc;
    this.personName = create('h3', 'person-name', `${name}`, this.teamCard);
    this.personQuality = create('div', 'person-quality', `${aboutPerson}`, this.teamCard);
    this.github = create('a', 'person-link', GITHUB, this.personQuality);
    this.github.href = gitLink;
    this.vk = create('a', 'person-link', VK, this.personQuality);
    this.vk.href = vkLink;
    this.another = create('a', 'person-link', '', this.personQuality);
    this.personWork = create('p', 'person-work', `${work}`, this.teamCard);
  }
}
