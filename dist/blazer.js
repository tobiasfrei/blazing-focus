/**
 * Blazing Focus | Blazer
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */


// Module Variables
let canvasEl,
  ctx,
  cw,
  ch,
  gradient1,
  gradient2,
  gradient3,
  gradient4,
  flag_particle = false,
  rand = function (min, max) {
    return Math.random() * (max - min) + min;
  };

export default ((settings) => {
  const instance = {},
    state = {
      init: false
    };

  let particles = [],
    circleState;

  // Private Functions
  //------------------
  const toDegrees = (degrees) => {
      return degrees * (Math.PI / 180);
    },
    updateCircle = () => {
      if (circleState.rotation < 360) {
        (circleState.rotation += circleState.speed);
      } else {
        circleState.rotation = 0;
      }
    },
    renderCircle = () => {
      ctx.save();

      // transform
      ctx.translate(circleState.x, circleState.y);
      ctx.rotate(toDegrees(circleState.rotation));

      // draw path
      ctx.beginPath();
      ctx.arc(0, 0, circleState.radius, toDegrees(circleState.angleStart), toDegrees(circleState.angleEnd), true);
      ctx.lineWidth = circleState.thickness;
      ctx.strokeStyle = gradient1;
      ctx.stroke();
      ctx.restore();
    },
    renderCircleBorder = () => {
      ctx.save();

      // transform
      ctx.translate(circleState.x, circleState.y);
      ctx.rotate(toDegrees(circleState.rotation));

      // draw path
      ctx.beginPath();
      ctx.arc(0, 0, circleState.radius + (circleState.thickness * 2), toDegrees(circleState.angleStart), toDegrees(circleState.angleEnd), true);
      ctx.lineWidth = 6;
      ctx.strokeStyle = gradient2;
      ctx.stroke();
      ctx.restore();
    },
    renderCircleFlare = () => {
      ctx.save();

      // transform
      ctx.translate(circleState.x, circleState.y);
      ctx.rotate(toDegrees(circleState.rotation + 185));
      ctx.scale(1, 1);

      // draw path
      ctx.beginPath();
      ctx.arc(0, circleState.radius, 40, 20, Math.PI * 2, false);
      ctx.closePath();

      // create pseudo shaders
      gradient3 = ctx.createRadialGradient(0, circleState.radius, 0, 0, circleState.radius, 10);
      gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .345)');
      gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');

      // apply pseudo shaders
      ctx.fillStyle = gradient3;
      ctx.fill();
      ctx.restore();
    },
    renderCircleFlare2 = () => {
      ctx.save();

      // transform
      ctx.translate(circleState.x, circleState.y);
      ctx.rotate(toDegrees(circleState.rotation));
      ctx.scale(4, 2);

      // draw path
      ctx.beginPath();
      ctx.arc(0, circleState.radius, 0, 30, Math.PI, true);
      ctx.closePath();

      // create pseudo shaders
      gradient4 = ctx.createRadialGradient(20, circleState.radius, 0, 300, circleState.radius, 3);
      gradient4.addColorStop(0, 'hsla(30, 100%, 10%, .3)');
      gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');

      // apply pseudo shaders
      ctx.fillStyle = gradient4;
      ctx.fill();
      ctx.restore();
    },
    createParticles = () => {
      if (particles.length < settings.blazer.particles.maxAmount) {
        particles.push({
          x: (circleState.x + circleState.radius * Math.cos(toDegrees(circleState.rotation - 85))) + (rand(0, circleState.thickness * 2) - circleState.thickness),
          y: (circleState.y + circleState.radius * Math.sin(toDegrees(circleState.rotation - 85))) + (rand(0, circleState.thickness * 2) - circleState.thickness),
          vx: (rand(0, 100) - 50) / 20,
          vy: (rand(0, 100) - 50) / 20,
          radius: settings.blazer.particles.radius(),
          alpha: settings.blazer.particles.alpha()
        });
      }
    },
    updateParticles = () => {
      let i = particles.length;
      while (i--) {
        let p = particles[i];

        // calc offset
        p.vx += (rand(0, 100) - 50) / 50;
        p.vy += (rand(0, 100) - 50) / 750;

        // apply offset
        p.x += p.vx;
        p.y += p.vy;

        // update transparency
        p.alpha -= settings.blazer.particles.alphaUpdate;

        if (p.alpha < settings.blazer.particles.alphaEnd) {
          particles.splice(i, 1)
        }
      }
    },
    renderParticles = () => {
      let i = particles.length;
      while (i--) {
        let p = particles[i];
        ctx.beginPath();
        ctx.fillRect(p.x, p.y, p.radius, p.radius);
        ctx.closePath();
        ctx.fillStyle = 'hsla(' + settings.blazer.particles.hsl + ', ' + p.alpha + ')';
      }
    },
    clearCanvas = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';
    },
    getCircleState = () => {
      return {
        x: (cw / 2),
        y: (ch / 2),
        radius: settings.blazer.circle.radius,
        orgRadius: settings.blazer.circle.radius,
        speed: settings.blazer.circle.speed,
        orgSpeed: settings.blazer.circle.speed,
        rotation: settings.blazer.circle.rotation,
        angleStart: settings.blazer.circle.angleStart,
        angleEnd: settings.blazer.circle.angleEnd,
        hue: settings.blazer.circle.hue,
        thickness: settings.blazer.circle.thickness,
        orgThickness: settings.blazer.circle.thickness,
        blur: settings.blazer.circle.blur
      };
    },
    initCanvas = () => {
      canvasEl = document.getElementById('c-blazer');

      if (!canvasEl) {
        console.error('#blazing-focus: no canvas found')
      }

      ctx = canvasEl.getContext('2d');
      cw = canvasEl.width = 250;
      ch = canvasEl.height = 250;
    },
    loopAnim = () => {
      clearCanvas();
      updateCircle();
      renderCircle();
      renderCircleBorder();
      renderCircleFlare();
      renderCircleFlare2();

      if (flag_particle) {
        createParticles();
        updateParticles();
        renderParticles();
      }
    };


  // Public functions
  //-----------------
  instance.init = () => {
    initCanvas();
    circleState = getCircleState();

    ctx.shadowBlur = circleState.blur;
    ctx.shadowColor = 'hsla(' + circleState.hue + ', 80%, 60%, 0)';
    ctx.lineCap = 'round'

    gradient1 = ctx.createLinearGradient(0, -circleState.radius, 0, circleState.radius);
    gradient1.addColorStop(0, 'hsla(' + circleState.hue + ', 60%, 50%, .25)');
    gradient1.addColorStop(1, 'hsla(' + circleState.hue + ', 10%, 50%, 0)');

    gradient2 = ctx.createLinearGradient(0, -circleState.radius, 0, circleState.radius);
    gradient2.addColorStop(0, 'hsla(' + circleState.hue + ', 0%, 50%, 0)');

    setInterval(loopAnim, 16);

    state.init = true;
  };

  instance.destroy = () => {
    instance.trigger('destroy');
  };

  instance.setCircle = (key, value) => {
    circleState[key] = value;
  };

  instance.getCircle = (key) => {
    return circleState[key];
  };

  instance.particlesOn = () => {
    flag_particle = true;
  };

  instance.particlesOff = () => {
    flag_particle = false;
  };

  return instance; // Expose instance
});
