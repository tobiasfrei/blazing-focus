[![N|BlazingFocus](http://tobiasfrei.ch/github/blazing-focus/blazing-focus-logo-01.svg)](https://tobiasfrei.ch)

# Blazing Focus
Blazing Focus provides a fancy mouse-over with kinetic effect and canvas particles.

## Demo
[Demo here!](http://tobiasfrei.ch/blazing-focus/)

## Prerequisite
- ES6 or Babel
- GSAP ``` "^2.0.2" ```

## Usage

1. copy files from dist/

2. include scss file or rename it as css

3. import main library
```javascript
import BlazingFocus from '../somewhere/blazing-focus';
```

4. init blazing focus with default settings
```javascript
let bf = BlazingFocus({
  blazer: {
    particles: {
      alphaUpdate: .5,
      alphaEnd: .05,
      hsl: '20, 130%, 100%',
      maxAmount: 100
    },
    circle: {
      blur: 20,
      thickness: 2,
      hue: 16,
      angleEnd: 40,
      angleStart: 20,
      rotation: 20,
      radius: 25,
      speed: 4
    }
  }
});
```

5. register items and optional overwrite defaults
```javascript
let item1 = bf.register({
  selector: '.item.heart',
  blazer: {settings}
});
```

## Markup
```html
<a class="item heart" tabindex="0">
  <div class="icon"><i class="fa fa-heart"></i></div>
</a>
<a class="item alert" tabindex="0">
  <div class="icon"><i class="fa fa-bell"></i></div>
</a>
<a class="item mail" tabindex="0">
  <div class="icon"><i class="fa fa-envelope"></i></div>
</a>

```

### Upcoming
- npm package
- detailed settings

### Author
Tobias Frei (mail@tobiasfrei.ch) 
Based on Ketchup Starterkit
