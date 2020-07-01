import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';

export default class CloseButton {
  constructor() {
    this.body = document.querySelector('body');
    this.exitButton = create('button', 'exit-button', '<i class="fas fa-times"></i>', this.body);
    this.modalWindow = new ModalWindow('closebutton');
  }

  show() {
    CloseButton.changeDisplay(this.exitButton, 'block');
    this.exitButton.addEventListener('click', () => {
      this.modalWindow.show();
    });
  }

  hide() {
    CloseButton.changeDisplay(this.exitButton, 'none');
  }

  resume(callbackFn) {
    this.modalWindow.hide(callbackFn);
  }

  disabled(boolean) {
    this.exitButton.disabled = boolean;
  }

  static changeDisplay(element, event) {
    const el = element;
    if (event === 'none') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
}