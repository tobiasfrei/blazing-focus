// Polyfills
import 'mdn-polyfills/NodeList.prototype.forEach';

// Bundle Config
import '../../../.modernizrrc';
import './libs/modernizr-custom-tests';
import '../styles/main.scss';

// Page Defaults
import './main.config';

import BlazingFocus from '../../modules/blazing-focus/blazing-focus';

let bf = BlazingFocus();
bf.init();
