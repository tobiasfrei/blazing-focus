/**
 * Blazing Focus
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

import {
  TweenMax
} from "gsap/TweenMax";

import Blazer from './blazing-focus.circle';
import BlazerKinetic from './blazing-focus.kinetic';
import BlazerPosition from './blazing-focus.mouse';
import merge from 'lodash.merge';
import Observer from '@unic/composite-observer';

let rand = function (min, max) {
  return Math.random() * (max - min) + min;
};

export default ((config) => {
  let instance = {},
    settings,
    observer = Observer(),
    active = false,
    mouse = {
      x: 0,
      y: 0
    },
    pos = {
      x: 0,
      y: 0
    },
    blazer,
    blazingFocus,
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

  // Private
  //--------
  const listen = () => {
      observer.on('blazer-mouseEnter', animateEnter);
      observer.on('blazer-updatePosition', updateBlazer);
      observer.on('blazer-updateMousePosition', updateMousePos);
      observer.on('blazer-parallaxCursor', animateBlazer);
      observer.on('blazer-parallaxIt', animateIcon);
      observer.on('blazer-mouseLeave', animateLeave);
    },
    updateMousePos = (data) => {
      mouse.x = data.x;
      mouse.y = data.y;
    },
    updateBlazer = (data) => {
      if (!active) {
        TweenLite.set(blazingFocus, {
          x: data.x,
          y: data.y
        });
      }
    },
    animateBlazer = (data) => {
      TweenMax.to(blazingFocus, 0.3, {
        x: data.x,
        y: data.y
      });
    },
    animateIcon = (data) => {
      blazer.setCircle('speed', blazer.getCircle('orgSpeed') + data.dist * 3);
      blazer.setCircle('radius', blazer.getCircle('orgRadius') + data.dist * 3);

      if (blazer.getCircle('orgSpeed') + data.dist * 3 < 10) {
        blazer.particlesOn();
      } else {
        blazer.particlesOff();
      }

      TweenMax.to(data.target, 0.3, {
        x: data.x,
        y: data.y,
        ease: Power2.easeOut
      });
    },
    animateLeave = (data) => {
      blazingFocus.classList.remove('act');

      TweenMax.to(data.target, 0.3, {
        scale: 1
      });

      TweenMax.to(blazingFocus, 0.3, {
        scale: 0.25
      });

      TweenMax.to(data.icon, 0.8, {
        ease: Elastic.easeOut.config(data.dist / 2, 0.3),
        x: 0,
        y: 0
      });

      active = false;
    },
    animateEnter = (data) => {
      blazingFocus.classList.add('act');

      TweenMax.to(data.target, 0.3, {
        scale: 1.6
      });

      TweenMax.to(blazingFocus, 0.3, {
        scale: 1
      });

      active = true;
    },
    insertCanvas = () => {
      return `
        <div id="blazingFocusWrapper">
          <div class="blazingFocus">
            <canvas id="c-blazer" width="250" height="250"></canvas>
          </div>
        </div>
      `;
    };


  instance.register = (selector) => {
    let blazerKinetic = BlazerKinetic(observer);
    blazerKinetic.init(selector);
    return blazerKinetic;
  };

  // init base
  // ---------
  settings = merge(configDefault, config);

  document.body.insertAdjacentHTML('beforeend', insertCanvas());
  blazingFocus = document.querySelector(".blazingFocus")

  TweenLite.set(blazingFocus, {
    xPercent: -50,
    yPercent: -50
  });

  BlazerPosition(settings, observer, active, mouse, pos);

  blazer = Blazer(settings);
  blazer.init();

  listen();

  return instance; // Expose instance
});
