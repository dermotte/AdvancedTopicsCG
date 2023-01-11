function preload() {
  createVRCanvas();
}

function setup() {
  setVRBackgroundColor(50, 50, 50);
  fill(0, 255, 0);
}

function draw() {
  translate(0, 0, -100);
  rotateX(10);
  rotateY(20);
  box(5);
}
