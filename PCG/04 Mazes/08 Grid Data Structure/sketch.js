let maze;
let cell;             // current cell
let visited = 0;      // terminate when all cells visited
let steps = 100000;   // maximum number of steps, just to be sure

let size_x = 12;
let size_y = 9;
blockSizeX = 20;
blockSizeY = 20;

function setup() {
    createCanvas(640, 480);
    initMaze(size_x, size_y);
    cell = maze.get(0, 0);
    cell.visited = true;
    visited++;
    fill(0);
    blockSizeX = width / size_x;
    blockSizeY = height / size_y;
}

function draw() {
    background(255);
    for (let x = 0; x < size_x; x++) {
        for (let y = 0; y < size_y; y++) {
            if (maze.get(x, y).hasWall("n")) {
                line(x * blockSizeX, y * blockSizeY, (x + 1) * blockSizeX, y * blockSizeY);
            }
            if (maze.get(x, y).hasWall("w")) {
                line(x * blockSizeX, y * blockSizeY, (x) * blockSizeX, (y + 1) * blockSizeY);
            }
            if (maze.get(x, y).hasWall("e")) {
                line((x + 1) * blockSizeX, y * blockSizeY, (x + 1) * blockSizeX, (y + 1) * blockSizeY);
            }
            if (maze.get(x, y).hasWall("s")) {
                line(x * blockSizeX, (y + 1) * blockSizeY, (x + 1) * blockSizeX, (y + 1) * blockSizeY);
            }
        }
    }
    if ((visited < size_x * size_y) && (--steps > 0)) {
        fill(0);
        circle(cell.col * blockSizeX + blockSizeX / 2, cell.row * blockSizeY + blockSizeY / 2, blockSizeX / 2);
        nextStep();
    }
}

/**
 generates a maze with (x,y) cells. Note that the actual maze is
 larger as the maze cells are divided by rows and cols of walls.
 */
function initMaze(mazeSizeX, mazeSizeY) {
    maze = new Grid(mazeSizeX, mazeSizeY);
    // maze.get(1,1).edges[0].isWall = false;
}


function nextStep() {
    // while there are unvisited cells
    // pick random neighbour
    let nl = cell.getNeighbours();
    let n = nl[Math.floor(Math.random() * nl.length)];
    if (!n.neighbour.visited) { // unvisited
        // set to visited
        n.neighbour.visited = true;
        // remove wall
        n.edge.isWall = false;
        // termination condition
        visited++;
    }
    // set new current
    cell = n.neighbour;
}

class Grid {
    constructor(sizeX, sizeY) {
        this.visited = false;
        this.rows = sizeY;
        this.cols = sizeX;
        this.arr = new Array(this.rows).fill().map(() => Array(this.cols));
        // create all Nodes ..
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.arr[r][c] = new Node(c, r);
            }
        }
        // create all Edges ..
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (r < this.rows - 1) {
                    // add edge south
                    let e = new Edge(this.arr[r][c], this.arr[r + 1][c]);
                }
                if (c < this.cols - 1) {
                    // add edge west
                    let e = new Edge(this.arr[r][c], this.arr[r][c + 1]);
                }
            }
        }
    }

    get(x, y) {
        return this.arr[y][x];
    }
}

class Node {
    constructor(x, y) {
        this.col = x;
        this.row = y;
        this.edges = [];
        this.walls = {
            s: true, n: true, w: true, e: true
        }
    }

    addEdge(newEdge) {
        this.edges.push(newEdge);
    }

    hasWall(direction) {
        this.evaluateWalls();
        return this.walls[direction];
    }

    getNeighbours() {
        let neighbours = [];
        for (let i = 0; i < this.edges.length; i++) {
            let e = this.edges[i];
            let nodeOther = e.a;
            if (e.a === this) {
                nodeOther = e.b;
            }
            neighbours.push({edge: e, neighbour: nodeOther});
        }
        return neighbours;
    }

    evaluateWalls() {
        for (let i = 0; i < this.edges.length; i++) {
            let e = this.edges[i];
            let nodeOther = e.a;
            if (e.a === this) {
                nodeOther = e.b;
            }
            if (this.row === nodeOther.row) { // horizontal: east or west
                if (this.col < nodeOther.col) this.walls["e"] = e.isWall;
                else this.walls["w"] = e.isWall;
            } else { // vertical: north or south
                if (this.row < nodeOther.row) this.walls["s"] = e.isWall;
                else this.walls["n"] = e.isWall;
            }
        }
    }
}

class Edge {
    constructor(nodeA, nodeB) {
        this.a = nodeA;
        this.b = nodeB;
        nodeA.addEdge(this);
        nodeB.addEdge(this);
        this.isWall = true;
    }
}