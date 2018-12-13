/**
 * Blazing Focus
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

import {
  TweenMax
} from "gsap/TweenMax";

import Blazer from "./blazer";

// Module Variables
let mouse = {
    x: 0,
    y: 0
  },
  pos = {
    x: 0,
    y: 0
  },
  ratio = 0.15,
  active = false,
  blazingFocus,
  blazer;

// Factory createBreakpointManager
export default (({
  selector = '*[data-blazing]'
} = {}) => {
  const instance = {};

  const state = {
    selector: selector,
    init: false
  };

  const updateMousePosition = (e) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
    },
    updatePosition = () => {
      if (!active) {
        pos.x += (mouse.x - pos.x) * ratio;
        pos.y += (mouse.y - pos.y) * ratio;

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

      if (blazer.getCircle('orgSpeed') + dist * 3 > 20) {
        blazer.particles();
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

  // **Public functions**

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

    document.querySelectorAll(state.selector).forEach((item) => {
      item.addEventListener("mouseenter", mouseenter);
      item.addEventListener("mouseleave", mouseleave);
      item.addEventListener("mousemove", mousemove);
    });

    // init blazer
    blazer = Blazer();
    blazer.init();

    state.init = true;
  };

  instance.setCursor = () => {
    return `
        <div id="blazingFocusWrapper">
          <div class="blazingFocus">
            <canvas id="c" width="250" height="250"></canvas>
          </div>
        </div>
        `;
  };

  instance.destroy = () => {
    instance.trigger('destroy');
  };

  return instance; // Expose instance
});
