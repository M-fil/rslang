import { authenticationTexts } from '../../constants/constants';

import Authentication from './Authentication';

const {
  REGISTRATION_TITLE,
} = authenticationTexts;

class Registration extends Authentication {
  constructor() {
    super(REGISTRATION_TITLE, 'registration');
  }
}

export default Registration;
