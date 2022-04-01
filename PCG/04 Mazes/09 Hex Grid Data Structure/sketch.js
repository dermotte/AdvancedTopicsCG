let maze;
let cell;             // current cell
let visited = 0;      // terminate when all cells visited
let steps = 100000;   // maximum number of steps, just to be sure

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
    blockSizeX = width / size_x;
    blockSizeY = height / size_y;
    // while ((visited < size_x * size_y) && (--steps > 0))
    //     nextStep();
}

function draw() {
    background(255);
    let radius = blockSizeY/2;
    let hex_width = radius * Math.sqrt(3)
    let hs = hex_width / 2;
    stroke(0);
    strokeWeight(2);
    for (let x = 0; x < size_x; x++) {
        for (let y = 0; y < size_y; y++) {
            let py = (y+1) * radius * 1.5;
            let px = (y%2)*hs + (x+1) * hex_width;

            if (maze.get(x, y).hasWall("a")) {
                hexagonwall(px, py, radius, 0)
            }
            if (maze.get(x, y).hasWall("b")) {
                hexagonwall(px, py, radius, 1)
            }
            if (maze.get(x, y).hasWall("c")) {
                hexagonwall(px, py, radius, 2)
            }
            if (maze.get(x, y).hasWall("d")) {
                hexagonwall(px, py, radius, 3)
            }
            if (maze.get(x, y).hasWall("e")) {
                hexagonwall(px, py, radius, 4)
            }
            if (maze.get(x, y).hasWall("f")) {
                hexagonwall(px, py, radius, 5)
            }
        }
    }
    if ((visited < size_x * size_y) && (--steps > 0)) {
        fill(0);
        let py = (cell.row+1) * radius * 1.5;
        let px = (cell.row%2)*hs + (cell.col+1) * hex_width;
        circle(px, py, radius / 2);
        nextStep();
    }
}

/**
 generates a maze with (x,y) cells. Note that the actual maze is
 larger as the maze cells are divided by rows and cols of walls.
 */
function initMaze(mazeSizeX, mazeSizeY) {
    maze = new Grid(mazeSizeX, mazeSizeY);
    // maze.get(1, 1).edges[0].isWall = false;
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

/**
 * segments are:
 * 5 / \ 0
 * 4 | | 1
 * 3 \ / 2
 */
function hexagonwall(_x, _y, radius, segment) {
    let angle = TWO_PI / 6.0;
    beginShape();
    let sx = _x + cos(angle * (segment-2)+Math.PI/6) * radius;
    let sy = _y + sin(angle * (segment-2)+Math.PI/6) * radius;
    vertex(sx, sy);
    sx = _x + cos(angle * (segment - 1)+Math.PI/6) * radius;
    sy = _y + sin(angle * (segment - 1)+Math.PI/6) * radius;
    vertex(sx, sy);
    endShape(CLOSE);
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
                if (c < this.cols - 1) {
                    // add edge 1 or b
                    new Edge(this.arr[r][c], this.arr[r][c + 1]);
                }
                if (r % 2 === 1) {
                    if (r < this.rows - 1) {
                        // add edges south 2,3 / c,d
                        new Edge(this.arr[r][c], this.arr[r + 1][c]);
                        if (c < this.cols - 1) {
                            new Edge(this.arr[r][c], this.arr[r + 1][c + 1]);
                        }
                    }
                    // add edges north 0, 5 / a, f
                    new Edge(this.arr[r][c], this.arr[r - 1][c]);
                    if (c < this.cols - 1) {
                        new Edge(this.arr[r][c], this.arr[r - 1][c + 1]);
                    }
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
            a: true, // 0
            b: true, // 1
            c: true, // 2
            d: true, // 3
            e: true, // 4
            f: true   // 5
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
                if (this.col < nodeOther.col)
                    this.walls["b"] = e.isWall;
                else
                    this.walls["e"] = e.isWall;
            } else { // vertical: north or south
                if (this.row < nodeOther.row) { // 2 or 3
                    if (this.col < nodeOther.col)
                        this.walls["c"] = e.isWall;
                    else if (this.col > nodeOther.col ){
                        this.walls["d"] = e.isWall;
                    } else {
                        if (this.row % 2 === 0) // 2 or 3
                            this.walls["c"] = e.isWall;
                        else
                            this.walls["d"] = e.isWall;
                    }
                } else { // 0 or 5
                    if (this.col < nodeOther.col)
                        this.walls["a"] = e.isWall;
                    else if (this.col > nodeOther.col ) {
                        this.walls["f"] = e.isWall;
                    } else {
                        if (this.row % 2 === 0) // 2 or 3
                            this.walls["a"] = e.isWall;
                        else
                            this.walls["f"] = e.isWall;
                    }
                }
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