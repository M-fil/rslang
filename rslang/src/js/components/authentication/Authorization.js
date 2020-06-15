import { authenticationTexts } from '../../constants/constants';

import Authentication from './Authentication';

const {
  AUTHORIZATION_TITLE,
} = authenticationTexts;

class Authorization extends Authentication {
  constructor() {
    super(AUTHORIZATION_TITLE, 'authorization');
  }
}

export default Authorization;
