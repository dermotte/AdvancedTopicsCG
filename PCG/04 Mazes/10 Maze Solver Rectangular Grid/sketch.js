let maze;
let cell;             // current cell
let visited = 0;      // terminate when all cells visited
let steps = 100000;   // maximum number of steps, just to be sure

let solver;

let size_x = 36;
let size_y = 27;
blockSizeX = 20;
blockSizeY = 20;

function setup() {
    createCanvas(640, 480);
    initMaze(size_x, size_y);
    cell = maze.get(0, 0);
    cell.visited = true;
    visited++;
    fill(0);
    strokeWeight(4);
    blockSizeX = width / size_x;
    blockSizeY = height / size_y;
    while ((visited < size_x * size_y) && (--steps > 0)) {
        nextStep();
    }
    solver = new Solver(maze, maze.get(0, 0), maze.get(size_x-1,size_y-1));
}

function mouseReleased() {
    solver.step();
}

function draw() {
    background(255);
    stroke("black");
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
    stroke("red");
    for (let i = 1; i < solver.trace.length; i++) {
        let c = solver.trace[i];
        let d = solver.trace[i-1];
        line(c.col*blockSizeX + blockSizeX/2, c.row*blockSizeY+blockSizeY/2, d.col*blockSizeX+blockSizeX/2, d.row*blockSizeY+blockSizeY/2);
    }
    if (solver.trace.length>0) {
        let c = solver.current;
        let d = solver.trace[solver.trace.length - 1];
        line(c.col * blockSizeX + blockSizeX / 2, c.row * blockSizeY + blockSizeY / 2, d.col * blockSizeX + blockSizeX / 2, d.row * blockSizeY + blockSizeY / 2);
    }
    if (!solver.solved) {
        solver.step();
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

class Solver {
    constructor(maze, start, end) {
        this.grid = maze;
        this.start = start;
        this.end = end;
        this.current = start;
        this.trace = [];
        this.solved = false;
        // init grid, set all to visited = false
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                this.grid.get(c, r).visited = false;
            }
        }
    }

    step() {
        if (this.solved) return; // do nothing if already solved
        this.current.visited = true;
        // get neighbours and select the ones not yet visited
        let n = this.current.getConnectedNeighbours();
        let unvisited = [];
        for (let i = 0; i < n.length; i++) {
            if (!n[i].visited)
                unvisited.push(n[i]);
        }
        // if there is one not visited yet, put it on the stack
        if (unvisited.length>0) {
            this.trace.push(this.current);
            this.current =  unvisited[0];
            // this.current =  unvisited[Math.floor(Math.random() * unvisited.length)];
            if (this.current === this.end)
                this.solved = true;
        } else {
            // otherwise pop from stack
            this.current = this.trace.pop();
        }
    }
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

    // get all neighbours, not separated by a wall.
    getConnectedNeighbours() {
        let neighbours = [];
        for (let i = 0; i < this.edges.length; i++) {
            let e = this.edges[i];
            let nodeOther = e.a;
            if (e.a === this) {
                nodeOther = e.b;
            }
            if (!e.isWall)
                neighbours.push(nodeOther);
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