import { authenticationConstants } from '../../constants/constants';

import Authentication from './Authentication';

const {
  REGISTRATION_TITLE,
  REGISTER_BUTTON_TEXT,
} = authenticationConstants;

class Registration extends Authentication {
  constructor() {
    super(REGISTRATION_TITLE, 'registration', REGISTER_BUTTON_TEXT);
  }
}

export default Registration;
