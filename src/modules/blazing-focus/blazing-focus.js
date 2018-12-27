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
import BlazerMouse from './blazing-focus.mouse';
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
    _kinetics = {},
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
    blazerMouse;


  const configDefault = {
    selector: '*[pData-blazing]',
    ratio: 0.15,
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
      observer.on('blazer-updatePosition', updateBlazer);
      observer.on('blazer-updateMousePosition', updateMousePos);
      observer.on('blazer-parallaxCursor', animateBlazer);
      observer.on('blazer-parallaxElement', animateIcon);
      observer.on('blazer-mouseEnter', animateEnter);
      observer.on('blazer-mouseLeave', animateLeave);
    },
    updateMousePos = (pData) => {
      mouse.x = pData.x;
      mouse.y = pData.y;
    },
    updateBlazer = (pData) => {
      if (!active) {
        TweenLite.set(blazingFocus, {
          x: pData.x,
          y: pData.y
        });
      }
    },
    animateBlazer = (pData) => {
      TweenMax.to(blazingFocus, 0.3, {
        x: pData.x,
        y: pData.y
      });
    },
    animateIcon = (pData) => {
      blazer.setCircle('speed', blazer.getCircle('orgSpeed') + pData.dist * 3);
      blazer.setCircle('radius', blazer.getCircle('orgRadius') + pData.dist * 3);

      if (blazer.getCircle('orgSpeed') + pData.dist * 3 < 10) {
        blazer.particlesOn();
      } else {
        blazer.particlesOff();
      }

      TweenMax.to(pData.target, 0.3, {
        x: pData.x,
        y: pData.y,
        ease: Power2.easeOut
      });
    },
    animateLeave = (pData) => {
      blazingFocus.classList.remove('act');

      TweenMax.to(pData.target, 0.3, {
        scale: 1
      });

      TweenMax.to(blazingFocus, 0.3, {
        scale: 0.25
      });

      TweenMax.to(pData.icon, 0.8, {
        ease: Elastic.easeOut.config(pData.dist / 2, 0.3),
        x: 0,
        y: 0
      });

      active = false;
    },
    animateEnter = (pData) => {
      blazer.applySettings(_kinetics[pData.id]);
      blazerMouse.applySettings(_kinetics[pData.id]);

      blazingFocus.classList.add('act');

      TweenMax.to(pData.target, 0.3, {
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
    },
    getUniqueId = (pPrefix) => {
      let d = new Date().getTime();
      d += (parseInt(Math.random() * 100)).toString();
      if (undefined === pPrefix) {
        pPrefix = 'uid-';
      }
      d = pPrefix + d;
      return d;
    };

  instance.register = (pSettings) => {
    let id = getUniqueId('id-');

    let newSettings = merge({}, settings, pSettings);


    let blazerKinetic = BlazerKinetic(id, observer);

    blazerKinetic.init(newSettings.selector);

    _kinetics[id] = {
      instance: blazerKinetic,
      settings: { ...newSettings
      }
    };


    return blazerKinetic;
  };

  // init base
  // ---------
  settings = merge({}, configDefault, config);

  document.body.insertAdjacentHTML('beforeend', insertCanvas());
  blazingFocus = document.querySelector(".blazingFocus")

  TweenLite.set(blazingFocus, {
    xPercent: -50,
    yPercent: -50
  });

  blazerMouse = BlazerMouse(settings, observer, active, mouse, pos);

  blazer = Blazer(settings);
  blazer.init();

  listen();

  return instance;
});
