(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  let sketch = function(p) {
    let n_size1 = 700;
    let n_size2 = 50;

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
      p.loadPixels();
      img.loadPixels();

      nx = img.width;
      ny = img.height;

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
      for (let i = 0; i < p.height; i++) {
        for (let j = 0; j < p.width; j++) {
          let cx = p.noise(i / n_size1, j / n_size1, 100) * nx;
          let cy = p.noise(i / n_size1, j / n_size1, 200) * ny;
          let dx = p.noise(i / n_size2, j / n_size2, 300) * (nx / 20);
          let dy = p.noise(i / n_size2, j / n_size2, 400) * (ny / 20);

          let c = pixels[p.floor(cy + dy)][p.floor(cx + dx)];
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
