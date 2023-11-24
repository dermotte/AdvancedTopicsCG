/*
 * Intuitive implementation of WFC version 3 with sockets
 * Still missing is the propagation of possible tiles beyond the immediate neighbours
 */
let grid = [];
let sizeX = 20;
let sizeY = 11;
let img = [];
let cellsize = 64;

let rule;
/*
 * sockets: starting north and giving the id clockwise.
 */
let tiles = [
    {
        file: "blank.png",
        priority: 2,
        rotation: 0,
        sockets: [
            [1, 2], [1, 2], [1, 2], [1, 2]
        ]
    },
    {
        file: "forest1.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [2], [2], [2], [2]
        ]
    },
    {
        file: "forest2.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [2], [2], [2], [2]
        ]
    },
    {
        file: "forest3.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [2, 3], [2, 3], [2, 3], [2, 3]
        ]
    },
    {
        file: "forest4.png",
        priority: 30,
        rotation: 0,
        sockets: [
            [3], [3], [3], [3]
        ]
    },    
    {
        file: "stumps1.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1, 5], [1, 5], [1, 5], [1, 5]
        ]
    },
    {
        file: "stumps2.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [5, 6],[5, 6],[5, 6],[5, 6]
        ]
    },
    {
        file: "stumps3.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [6, 7],[6, 7],[6, 7],[6, 7]
        ]
    },
    {
        file: "stumps4.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [7],[7],[7],[7]
        ]
    },
    {
        file: "road_h.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [8], [1], [8]
        ]
    },
    {
        file: "road_v.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [8], [1], [8], [1]
        ]
    },
    {
        file: "de01.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [8], [1], [1], [1]
        ]
    },
    {
        file: "de02.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [8], [1], [1]
        ]
    },
    {
        file: "de03.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [1], [8], [1]
        ]
    },
    {
        file: "de04.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [1], [1], [8]
        ]
    },
    {
        file: "corner_01.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [8], [8], [1], [1]
        ]
    },
    {
        file: "corner_02.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [8], [8], [1]
        ]
    },
    {
        file: "corner_03.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [1], [1], [8], [8]
        ]
    },
    {
        file: "corner_04.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [8], [1], [1], [8]
        ]
    },
    {
        file: "crossing.png",
        priority: 1,
        rotation: 0,
        sockets: [
            [8], [8], [8], [8]
        ]
    }
]

let proto = []


function preload() {
    // pre-load tiles
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.image = loadImage("tiles/" + tile.file)
    }
    // createProto();
    createRules();
}

function createRules() {
    // generate neighbour lists:
    rule = [];
    for (let i = 0; i < tiles.length; i++) {
        const current = tiles[i];
        let current_rule = [[],[],[],[]]
        for (let j = 0; j < tiles.length; j++) {
            for (let dir = 0; dir < 4; dir++) { // check for each direction and add compatible tiles.
                if (joint_set(current.sockets[dir], tiles[j].sockets[(dir + 2) % 4]).length > 0) {
                    current_rule[dir].push(j);
                }
            }
        }
        rule.push(current_rule)
    }
}

function setup() {
    createCanvas(1280, 720);
    // init grid with all possible tiles ..
    for (let x = 0; x < sizeX; x++) {
        grid.push([]);
        for (let y = 0; y < sizeY; y++) {
            grid[x].push({collapsed: false, dirty: false, tiles: [...Array(tiles.length).keys()]});
        }
    }

    // pre set some tiles ...
    for (let y = 0; y < sizeY; y++) {
        grid[0][y] = {collapsed: true, dirty: true, tiles: [0]};
        grid[sizeX - 1][y] = {collapsed: true, dirty: true, tiles: [0]};
    }
    for (let x = 0; x < sizeX; x++) {
        grid[x][0] = {collapsed: true, dirty: true, tiles: [0]};
        grid[x][sizeY-1] = {collapsed: true, dirty: true, tiles: [0]};
    }
    grid[0][5] = {collapsed: true, dirty: true, tiles: [9]}
    grid[sizeX-1][6] = {collapsed: true, dirty: true, tiles: [9]}
    grid[7][0] = {collapsed: true, dirty: true, tiles: [10]}
    grid[5][sizeY-1] = {collapsed: true, dirty: true, tiles: [10]}
}

