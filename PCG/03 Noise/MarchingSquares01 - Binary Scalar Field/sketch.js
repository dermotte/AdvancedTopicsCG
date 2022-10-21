let grid;
let resolution = 20;
let cols, rows;
let t = 0;
let noiseScale = 0.2;

function setup() {
  createCanvas(640, 480);

  grid = [];
  cols = 640 / resolution + 1;
  rows = 480 / resolution + 1;
  

  /*
  // creating a random grid:
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = Math.floor(Math.random() + 0.5);
    }
  }
  */
}

function draw() {
  // create Perlin noise based grid
  // t+=0.005; // z-coordinate for the noise, for animation.
  noiseDetail(15, 0.4);
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      // noiseDetail of the pixels octave count and falloff value
      noiseVal = noise((i) * noiseScale, (j) * noiseScale, t);
      // noiseVal = Math.floor(noiseVal*6)/6;
      grid[i][j] = Math.floor(noiseVal + 0.5);
    }
  }
  
  background("brown");
  // marching squares
  strokeWeight(0);
  fill("#FF9800");
  for (let i=0;  i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let caseID = determineCase(i, j);
      paintRectangle(i, j, caseID);
    }
  }
  strokeWeight(5);
  // paint the grid:
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      stroke((1 - grid[i][j]) * 255.0);
      point(i * resolution, j * resolution);
    }
  }
}

function determineCase(i, j) {
  // check https://en.wikipedia.org/wiki/Marching_squares for the case numbers.
  let a, b, c, d; // clockwise points around the rectangle.
  a = grid[i][j];
  b = grid[i + 1][j];
  c = grid[i + 1][j + 1];
  d = grid[i][j + 1];
  if (a + b + c + d == 0) return 0;
  if (a + b + c + d == 4) return 15;
  if (a + b + c + d == 2) {
    if (b + c == 2) return 6;
    if (c + d == 2) return 3;
    if (a + d == 2) return 9;
    if (a + b == 2) return 12;
    if (b + d == 2) return 5;
    if (a + c == 2) return 10;
  }
  if (a + b + c + d == 1) {
    if (a == 1) return 8;
    if (b == 1) return 4;
    if (c == 1) return 2;
    if (d == 1) return 1;
  }
  if (a + b + c + d == 3) {
    if (a == 0) return 7;
    if (b == 0) return 11;
    if (c == 0) return 13;
    if (d == 0) return 14;
  }
  return -1; // error
}

function paintRectangle(i, j, caseID) {
  let r = resolution;
  /*
    a-ab-b
    |    |
    da   bc
    |    |
    d-cd-c
  */
  let a = createVector(r*i, r*j);
  let b = createVector(r*i + r, r*j);
  let c = createVector(r*i + r, r*j + r);
  let d = createVector(r*i, r*j + r);
  
  let ab = createVector(r*i + r/2, r*j);
  let bc = createVector(r*i + r, r*j + r/2);
  let cd = createVector(r*i + r/2, r*j + r);
  let da = createVector(r*i, r*j + r/2);

  if (caseID == 1) {
    beginShape();
    vertex(da.x, da.y);
    vertex(cd.x, cd.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
  if (caseID == 2) {
    beginShape();
    vertex(bc.x, bc.y);
    vertex(c.x, c.y);
    vertex(cd.x, cd.y);
    endShape(CLOSE);
  }
  if (caseID == 3) {
    beginShape();
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    vertex(da.x, da.y);
    vertex(bc.x, bc.y);
    endShape(CLOSE);
  }
  if (caseID == 4) {
    beginShape();
    vertex(ab.x, ab.y);
    vertex(b.x, b.y);
    vertex(bc.x, bc.y);
    endShape(CLOSE);
  }
  if (caseID == 5) {
    beginShape();
    vertex(ab.x, ab.y);
    vertex(b.x, b.y);
    vertex(bc.x, bc.y);
    vertex(cd.x, cd.y);
    vertex(d.x, d.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 6) {
    beginShape();
    vertex(ab.x, ab.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(cd.x, cd.y);
    endShape(CLOSE);
  }
  if (caseID == 7) {
    beginShape();
    vertex(ab.x, ab.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 8) {
    beginShape();
    vertex(a.x, a.y);
    vertex(ab.x, ab.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 9) {
    beginShape();
    vertex(a.x, a.y);
    vertex(ab.x, ab.y);
    vertex(cd.x, cd.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
  if (caseID == 10) {
    beginShape();
    vertex(a.x, a.y);
    vertex(ab.x, ab.y);
    vertex(bc.x, bc.y);
    vertex(c.x, c.y);
    vertex(cd.x, cd.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 11) {
    beginShape();
    vertex(a.x, a.y);
    vertex(ab.x, ab.y);
    vertex(bc.x, bc.y);
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
  if (caseID == 12) {
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(bc.x, bc.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 13) {
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(bc.x, bc.y);
    vertex(cd.x, cd.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
  if (caseID == 14) {
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(cd.x, cd.y);
    vertex(da.x, da.y);
    endShape(CLOSE);
  }
  if (caseID == 15) {
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
}
