import create from '../../../utils/сreate';
import {
  modalConstants,
} from '../../../constants/constants';

const {
  MODAL_TITLE,
  MODAL_WARNING,
  CLOSE_BUTTON,
  CANCEL_BUTTON,
} = modalConstants;

export default class ModalWindow {
  constructor() {
    this.body = document.querySelector('body');
    this.modal = create('div', 'modal', '', this.body);
    this.modalText = create('div', 'modal_text', '', this.modal);
    this.modalTitle = create('h4', 'modal_title', MODAL_TITLE, this.modalText);
    this.modalWarning = create('p', 'modal_warning', MODAL_WARNING, this.modalText);
    this.modalClose = create('button', 'modal_button close_button', CLOSE_BUTTON, this.modalText);
    this.modalCancel = create('button', 'modal_button cancel_button', CANCEL_BUTTON, this.modalText);
  }

  show() {
    ModalWindow.changeDisplay(this.modal, 'block');
    this.modalCancel.addEventListener('click', () => {
      this.hide();
    });
  }

  hide() {
    ModalWindow.changeDisplay(this.modal, 'none');
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
