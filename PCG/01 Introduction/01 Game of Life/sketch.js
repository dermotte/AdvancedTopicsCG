let board = [];
let sizeX = 64,
  sizeY = 48;

function setup() {
  createCanvas(640, 480);
  // init main world
  board = Array(sizeX);
  for (let x = 0; x < sizeX; x++) {
    board[x] = Array(sizeY);
    for (let y = 0; y < sizeY; y++) {
      board[x][y] = random([0, 1]);
    }
  }
  // set some visualization parameters
  fill(51);
  noStroke();
  frameRate(12);
}

function draw() {
  // draw each frame from the updated game world
  background(255);
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      if (board[x][y] == 1) {
        rect(
          x * (width / sizeX),
          y * (height / sizeY),
          width / sizeX,
          height / sizeY
        );
      }
    }
  }
  // update the game world
  update();
}

function update() {
  // copy current data in a buffer
  let old;
  old = Array(sizeX);
  for (let x = 0; x < sizeX; x++) {
    old[x] = Array(sizeY);
    for (let y = 0; y < sizeY; y++) {
      old[x][y] = board[x][y];
    }
  }
  // update world according to the number of neighbours
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      let n = numNeighbours(old, x, y);
      if (board[x][y] == 1 && (n == 3 || n == 2)) board[x][y] = 1;
      else board[x][y] = 0;
      if (board[x][y] == 0 && n == 3) board[x][y] = 1;
    }
  }
}

function numNeighbours(b, x1, y1) {
  count = 0;
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      if (x == 0 && y == 0) count = count + 0;
      else {
        let xx = x1 + x;
        let yy = y1 + y;
        if (xx > 0 && yy > 0 && xx < sizeX && yy < sizeY) {
          count += b[xx][yy];
        }
      }
    }
  }
  return count;
}
