// Polyfills
import 'mdn-polyfills/NodeList.prototype.forEach';

// Bundle Config
import '../../../.modernizrrc';
import './libs/modernizr-custom-tests';
import '../styles/main.scss';

// Page Defaults
import './main.config';

import BlazingFocus from '../../modules/blazing-focus/blazing-focus';

let bf = BlazingFocus({
  selector: '*[data-blazing]',
  ratio: .15,
  blazer: {
    particles: {
      alphaUpdate: .01,
      alphaEnd: .05,
      hsl: '20, 130%, 100%',
      maxAmount: 100
    },
    circle: {
      blur: 20,
      thickness: 2,
      hue: 16,
      angleEnd: 40,
      angleStart: 20,
      rotation: 200,
      radius: 25,
      speed: 4
    }
  }
});

bf.init();
