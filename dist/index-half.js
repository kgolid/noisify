(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  const maxWidth = 1200;
  const maxHeight = 1000;

  const n_size1 = 600;
  const n_size2 = 40;

  let sketch = function(p) {
    let nx, ny;

    p.setup = function() {
      const c = p.createCanvas(1200, 800);
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
      let portrait = p.height >= p.width;
      p.noiseSeed(Math.random() * 999999);
      for (let i = 0; i < p.height; i++) {
        for (let j = 0; j < p.width; j++) {
          let cx = p.noise(i / n_size1, j / n_size1, 100) * nx;
          let cy = p.noise(i / n_size1, j / n_size1, 200) * ny;
          let dx = p.noise(i / n_size2, j / n_size2, 300) * (nx / 20);
          let dy = p.noise(i / n_size2, j / n_size2, 400) * (ny / 20);

          let ratio = p.pow(
            p.constrain(
              -0.67 + 2 * (portrait ? i / p.height : j / p.width),
              0,
              1
            ),
            2
          );
          let c =
            pixels[p.floor(ratio * (cy + dy) + (1 - ratio) * i)][
              p.floor(ratio * (cx + dx) + (1 - ratio) * j)
            ];
          p.stroke(...c);
          p.point(j, i);
        }
      }
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
