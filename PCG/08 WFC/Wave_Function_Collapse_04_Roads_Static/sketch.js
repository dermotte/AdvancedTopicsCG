/*
 * Intuitive implementation missing part of the "collapse" version 2
 */
let grid = [];
let sizeX = 10;
let sizeY = 10;
let img = [];
let cellsize = 64;

let rule = [
  { // 0
    n: [0, 1, 6, 3],
    s: [0, 1, 4, 5],
    e: [0, 2, 3, 4],
    w: [0, 2, 5, 6],
  },
  { // 1
    n: [0, 1, 3, 6],
    s: [0, 1, 4, 5],
    e: [1, 5, 6, 7],
    w: [1, 3, 4, 7],
  },
  { // 2
    n: [2, 4, 5, 7],
    s: [2, 3, 6, 7],
    e: [0, 2, 3, 4],
    w: [0, 2, 5, 6],
  },
  { // 3
    n: [2, 4, 5, 7],
    s: [0, 1, 4, 5],
    e: [1, 5, 6, 7],
    w: [0, 2, 5, 6],
  },
  { // 4
    n: [0, 1, 3, 6],
    s: [2, 3, 6, 7],
    e: [1, 5, 6, 7],
    w: [0, 2, 5, 6],
  },
  { // 5
    n: [0, 1, 3, 6],
    s: [2, 3, 6, 7],
    e: [0, 2, 3, 4],
    w: [1, 3, 4, 7],
  },
  { // 6
    n: [2, 4, 5, 7],
    s: [0, 1, 4, 5],
    e: [0, 2, 3, 4],
    w: [1, 3, 4, 7],
  },
  { // 7
    n: [2, 4, 5],
    s: [2, 3, 6],
    e: [1, 5, 6],
    w: [1, 3, 4],
  },
];

function preload() {
  img.push(loadImage("blank.png")); // 0
  img.push(loadImage("road_h.png")); // 1
  img.push(loadImage("road_v.png")); // 2
  img.push(loadImage("corner_01.png")); // 3
  img.push(loadImage("corner_02.png")); // 4
  img.push(loadImage("corner_03.png"));
  img.push(loadImage("corner_04.png")); // 6
  img.push(loadImage("crossing.png"));
  img.push(loadImage("t_01.png")); // 8
  img.push(loadImage("t_02.png"));
  img.push(loadImage("t_03.png")); // 10
  img.push(loadImage("t_04.png"));
  img.push(loadImage("de01.png")); // 12
  img.push(loadImage("de02.png"));
  img.push(loadImage("de03.png")); // 14
  img.push(loadImage("de04.png"));
}

function setup() {
  createCanvas(640, 640);
  // init grid
  for (let x = 0; x < sizeX; x++) {
    grid.push([]);
    for (let y = 0; y < sizeY; y++) {
      grid[x].push({ collapsed: false, dirty: false, tiles: [0, 1, 2, 3, 4, 5, 6, 7]});
      // grid[x].push({ collapsed: false, dirty: false, tiles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });
    }
  }
}

function draw() {
  background(255);
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      if (grid[x][y].collapsed)
        image(img[grid[x][y].tiles[0]], cellsize * x, cellsize * y, cellsize, cellsize);
    }
  }
  if (!isFinished()) waveFunctionCollapse();
}

function isFinished() {
  result = true;
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      if (!grid[x][y].collapsed) result = false;
    }
  }
  return result;
}

function isDirty() {
  result = false;
  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      if (grid[x][y].dirty) return true;
    }
  }
  return result;
}

function waveFunctionCollapse() {
  collapseTile();
  reducePossibleNeighbours();
}

function collapseTile() {
  // todo: reduce the one with least entropy ...
  let min = { x: -1, y: -1, entropy: 100 };
  for (let y = sizeY - 1; y >= 0; y--) {
    for (let x = 0; x < sizeX; x++) {
      if (grid[x][y].tiles.length < min.entropy && !grid[x][y].collapsed) {
        min.x = x;
        min.y = y;
        min.entropy = grid[x][y].tiles.length;
      }
    }
  }
  if (min.x + min.y > -1) {
    l = grid[min.x][min.y].tiles;
    grid[min.x][min.y].tiles = [l[Math.floor(Math.random() * l.length)]];
    grid[min.x][min.y].collapsed = true;
    grid[min.x][min.y].dirty = true
  }

}

function reducePossibleNeighbours() {
  let cnt = 100; // terminate for sure?
  while (isDirty() && cnt-- > 0) {
    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        if (grid[x][y].dirty) {
          let r = rule[grid[x][y].tiles[0]];
          setCandidates({ x: x, y: y }, "n", r.n);
          setCandidates({ x: x, y: y }, "s", r.s);
          setCandidates({ x: x, y: y }, "e", r.e);
          setCandidates({ x: x, y: y }, "w", r.w);
          grid[x][y].dirty = false;
        }
      }
    }
  }
}

function setCandidates(pos, direction, list) {
  // find appropriate cell
  let c = { x: 0, y: 0 };
  if (direction == "n") {
    c.y = -1;
    c.x = 0;
  } else if (direction == "s") {
    c.y = 1;
    c.x = 0;
  } else if (direction == "e") {
    c.y = 0;
    c.x = 1;
  } else if (direction == "w") {
    c.y = 0;
    c.x = -1;
  }
  // out of grid ..
  if (pos.x + c.x < 0 || pos.x + c.x >= sizeX) return false;
  if (pos.y + c.y < 0 || pos.y + c.y >= sizeY) return false;
  // set list ...
  if (!grid[pos.x + c.x][pos.y + c.y].collapsed) {
    tmplist = grid[pos.x + c.x][pos.y + c.y].tiles;
    grid[pos.x + c.x][pos.y + c.y].tiles = joint_set(tmplist, list);
    if (!grid[pos.x + c.x][pos.y + c.y].tiles.length === tmplist.length) grid[pos.x + c.x][pos.y + c.y].dirty = true;
  }
}

function joint_set(list1, list2) {
  return list1.filter(function (element) {
    return list2.includes(element);
  });
}
