import { authenticationConstants } from '../../constants/constants';

import Authentication from './Authentication';

const {
  AUTHORIZATION_TITLE,
  LOGIN_BUTTON_TEXT,
  AUTHORIZATION_KEY,
} = authenticationConstants;

class Authorization extends Authentication {
  constructor() {
    super(AUTHORIZATION_TITLE, 'authorization', LOGIN_BUTTON_TEXT, AUTHORIZATION_KEY);
  }
}

export default Authorization;
