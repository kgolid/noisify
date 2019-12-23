(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  const maxWidth = 5000;
  const maxHeight = 5000;

  const n_size1 = 1200;
  const n_size2 = 700;

  let sketch = function(p) {
    let nx, ny;

    p.setup = function() {
      const c = p.createCanvas(500, 300);
      p.pixelDensity(1);
      p.noLoop();

      c.drop(gotFile);
    };

    p.draw = function() {
      p.fill(255);
      p.textSize(21);
      p.textAlign(p.CENTER);
      p.background('#888');
      p.text('Drop an image here!', p.width / 2, p.height / 2);
    };

    p.keyPressed = function() {
      if (p.keyCode === 80) p.saveCanvas('noisify', 'jpeg');
    };

    function gotFile(file) {
      if (file.type === 'image') {
        p.loadImage(file.data, imageLoaded);
      } else {
        console.log('Not an image file!');
      }
    }

    function imageLoaded(img) {
      if (img.height / maxHeight > img.width / maxWidth) {
        if (img.height > maxHeight) img.resize(0, maxHeight);
      } else {
        if (img.width > maxWidth) img.resize(maxWidth, 0);
      }

      img.loadPixels();

      nx = Math.floor(img.width);
      ny = Math.floor(img.height);
      p.resizeCanvas(nx, ny);

      const imgpixels = newArray(img.height).map((_, j) =>
        newArray(img.width).map((_, i) => {
          var loc = (i + j * img.width) * 4;
          return [img.pixels[loc + 0], img.pixels[loc + 1], img.pixels[loc + 2]];
        })
      );

      drawImage(imgpixels);
    }

    function drawImage(pixels) {
      p.noiseSeed(Math.random() * 999999);
      for (let i = 0; i < p.height - 1; i++) {
        if (i % 300 === 0) console.log('Progress: ' + p.round((i / p.height) * 100) + '%');
        for (let j = 0; j < p.width - 1; j++) {
          const c = getColor(i, j, pixels);
          p.stroke(...c);
          p.point(j, i);
        }
      }
    }

    function getColor(i, j, pixels) {
      let cx = p.noise(i / n_size1, j / n_size1, 100) * nx;
      let cy = p.noise(i / n_size1, j / n_size1, 200) * ny;

      let offset = p.noise(i / n_size2, j / n_size2, 500);
      let ratio = offset < 0.4 ? 0 : p.constrain(p.pow(offset - 0.4, 2) * 4, 0, 1);

      let xpos = ratio * cy + (1 - ratio) * i;
      let ypos = ratio * cx + (1 - ratio) * j;
      let x1 = p.floor(xpos);
      let y1 = p.floor(ypos);
      return intepolate(
        xpos - x1,
        ypos - y1,
        pixels[x1][y1],
        pixels[x1 + 1][y1],
        pixels[x1 + 1][y1 + 1],
        pixels[x1][y1 + 1]
      );
    }

    function intepolate(ix, iy, nw, ne, se, sw) {
      const ncol = nw.map((c, i) => p.lerp(c, ne[i], ix));
      const scol = sw.map((c, i) => p.lerp(c, se[i], ix));
      return ncol.map((c, i) => p.lerp(c, scol[i], iy));
    }
  };
  new p5(sketch);

  function newArray(n, value) {
    n = n || 0;
    var array = new Array(n);
    for (var i = 0; i < n; i++) {
      array[i] = value;
    }
    return array;
  }

}));
