/*
 * Intuitive implementation missing part of the "collapse" version 2
 * Still missing is the propagation of possible tiles beyond the immediate neighbours
 */
let grid = [];
let sizeX = 30;
let sizeY = 16;
let img = [];
let cellsize = 64;

let rule;

let tiles = []

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
    img.push(loadImage("de04.png")); // 15
    img.push(loadImage("forest1.png")); // 16
    img.push(loadImage("forest2.png")); // 17
    img.push(loadImage("forest3.png")); // 18
    img.push(loadImage("forest4.png")); // 19
    img.push(loadImage("forest5.png")); // 20
    img.push(loadImage("forest6.png")); //
    img.push(loadImage("forest7.png")); // 22
    img.push(loadImage("forest8.png")); //
    img.push(loadImage("stumps1.png")); // 24
    img.push(loadImage("stumps2.png")); //
    img.push(loadImage("stumps3.png")); // 26
    img.push(loadImage("stumps4.png")); //

    // defining road connections clockwise starting north
    tiles.push([0, 0, 0, 0]); // 0
    tiles.push([0, 1, 0, 1]);
    tiles.push([1, 0, 1, 0]); // 2
    tiles.push([1, 1, 0, 0]); // 3
    tiles.push([0, 1, 1, 0]);
    tiles.push([0, 0, 1, 1]); // 5
    tiles.push([1, 0, 0, 1]); // 6
    tiles.push([1, 1, 1, 1]); // 7
    tiles.push([1, 1, 0, 1]); // 8
    tiles.push([1, 1, 1, 0]); // 9
    tiles.push([0, 1, 1, 1]); // 10
    tiles.push([1, 0, 1, 1]); // 11
    tiles.push([1, 0, 0, 0]); // 12
    tiles.push([0, 1, 0, 0]); // 13
    tiles.push([0, 0, 1, 0]); // 14
    tiles.push([0, 0, 0, 1]); // 15
    tiles.push([0, 0, 0, 0]); // 16
    tiles.push([0, 0, 0, 0]); // 17
    tiles.push([0, 0, 0, 0]); // 18
    tiles.push([0, 0, 0, 0]); // 19
    tiles.push([0, 0, 0, 0]); // 20
    tiles.push([0, 0, 0, 0]); //
    tiles.push([0, 0, 0, 0]); // 22
    tiles.push([0, 0, 0, 0]); //
    tiles.push([0, 0, 0, 0]); // 24
    tiles.push([0, 0, 0, 0]); //
    tiles.push([0, 0, 0, 0]); // 26
    tiles.push([0, 0, 0, 0]); //

    createRules()
}

function createRules() {
    rule = []
    for (let i = 0; i < tiles.length; i++) {
        const current = tiles[i];
        let current_rule = {n: [], e: [], s: [], w: []}
        for (let j = 0; j < tiles.length; j++) {
            for (let dir = 0; dir < 4; dir++) { // check for each direction and add compatible tiles.
                if (current[dir] === tiles[j][(dir+2)%4]) {
                    if (dir === 0) { // n
                        current_rule.n.push(j)
                    } else if (dir === 1) { // e
                        current_rule.e.push(j)
                    } else if (dir === 2) { // s
                        current_rule.s.push(j)
                    } else if (dir === 3) { // w
                        current_rule.w.push(j)
                    }
                }
            }
        }
        rule.push(current_rule)
    }
}

function setup() {
    createCanvas(1920, 1080);
    // init grid
    for (let x = 0; x < sizeX; x++) {
        grid.push([]);
        for (let y = 0; y < sizeY; y++) {
            // grid[x].push({collapsed: false, dirty: false, tiles: [0, 1, 2, 3, 4, 5, 6, 7]});
            grid[x].push({ collapsed: false, dirty: false, tiles: [...Array(tiles.length).keys()] });
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
    let min = {x: -1, y: -1, entropy: 100};
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
    while (isDirty && cnt-- > 0) {
        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                if (grid[x][y].dirty) {
                    let r = rule[grid[x][y].tiles[0]];
                    setCandidates({x: x, y: y}, "n", r.n);
                    setCandidates({x: x, y: y}, "s", r.s);
                    setCandidates({x: x, y: y}, "e", r.e);
                    setCandidates({x: x, y: y}, "w", r.w);
                    grid[x][y].dirty = false;
                }
            }
        }
    }
}

function setCandidates(pos, direction, list) {
    // find appropriate cell
    let c = {x: 0, y: 0};
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
    }
}

function joint_set(list1, list2) {
    return list1.filter(function (element) {
        return list2.includes(element);
    });
}
