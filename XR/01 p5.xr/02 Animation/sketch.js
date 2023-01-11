let n = 0;
function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(50, 50, 50);
  fill(0, 255, 0);
}

function draw() {
  setViewerPosition(0, 0, 400);
  n+=0.005;
  for (let x = 0; x < 200; x++) {
    translate(x, 0, 0);
    rotateX(n);
    box(5);
    rotate(-n);
  }
}
