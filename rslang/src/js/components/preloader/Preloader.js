import create from '../../utils/сreate';

export default class Preloader {
  constructor() {
    this.preload = document.querySelector('#preloader');
  }

  render() {
    if (!this.preload) {
      const body = document.querySelector('body');
      this.preload = create('div', 'preloader', '', body, ['id', 'preloader']);
      this.preloadContent = create('div', 'preloader_content', '', this.preload);
      this.preloadFirst = create('div', 'preloader_first', '', this.preloadContent);
      this.preloadSecond = create('div', 'preloader_second', '', this.preloadContent);
      this.preloadThird = create('div', 'preloader_third', '', this.preloadContent);
    }
  }

  toggle() {
    this.preload.classList.toggle('preloader__visible');
  }

  show() {
    this.preload.classList.add('preloader__visible');
  }

  hide() {
    this.preload.classList.remove('preloader__visible');
  }
}