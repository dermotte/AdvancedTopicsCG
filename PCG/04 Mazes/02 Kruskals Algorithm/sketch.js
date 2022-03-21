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
  let blocksize = min(width, height)/(max(size_x, size_y)*2);
  for (let c=0; c< maze[0].length+2; c++)
    rect(0, c*blocksize, blocksize, blocksize); // paint borders
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
        if (maze[r][c]) 
          rect((r+1)*blocksize, (c+1)*blocksize, blocksize, blocksize);
    }
    rect((r+1)*blocksize, 0, blocksize, blocksize); // paint borders
    rect((r+1)*blocksize, (maze[0].length+1)*blocksize, blocksize, blocksize); // paint borders
  }
  for (let c=0; c< maze[0].length+2; c++) // paint borders
    rect((maze.length+1)*blocksize, c*blocksize, blocksize, blocksize);
}

/**
  generates a maze with (x,y) cells. Note that the actual maze is
  larger as the maze cells are divided by rows and cols of walls.
*/
function generateMaze(mazeSizeX, mazeSizeY) {
  // init maze double the size to have rows and cols of cells ...
  // surrounding walls are left out.
  let maze = Array(mazeSizeY * 2 - 1)
    .fill()
    .map(() => Array(mazeSizeX * 2 - 1));
  for (let r = 0; r < mazeSizeY * 2 - 1; r++) {
    for (let c = 0; c < mazeSizeX * 2 - 1; c++) {
      if (r % 2 == 0 && c % 2 == 0) maze[r][c] = 0;
      else maze[r][c] = 1;
    }
  }
  // generate maze by randomized Kruskals's algorithm
  // remember: cells are in (r%2 == 0 && c%2==0) indexes.
  let wallList = []; // create the list of walls ..
  for (let r = 0; r < mazeSizeY; r++) {
    for (let c = 0; c < mazeSizeX; c++) {
      // for each cell, add the lower and right wall:
      if (2*r+1 < maze.length) // last row
        wallList.push({r: 2*r+1, c:2*c, type:"vertical"});
      if (2*c+1 < maze[0].length) // last col
        wallList.push({r: 2*r, c:2*c+1, type:"horizontal"});
    }
  }
  let sets = [] // create the cell sets, each cell in a single set
  for (let r = 0; r < mazeSizeY; r++) {
    for (let c = 0; c < mazeSizeX; c++) {
      sets.push([{r:r, c:c}]);
    }
  }  
  shuffle(wallList, true); // p5js shuffle
  for (let w of wallList) {
    let c1, c2;
    if (w.type == "horizontal") { // find the neighbouring cells:
      // r/2 und c-1/2, c+1/2
      c1 = {r: w.r/2, c: (w.c-1)/2};
      c2 = {r: w.r/2, c: (w.c+1)/2};
    } else {
      c1 = {r: (w.r+1)/2, c: w.c/2};
      c2 = {r: (w.r-1)/2, c: w.c/2};
    }
    // find the sets with the cells within
    let s1, s2;
    let i1, i2;
    for (let i = 0; i < sets.length; i++) {
      let s = sets[i];
      if (s.length >0) {
        if (isInList(s, c1))  {
          s1 = s;
          i1 = i;
        }
        if (isInList(s, c2)) {
          s2 = s;
          i2 = i;
        }
      }
    }
    if (!isSame(s1,s2)) {
      sets[i1] = s1.concat(s2); // union
      sets.splice(i2, 1); // remove from set list
      maze[w.r][w.c] = 0; // remove wall
    }
  }
  return maze;
}

function isInList(list, item) {
  result = false;
  for (let l of list) {
    if (l.r == item.r && l.c == item.c) {
      result = true;
      break; 
    }
  }
  return result;
}

function isSame(list1, list2) {
  if (list1.length != list2.length) return false; // speed up
  result = true;
  for (let l of list1) {
    if (!isInList(list2, l)) return false;
  }
  for (let l of list2) {
    if (!isInList(list1, l)) return false;
  }
  return result;
}
