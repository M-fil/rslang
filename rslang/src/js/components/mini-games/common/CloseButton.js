import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';

export default class CloseButton {
  constructor() {
    this.modalWindow = new ModalWindow('closebutton');
    this.exitButton = create('span', 'exit-button',);
    this.exitButton.addEventListener('click', (this.exitClickHandler).bind(this));
  }

  render() {
    return this.exitButton;
  }

  show() {
    CloseButton.changeDisplay(this.exitButton, 'block');
  }

  hide() {
    CloseButton.changeDisplay(this.exitButton, 'none');
  }

  resume(callbackFn) {
    this.modalWindow.hide(callbackFn);
  }

  exitClickHandler() {
    this.modalWindow.show();
    if (this.exitClickCallbackFn) {
      this.exitClickCallbackFn();
    }
  }

  addExitButtonClickCallbackFn(callbackFn) {
    if (typeof callbackFn === 'function') {
      this.exitClickCallbackFn = callbackFn;
    }
  }

  addCancelCallbackFn(callbackFn) {
    this.modalWindow.addCallbackFnOnCancel(callbackFn);
  }

  addCloseCallbackFn(callbackFn) {
    this.modalWindow.addCallbackFnOnClose(callbackFn);
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
