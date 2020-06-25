import { authenticationTexts } from '../../constants/constants';

import Authentication from './Authentication';

const {
  REGISTRATION_TITLE,
  REGISTER_BUTTON_TEXT,
} = authenticationTexts;

class Registration extends Authentication {
  constructor() {
    super(REGISTRATION_TITLE, 'registration', REGISTER_BUTTON_TEXT);
  }
}

export default Registration;
