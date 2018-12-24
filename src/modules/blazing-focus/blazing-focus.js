/**
 * Blazing Focus
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

import {
  TweenMax
} from "gsap/TweenMax";

import Blazer from './blazer';
import merge from 'lodash.merge';

// Module Variables
let mouse = {
    x: 0,
    y: 0
  },
  pos = {
    x: 0,
    y: 0
  },
  active = false,
  blazingFocus,
  blazer,
  rand = function (min, max) {
    return Math.random() * (max - min) + min;
  };

export default ((config) => {
  const instance = {},
    configDefault = {
      selector: '*[data-blazing]',
      ratio: .15,
      blazer: {
        particles: {
          radius: () => {
            return rand(1, 3) / 2;
          },
          alpha: () => {
            return rand(0, 20) / 30;
          },
          alphaUpdate: .01,
          alphaEnd: .05,
          hsl: '20, 130%, 100%',
          maxAmount: 100
        },
        circle: {
          blur: 20,
          thickness: 2,
          hue: 10,
          angleEnd: 40,
          angleStart: 20,
          rotation: 200,
          radius: 25,
          speed: 4
        }
      }
    };

  const settings = merge(configDefault, config),
    state = {
      init: false
    };

  // Private Functions
  //------------------
  const updateMousePosition = (e) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
    },
    updatePosition = () => {
      if (!active) {
        pos.x += (mouse.x - pos.x) * settings.ratio;
        pos.y += (mouse.y - pos.y) * settings.ratio;

        TweenLite.set(blazingFocus, {
          x: pos.x,
          y: pos.y
        });
      }
    },
    mouseenter = (e) => {
      blazingFocus.classList.add('act');

      TweenMax.to(e.currentTarget, 0.3, {
        scale: 1.6
      });

      TweenMax.to(blazingFocus, 0.3, {
        scale: 1
      });

      active = true;
    },
    mouseleave = (e) => {
      let dist = Math.getDistance(e.currentTarget.querySelector(".icon")._gsTransform.x, e.currentTarget.querySelector(".icon")._gsTransform.y, 0, 0);

      blazingFocus.classList.remove('act');

      TweenMax.to(e.currentTarget, 0.3, {
        scale: 1
      });

      TweenMax.to(blazingFocus, 0.3, {
        scale: 0.25
      });

      TweenMax.to(e.currentTarget.querySelector(".icon"), 0.8, {
        ease: Elastic.easeOut.config(dist / 2, 0.3),
        x: 0,
        y: 0
      });

      active = false;
    },
    mousemove = (e) => {
      parallaxCursor(e, e.currentTarget, 3);
      callParallax(e, e.currentTarget);
    },
    callParallax = (e, parent) => {
      parallaxIt(e, parent, parent.querySelector(".icon"), 10);
    },
    parallaxIt = (e, parent, target, movement) => {
      let boundingRect = parent.getBoundingClientRect(),
        relX = e.pageX - boundingRect.left,
        relY = e.pageY - boundingRect.top,
        dist = Math.getDistance((relX - boundingRect.width / 2) / boundingRect.width * movement, (relY - boundingRect.height / 2) / boundingRect.height * movement, 0, 0);

      blazer.setCircle('speed', blazer.getCircle('orgSpeed') + dist * 3);
      blazer.setCircle('radius', blazer.getCircle('orgRadius') + dist * 3);

      if (blazer.getCircle('orgSpeed') + dist * 3 < 10) {
        blazer.particlesOn();
      } else {
        blazer.particlesOff();
      }

      TweenMax.to(target, 0.3, {
        x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
        y: (relY - boundingRect.height / 2) / boundingRect.height * movement,
        ease: Power2.easeOut
      });
    },
    parallaxCursor = (e, parent, movement) => {
      let rect = parent.getBoundingClientRect(),
        relX = e.pageX - rect.left,
        relY = e.pageY - rect.top;

      pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
      pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;

      TweenMax.to(blazingFocus, 0.3, {
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
  instance.init = () => {
    console.log("init blazing");

    document.body.insertAdjacentHTML('beforeend', instance.setCursor());

    blazingFocus = document.querySelector(".blazingFocus")

    TweenLite.set(blazingFocus, {
      xPercent: -50,
      yPercent: -50
    });

    document.addEventListener("mousemove", updateMousePosition);

    TweenLite.ticker.addEventListener("tick", updatePosition);

    document.querySelectorAll(settings.selector).forEach((item) => {
      item.addEventListener("mouseenter", mouseenter);
      item.addEventListener("mouseleave", mouseleave);
      item.addEventListener("mousemove", mousemove);
    });

    // init blazer
    blazer = Blazer(settings);
    blazer.init();

    state.init = true;
  };

  instance.setCursor = () => {
    return `
        <div id="blazingFocusWrapper">
          <div class="blazingFocus">
            <canvas id="c-blazer" width="250" height="250"></canvas>
          </div>
        </div>
        `;
  };

  instance.destroy = () => {
    instance.trigger('destroy');
  };

  return instance; // Expose instance
});
