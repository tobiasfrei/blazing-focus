// Polyfills
import 'mdn-polyfills/NodeList.prototype.forEach';

// Bundle Config
import '../../../.modernizrrc';
import './libs/modernizr-custom-tests';
import '../styles/main.scss';

// Page Defaults
import './main.config';


// init blazer with defaults
// -------------------------

import BlazingFocus from '../../modules/blazing-focus/blazing-focus';


// init blazer with defaults
// -------------------------

let bf = BlazingFocus({
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


// register items
// --------------

let item1 = bf.register({
  selector: '.item.heart'
});

let item2 = bf.register({
  selector: '.item.alert',
  ratio: .15,
  blazer: {
    particles: {
      alphaUpdate: .01,
      alphaEnd: .05,
      hsl: '20, 130%, 100%',
      maxAmount: 100
    },
    circle: {
      blur: 10,
      thickness: 1,
      hue: 46,
      angleEnd: 280,
      angleStart: 180,
      rotation: 20,
      radius: 35,
      speed: 8
    }
  }
});
