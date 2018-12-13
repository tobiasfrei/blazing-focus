// Custom Tests

Modernizr.addTest('safari', () => {
  const isSafari = navigator.userAgent.indexOf('Safari') > -1;


  const isChrome = navigator.userAgent.indexOf('Chrome') > -1;

  return !isChrome && isSafari;
});

Modernizr.addTest('ie', () => false || !!document.documentMode); // eslint-disable-line spaced-comment

Modernizr.addTest('edge', () => {
  const isIE = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line spaced-comment
  return !isIE && !!window.StyleMedia;
});

Modernizr.addTest('firefox-lt-50', () => {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    if (navigator.userAgent.split('Firefox/')[1].split('.')[0] < 50) {
      return true;
    }
  }
  return false;
});

(function touchDetection() {
  document.documentElement.classList.add('no-touchdevice');
  Modernizr.touch = false;

  window.addEventListener('touchstart', function setHasTouch() {
    Modernizr.touch = true;
    document.documentElement.classList.add('touchdevice');
    document.documentElement.classList.remove('no-touchdevice');

    // Remove event listener once fired, otherwise it'll kill scrolling performance
    window.removeEventListener('touchstart', setHasTouch);
  }, false);
}());