function draw() {
    background(255);
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            if (grid[x][y].collapsed)
                image(tiles[grid[x][y].tiles[0]].image, cellsize * x, cellsize * y, cellsize, cellsize);
        }
    }
    if (!isFinished()) waveFunctionCollapse();
}

function isFinished() {
    let result = true;
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            if (!grid[x][y].collapsed) result = false;
        }
    }
    return result;
}

function isDirty() {
    let result = false;
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            if (grid[x][y].dirty) return true;
        }
    }
    return result;
}

function waveFunctionCollapse() {
    collapse();
    propagate();
}

function collapse() {
    const min = {x: -1, y: -1, entropy: 100};
    for (let y = sizeY - 1; y >= 0; y--) {
        for (let x = 0; x < sizeX; x++) {
            if (grid[x][y].tiles.length < min.entropy && !grid[x][y].collapsed) {
                min.x = x;
                min.y = y;
                min.entropy = grid[x][y].tiles.length;
            }
        }
    }
    let _candidates = []
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (grid[x][y].tiles.length == min.entropy) {
                _candidates.push({x:x, y:y});
            }
        }
    }
    let _c = _candidates[Math.floor(Math.random()*_candidates.length)]
    min.x = _c.x;
    min.y = _c.y;
    if (grid[min.x][min.y].tiles.length > 1) {
        // This implements the priority of different tiles:
        let l = []
        for (let i = 0; i < grid[min.x][min.y].tiles.length; i++) {
            const tile = grid[min.x][min.y].tiles[i];
            for (let k = 0; k < tiles[tile].priority; k++) {
                l.push(tile);
            }
        }
        grid[min.x][min.y].tiles = [l[Math.floor(Math.random() * l.length)]];
    }
    grid[min.x][min.y].collapsed = true;
    grid[min.x][min.y].dirty = true;
}

function propagate() {
    let cnt = 1000; // terminate for sure?
    while (isDirty() && cnt-- > 0) {
        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                if (grid[x][y].dirty) {
                    let r = rule[grid[x][y].tiles[0]];
                    let dirty = false;
                    dirty = dirty || setCandidates({x: x, y: y}, 0, r[0]);
                    dirty = dirty || setCandidates({x: x, y: y}, 1, r[1]);
                    dirty = dirty || setCandidates({x: x, y: y}, 2, r[2]);
                    dirty = dirty || setCandidates({x: x, y: y}, 3, r[3]);
                    grid[x][y].dirty = dirty;
                }
            }
        }
    }
}

/**
 *
 * @param pos
 * @param direction
 * @param list
 * @returns {boolean} true if it changes something ..
 */
function setCandidates(pos, direction, list) {
    // find appropriate cell
    let c = {x: 0, y: 0};
    if (direction === 0) { // north
        c.y = -1;
        c.x = 0;
    } else if (direction === 2) { // south
        c.y = 1;
        c.x = 0;
    } else if (direction === 1) { // east
        c.y = 0;
        c.x = 1;
    } else if (direction === 3) { // west
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
        // check if collapsed already:
        if (grid[pos.x + c.x][pos.y + c.y].tiles.length === 1) { // collapsed
            grid[pos.x + c.x][pos.y + c.y].tiles.collapsed = true;
            grid[pos.x + c.x][pos.y + c.y].dirty = true;
        } else if (tmplist.length === grid[pos.x + c.x][pos.y + c.y].tiles)
            return true;
        else grid[pos.x + c.x][pos.y + c.y].dirty = true;
    }
    return false
}

function joint_set(list1, list2) {
    return list1.filter(function (element) {
        return list2.includes(element);
    });
}

function rotate_and_draw_image(img_x, img_y, img_width, img_height, img_angle){
    imageMode(CENTER);
    translate(img_x+img_width/2, img_y+img_width/2);
    rotate(PI/180*angle);
    image(img, 0, 0, img_width, img_height);
    rotate(-PI / 180 * img_angle);
    translate(-(img_x+img_width/2), -(img_y+img_width/2));
    imageMode(CORNER);
}
