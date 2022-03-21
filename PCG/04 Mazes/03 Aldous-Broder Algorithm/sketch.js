let maze;
let size_x = 20;
let size_y = 30;

function setup() {
  createCanvas(640, 480);
  maze = generateMaze(size_x, size_y);
  fill(0);
  noLoop();
}

function draw() {
  background(255);
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
function generateMaze(mazeSizeX, mazeSizeY) {
  let visited = 0; // terminate when all cells visited
  let steps = 100000; // maximum number of steps, just to be sure
  // init maze double the size to have rows and cols of cells ...
  // surrounding walls are left out.
  let maze = Array(mazeSizeY * 2 - 1)
    .fill()
    .map(() => Array(mazeSizeX * 2 - 1));
  for (let r = 0; r < mazeSizeY * 2 - 1; r++) {
    for (let c = 0; c < mazeSizeX * 2 - 1; c++) {
      maze[r][c] = 1;
    }
  }
  // pick a start point
  let cell = { r: 0, c: 0 };
  maze[cell.r][cell.c] = 0;
  // while there are unvisited cells
  while ((visited < mazeSizeX * mazeSizeY) && (--steps > 0)) {
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
  return maze;
}
