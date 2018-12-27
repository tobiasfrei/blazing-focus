/**
 * Blazing Focus
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

import merge from 'lodash.merge';

export default ((id, observer) => {
  const instance = {};

  let settings = {},
    items;

  // Private Functions
  //------------------
  const bindItems = () => {
      items.forEach((item) => {
        item.setAttribute('data-blazer', id);
        item.addEventListener("mouseenter", mouseenter);
        item.addEventListener("mouseleave", mouseleave);
        item.addEventListener("mousemove", mousemove);
      });
    },
    unbindItems = () => {
      items.forEach((item) => {
        item.removeAttribute('data-blazer', id);
        item.removeEventListener("mouseenter", mouseenter);
        item.removeEventListener("mouseleave", mouseleave);
        item.removeEventListener("mousemove", mousemove);
      });
    },
    mouseenter = (e) => {
      observer.trigger('blazer-mouseEnter', {
        id: id,
        target: e.currentTarget
      });
    },
    mouseleave = (e) => {
      let dist = Math.getDistance(e.currentTarget.querySelector(".icon")._gsTransform.x, e.currentTarget.querySelector(".icon")._gsTransform.y, 0, 0),
        icon = e.currentTarget.querySelector(".icon");

      observer.trigger('blazer-mouseLeave', {
        id: id,
        target: e.currentTarget,
        icon: icon,
        dist: dist,
        x: 0,
        y: 0
      });
    },
    mousemove = (e) => {
      parallaxCursor(e, e.currentTarget, 3);
      callParallax(e, e.currentTarget);
    },
    callParallax = (e, parent) => {
      parallaxElement(e, parent, parent.querySelector(".icon"), 10);
    },
    parallaxElement = (e, parent, target, movement) => {
      let boundingRect = parent.getBoundingClientRect(),
        relX = e.pageX - boundingRect.left,
        relY = e.pageY - boundingRect.top,
        dist = Math.getDistance((relX - boundingRect.width / 2) / boundingRect.width * movement, (relY - boundingRect.height / 2) / boundingRect.height * movement, 0, 0),
        pos = {
          x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
          y: (relY - boundingRect.height / 2) / boundingRect.height * movement
        };

      observer.trigger('blazer-parallaxElement', {
        id: id,
        x: pos.x,
        y: pos.y,
        target: target,
        dist: dist
      });
    },
    parallaxCursor = (e, parent, movement) => {
      let rect = parent.getBoundingClientRect(),
        relX = e.pageX - rect.left,
        relY = e.pageY - rect.top,
        pos = {
          x: rect.left + rect.width / 2 + (relX - rect.width / 2) / movement,
          y: rect.top + rect.height / 2 + (relY - rect.height / 2) / movement
        };

      observer.trigger('blazer-parallaxCursor', {
        id: id,
        x: pos.x,
        y: pos.y
      });
    };

  Math.getDistance = (x1, y1, x2, y2) => {
    let xs = x2 - x1,
      ys = y2 - y1;

    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
  };

  // Public functions
  //-----------------
  instance.init = (selector) => {
    items = document.querySelectorAll(selector);

    bindItems();
  };

  instance.destroy = () => {
    unbindItems();
  };

  return instance;
});
