let maze;

let size_x = 12;
let size_y = 9;

function setup() {
  createCanvas(640, 480);
  initMaze(size_x, size_y);
  fill(0);
  // noLoop()
}

function draw() {
  background(255);
  fill(0);
  let blocksizeY = height / (maze[0].length + 2);
  let blocksizeX = width / (maze.length + 2);
  for (let c = 0; c < maze[0].length + 2; c++)
    rect(0, c * blocksizeY, blocksizeX, blocksizeY); // paint borders
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      if (maze[r][c])
        rect((r + 1) * blocksizeX, (c + 1) * blocksizeY, blocksizeX, blocksizeY);
    }
    rect((r + 1) * blocksizeX, 0, blocksizeX, blocksizeY); // paint borders
    rect((r + 1) * blocksizeX,(maze[0].length + 1) * blocksizeY,blocksizeX,
      blocksizeY); // paint borders
  }
  for (let c = 0; c < maze[0].length + 2; c++)// paint borders
    rect((maze.length + 1) * blocksizeX, c * blocksizeY, blocksizeX, blocksizeY);
}

/**
  generates a maze with (x,y) cells. Note that the actual maze is
  larger as the maze cells are divided by rows and cols of walls.
*/
function initMaze(mazeSizeX, mazeSizeY) {
  // init maze 
  maze = Array(mazeSizeY * 2 - 1)
    .fill()
    .map(() => Array(mazeSizeX * 2 - 1));
  for (let r = 0; r < mazeSizeY * 2 - 1; r++) {
    for (let c = 0; c < mazeSizeX * 2 - 1; c++) {
      maze[r][c] = 0;
    }
  }
  subdivideV(0, 0, size_x, size_y);
}

function subdivideH(sx, sy, ex, ey) {
  // pick a wall and an entry
  let col = (sx + Math.floor(Math.random()*(ex-sx-1)))*2+1
  let row = (sy + Math.floor(Math.random()*(ey-sy)))*2
  for (let r = sy*2; r < ey*2-1; r++) {
    if (r != row) maze[r][col] = 1;
  }
  // find sub chambers and subdivide them
  if ((col+1)/2-sx > 1) 
    subdivideV(sx, sy, (col+1)/2, ey);
  if (ex-(col+1)/2 > 1)  
    subdivideV((col+1)/2, sy, ex, ey)
}

function subdivideV(sx, sy, ex, ey) {
  // pick a wall and an entry
  let col = (sx + Math.floor(Math.random()*(ex-sx)))*2;
  let row = (sy + Math.floor(Math.random()*(ey-sy-1)))*2+1
  // store it in the grid
  for (let c = sx*2; c < ex*2-1; c++) {
    if (c != col) maze[row][c] = 1;
  }
  // find sub chambers and subdivide them
  if ((row+1)/2 - sy > 1) 
    subdivideH(sx, sy, ex, (row+1)/2);
  if (ey - (row+1)/2 > 1)  
     subdivideH(sx, (row+1)/2, ex, ey);
}

