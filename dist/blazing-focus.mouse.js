/**
 * Blazing Focus | Mouse
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

import observer from '@unic/composite-observer';

export default ((settings, observer, active, mouse, pos) => {
  const instance = {};

  // Private Functions
  //------------------
  const updateMousePosition = (e) => {
      observer.trigger('blazer-updateMousePosition', {
        x: e.pageX,
        y: e.pageY
      });
    },
    updatePosition = () => {
      if (!active) {
        pos.x += (mouse.x - pos.x) * settings.ratio;
        pos.y += (mouse.y - pos.y) * settings.ratio;

        observer.trigger('blazer-updatePosition', {
          x: pos.x,
          y: pos.y
        });
      }
    };

  instance.applySettings = (pItem) => {
    settings = pItem.settings;
  };

  document.addEventListener("mousemove", updateMousePosition);
  TweenLite.ticker.addEventListener("tick", updatePosition);

  return instance;
});
