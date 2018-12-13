/**
 * Blazing Focus | Blazer
 *
 * @author Tobias Frei
 * @copyright tobiasfrei.ch
 */

// Module Variables
let c,
  ctx,
  cw,
  ch,
  gradient1,
  gradient2,
  gradient3,
  p = false,
  gradient4,
  rand = function (a, b) {
    return ~~((Math.random() * (b - a + 1)) + a);
  };

export default (({
  selector = '*[data-blazing]'
} = {}) => {
  const instance = {};

  const state = {
    selector: selector,
    init: false
  };

  let particles = [],
    particleMax = 100,
    circle;

  const dToR = (degrees) => {
      return degrees * (Math.PI / 180);
    },
    updateCircle = () => {
      if (circle.rotation < 360) {
        (circle.rotation += circle.speed);
      } else {
        circle.rotation = 0;
      }
    },
    renderCircle = () => {
      ctx.save();
      ctx.translate(circle.x, circle.y);
      ctx.rotate(dToR(circle.rotation));
      ctx.beginPath();
      ctx.arc(0, 0, circle.radius, dToR(circle.angleStart), dToR(circle.angleEnd), true);
      ctx.lineWidth = circle.thickness;
      ctx.strokeStyle = gradient1;
      ctx.stroke();
      ctx.restore();
    },
    renderCircleBorder = () => {
      ctx.save();
      ctx.translate(circle.x, circle.y);
      ctx.rotate(dToR(circle.rotation));
      ctx.beginPath();
      ctx.arc(0, 0, circle.radius + (circle.thickness / 2), dToR(circle.angleStart), dToR(circle.angleEnd), true);
      ctx.lineWidth = 6;
      ctx.strokeStyle = gradient2;
      ctx.stroke();
      ctx.restore();
    },
    renderCircleFlare = () => {
      ctx.save();
      ctx.translate(circle.x, circle.y);
      ctx.rotate(dToR(circle.rotation + 185));
      ctx.scale(1, 1);
      ctx.beginPath();
      ctx.arc(0, circle.radius, 40, 20, Math.PI * 2, false);
      ctx.closePath();
      gradient3 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 10);
      gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .345)');
      gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
      ctx.fillStyle = gradient3;
      ctx.fill();
      ctx.restore();
    },
    renderCircleFlare2 = () => {
      ctx.save();
      ctx.translate(circle.x, circle.y);
      ctx.rotate(dToR(circle.rotation));
      ctx.scale(4, 2);
      ctx.beginPath();
      ctx.arc(0, circle.radius, 0, 30, Math.PI, true);
      ctx.closePath();
      gradient4 = ctx.createRadialGradient(20, circle.radius, 0, 300, circle.radius, 3);
      gradient4.addColorStop(0, 'hsla(30, 100%, 10%, .3)');
      gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
      ctx.fillStyle = gradient4;
      ctx.fill();
      ctx.restore();
    },
    createParticles = () => {
      if (particles.length < particleMax) {
        particles.push({
          x: (circle.x + circle.radius * Math.cos(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
          y: (circle.y + circle.radius * Math.sin(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
          vx: (rand(0, 100) - 50) / 20,
          vy: (rand(0, 100) - 50) / 20,
          radius: rand(1, 3) / 3,
          alpha: rand(0, 20) / 30
        });
      }
    },
    updateParticles = () => {
      let i = particles.length;
      while (i--) {
        let p = particles[i];
        p.vx += (rand(0, 100) - 50) / 50;
        p.vy += (rand(0, 100) - 50) / 750;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= .01;

        if (p.alpha < .05) {
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
        ctx.fillStyle = 'hsla(20, 130%, 100%, ' + p.alpha + ')';
      }
    },
    clear = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';
    },
    loop = () => {
      clear();
      updateCircle();
      renderCircle();
      renderCircleBorder();
      renderCircleFlare();
      renderCircleFlare2();

      if (p) {
        createParticles();
        updateParticles();
        renderParticles();
      }
    };


  // **Public functions**

  instance.init = () => {
    c = document.getElementById('c');

    if (!c) {
      console.error('blazing-focus: no canvas found')
    }

    ctx = c.getContext('2d');
    cw = c.width = 250;
    ch = c.height = 250;

    circle = {
      x: (cw / 2),
      y: (ch / 2),
      radius: 25,
      orgRadius: 25,
      speed: 4,
      orgSpeed: 4,
      rotation: 200,
      angleStart: 20,
      angleEnd: 40,
      hue: 10,
      thickness: 2,
      orgThickness: 2,
      blur: 20
    };

    ctx.shadowBlur = circle.blur;
    ctx.shadowColor = 'hsla(' + circle.hue + ', 80%, 60%, 0)';
    ctx.lineCap = 'round'

    gradient1 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
    gradient1.addColorStop(0, 'hsla(' + circle.hue + ', 60%, 50%, .25)');
    gradient1.addColorStop(1, 'hsla(' + circle.hue + ', 10%, 50%, 0)');

    gradient2 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
    gradient2.addColorStop(0, 'hsla(' + circle.hue + ', 0%, 50%, 0)');

    setInterval(loop, 16);

    state.init = true;
  };

  instance.setCircle = (key, value) => {
    circle[key] = value;
  };

  instance.getCircle = (key) => {
    return circle[key];
  };

  instance.destroy = () => {
    instance.trigger('destroy');
  };

  instance.particles = () => {
    p = true;
  };

  return instance; // Expose instance
});
