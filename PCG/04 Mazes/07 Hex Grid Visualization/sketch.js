let maze;
let cell;             // current cell
let visited = 0;      // terminate when all cells visited
let steps = 100000;   // maximum number of steps, just to be sure

let size_x = 8;
let size_y = 6;

function setup() {
  createCanvas(640, 480);
  initMaze(size_x, size_y);
  fill(0);
}

function draw() {
  background(255);
  fill(0);
  let size = 40;
  let hexw = size*sqrt(3)
  let off = 0;
  
  let hs = hexw/4;

  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      if (r%2==1) {
        off = hs;
      } else off = 0;
      if (maze[r][c] || (cell.r == r && cell.c == c)) {
        let py = (r+1) * size * 0.75;
        let px = (r%2)*hs + (c+1) * hexw * 0.5;
        if (cell.r == r && cell.c == c)
          fill(255, 33, 33);
        else
          fill(0);
        hexagon(px, py, size/2);
      }
    }
  }
  // fill(255, 33, 33); // current cell ...
  // hexagon((cell.r + 1) * blocksize, (cell.c + 1) * blocksize, blocksize, blocksize);
  if ((visited < size_x * size_y) && (--steps > 0)) nextStep();
}

/**
  generates a maze with (x,y) cells. Note that the actual maze is
  larger as the maze cells are divided by rows and cols of walls.
*/
function initMaze(mazeSizeX, mazeSizeY) {
  // init maze double the size to have rows and cols of cells ...
  // surrounding walls are left out.
  maze = Array(mazeSizeY * 2 - 1)
    .fill()
    .map(() => Array(mazeSizeX * 2 - 1));
  for (let r = 0; r < mazeSizeY * 2 - 1; r++) {
    for (let c = 0; c < mazeSizeX * 2 - 1; c++) {
      maze[r][c] = 1;
    }
  }
  // pick a start point
  cell = { r: 0, c: 0 };
  maze[cell.r][cell.c] = 0;
  visited++;
}

function nextStep() {
    // while there are unvisited cells
    // pick random neighbour
    let nl = [];
    if (cell.r + 2 < maze.length) nl.push({ r: cell.r + 2, c: cell.c });
    if (cell.c + 2 < maze[0].length) nl.push({ r: cell.r, c: cell.c + 2 });
    if (cell.r > 0) nl.push({ r: cell.r - 2, c: cell.c });
    if (cell.c > 0) nl.push({ r: cell.r, c: cell.c - 2 });
    n = nl[Math.floor(Math.random() * nl.length)];
    if (maze[n.r][n.c] == 1) { // unvisited
      // set to visited 
      maze[n.r][n.c] = 0;
      // remove wall
      maze[(n.r+cell.r)/2][(n.c+cell.c)/2] = 0;
      // termination condition
      visited++;
    }
    // set new current
    cell = n;
  
}

function hexagon(_x, _y, radius) {
  let angle = TWO_PI / 6.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = _x + cos(a+PI/6) * radius;
    let sy = _y + sin(a+PI/6) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
