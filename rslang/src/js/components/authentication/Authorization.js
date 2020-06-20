import { authenticationTexts } from '../../constants/constants';

import Authentication from './Authentication';

const {
  AUTHORIZATION_TITLE,
  LOGIN_BUTTON_TEXT,
} = authenticationTexts;

class Authorization extends Authentication {
  constructor() {
    super(AUTHORIZATION_TITLE, 'authorization', LOGIN_BUTTON_TEXT);
  }
}

export default Authorization;
