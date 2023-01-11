let n = 0, randomx = [], randomy = [], randoms = [];
function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(50, 50, 50);
  noStroke();
    for(let i=0; i<150; ++i) {
    randomx[i] = random(-1000, 1000);
    randomy[i] = random(-5000, 0);
    randoms[i] = random(0.5, 30);
  }
}

function draw() {
  n++;
  setViewerPosition(0, 30, 400-n);
  rotateX(PI/2);
  rotateY(0.1*sin(n/200.0));
  fill(0, 160, 0);
  plane(5000, 5000);
  fill(128, 128, 0);
  for (let i = 0; i< randomx.length; i++) {
    scale(1, 1, randoms[i]);
    translate(randomx[i], randomy[i], 0);
    box(50)
    translate(-randomx[i], -randomy[i], 0);
    scale(1, 1, 1/randoms[i]);
  }
  
}
