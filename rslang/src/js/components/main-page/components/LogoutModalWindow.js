import {
  logoutModalWindowContstants,
} from '../pathes';
import ModalWindow from '../../mini-games/common/ModalWindow';

const {
  LOGOUT_MODAL_WINDOW_TITLE,
  LOGOUT_EXIT_CONFIRM,
} = logoutModalWindowContstants;

class LogoutModalWindow extends ModalWindow {
  constructor() {
    super('logout-modal');
    this.modalTitle.textContent = LOGOUT_MODAL_WINDOW_TITLE;
    this.modalWarning.textContent = '';
    this.modalClose.textContent = LOGOUT_EXIT_CONFIRM;
    this.modalClose.id = 'logout-trigger';
  }
}

export default LogoutModalWindow;
