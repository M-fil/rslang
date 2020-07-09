import create from '../../pathes';

class MicrophoneButton {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', 'microphone-button hidden microphone-button_disabled');
    create('i', 'fas fa-microphone-slash', '', this.HTML);

    return this.HTML;
  }
}

export default MicrophoneButton;
