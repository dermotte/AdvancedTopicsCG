let branchLength = 50;
let stemAngle;

function setup() {
    createCanvas(800, 800);
    stemAngle = radians(31);
    createTree();
    frameRate(30);
}

function createTree() {
    tree = [];
    iteration = 0;
    let growDirection = createVector(0, -branchLength);
    let startPosition = createVector(400, 800);
    let endPosition = p5.Vector.add(startPosition, growDirection);
    tree.push({
        start: startPosition.copy(),
        end: endPosition.copy(),
        direction: p5.Vector.normalize(growDirection)
    });
    splitBranch(endPosition, 1, p5.Vector.normalize(growDirection));
}

function draw() {
    background(255);
    stroke('brown');
    for (let i = 0; i < tree.length; i++) {
        branch = tree[i];
        line(branch.start.x, branch.start.y, branch.end.x, branch.end.y);
    }
}

function splitBranch(startPoint, level, growDirection) {
    // make it stop at a certain level:
    if (level > 4) return;

    // left side first --------
    // change direction of growth:
    let growDirectionLeft = p5.Vector.rotate(growDirection.copy(), -stemAngle).mult(branchLength);
    // find the end point of the branch with vector addition:
    let endPositionLeft = p5.Vector.add(startPoint, growDirectionLeft);
    // add it to the tree
    tree.push({start: startPoint.copy(), end: endPositionLeft.copy()});
    // recursively add more
    splitBranch(endPositionLeft, level+1, p5.Vector.normalize(growDirectionLeft));

    // right side follows --------
    // change direction of growth:
    let growDirectionRight = p5.Vector.rotate(growDirection.copy(), stemAngle).mult(branchLength);
    // find the end point of the branch with vector addition:
    let endPositionRight = p5.Vector.add(startPoint, growDirectionRight);
    // add it to the tree
    tree.push({start: startPoint.copy(), end: endPositionRight.copy()});
    // recursively add more
    splitBranch(endPositionRight, level+1, p5.Vector.normalize(growDirectionRight));
}