import create from '../../utils/сreate';

export default class ModalWindow {
  constructor(classNames, id, title) {
    this.id = id;

    const spanButton = create('span', 'modal-block__close-button', 'X');
    spanButton.addEventListener('click', (this.clickHandler).bind(this));
    const spanTitle = create('span', 'modal-block__title', title);
    const navbar = create('div', 'modal-block__navbar', [spanTitle, spanButton]);

    this.content = create('div', 'modal-block__content');
    this.main = create('div', 'modal-block__main', [navbar, this.content]);
    this.background = create('div', `modal-block modal-block_hidden ${classNames}`, this.main, document.body, ['id', id]);
    this.background.addEventListener('click', (this.clickHandler).bind(this));
  }

  setContent(body) {
    this.content.append(body);
  }

  openModal() {
    console.log('this.id', this.id);
    const modal = document.querySelector(`#${this.id}`);
    console.log('modal', modal);
    if (modal) {
      console.log('modal', modal);
      modal.classList.remove('modal-block_hidden');
    }
  }

  closeModal() {
    const modal = document.querySelector(`#${this.id}`);
    if (modal) {
      modal.classList.add('modal-block_hidden');
    }
  }

  clickHandler(event) {
    const elem = event.target;
    if (elem.classList.contains('modal-block') || elem.classList.contains('modal-block__close-button')) {
      this.closeModal();
    }
  }
}
