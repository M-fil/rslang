import create from '../../utils/сreate';
import { aboutTeam } from '../../constants/constants';

const {
  NAME_FILANOVICH,
  NAME_LATUSHKINA,
  NAME_ANTONOV,
  NAME_ZHDANOV,
  NAME_ANDREEV,
  NAME_SHNIRKEVICH,
  WORK_FILANOVICH,
  WORK_LATUSHKINA,
  WORK_ANTONOV,
  WORK_ZHDANOV,
  WORK_ANDREEV,
  WORK_SHNIRKEVICH,
  PHOTO_FILANOVICH,
  PHOTO_LATUSHKINA,
  PHOTO_ANTONOV,
  PHOTO_ZHDANOV,
  PHOTO_ANDREEV,
  PHOTO_SHNIRKEVICH,
  TEAM,
  BACK_BUTTON,
  GITHUB,
  VK,
  LINKEDIN,
  GIT_FILANOVICH,
  VK_FILANOVICH,
  LINKEDIN_FILANOVICH,
  GIT_LATUSHKINA,
  VK_LATUSHKINA,
  LINKEDIN_LATUSHKINA,
  GIT_ANTONOV,
  VK_ANTONOV,
  LINKEDIN_ANTONOV,
  GIT_ZHDANOV,
  VK_ZHDANOV,
  LINKEDIN_ZHDANOV,
  GIT_ANDREEV,
  VK_ANDREEV,
  LINKEDIN_ANDREEV,
  GIT_SHNIRKEVICH,
  VK_SHNIRKEVICH,
  LINKEDIN_SHNIRKEVICH,
} = aboutTeam;

export default class AboutTeam {
  constructor() {
    const mainContent = document.querySelector('.main-content');
    this.container = create('div', 'about-team-container', '', mainContent);
    this.backButton = create('button', '', BACK_BUTTON, this.container, ['id', 'button-go-to-main-page']);
    this.teamTitle = create('h3', 'team_title', TEAM, this.container);
    this.teamBlock = create('div', 'team_block', '', this.container);
  }

  render() {
    this.createAboutPerson(NAME_FILANOVICH, WORK_FILANOVICH, PHOTO_FILANOVICH, GIT_FILANOVICH, VK_FILANOVICH, LINKEDIN_FILANOVICH);
    this.createAboutPerson(NAME_LATUSHKINA, WORK_LATUSHKINA, PHOTO_LATUSHKINA, GIT_LATUSHKINA, VK_LATUSHKINA, LINKEDIN_LATUSHKINA);
    this.createAboutPerson(NAME_ANTONOV, WORK_ANTONOV, PHOTO_ANTONOV, GIT_ANTONOV, VK_ANTONOV, LINKEDIN_ANTONOV);
    this.createAboutPerson(NAME_ZHDANOV, WORK_ZHDANOV, PHOTO_ZHDANOV, GIT_ZHDANOV, VK_ZHDANOV, LINKEDIN_ZHDANOV);
    this.createAboutPerson(NAME_ANDREEV, WORK_ANDREEV, PHOTO_ANDREEV, GIT_ANDREEV, VK_ANDREEV, LINKEDIN_ANDREEV);
    this.createAboutPerson(NAME_SHNIRKEVICH, WORK_SHNIRKEVICH, PHOTO_SHNIRKEVICH, GIT_SHNIRKEVICH, VK_SHNIRKEVICH, LINKEDIN_SHNIRKEVICH);
  }

  createAboutPerson(name, work, photoSrc, gitLink, vkLink, linkedinLink) {
    this.teamCard = create('div', 'team_card', '', this.teamBlock);
    this.personPhotoBlock = create('div', 'person-photo-block', '', this.teamCard);
    this.personPhoto = create('img', 'person-photo', '', this.personPhotoBlock);
    this.personPhoto.src = photoSrc;
    this.personName = create('h3', 'person-name', name, this.teamCard);
    this.personQuality = create('ul', 'submenu', '', this.teamCard);
    this.githubLI = create('li', 'person-link', '', this.personQuality);
    this.github = create('a', 'person-link', GITHUB, this.githubLI);
    this.vkLI = create('li', 'person-link', '', this.personQuality);
    this.vk = create('a', 'person-link', VK, this.vkLI);
    this.linkedinLI = create('li', 'person-link', '', this.personQuality);
    this.linkedin = create('a', 'person-link', LINKEDIN, this.linkedinLI);
    this.github.href = gitLink;
    this.vk.href = vkLink;
    this.linkedin.href = linkedinLink;
    this.github.target = '_blank';
    this.vk.target = '_blank';
    this.linkedin.target = '_blank';
    this.personWork = create('p', 'person-work', `${work}`, this.teamCard);
  }
}
