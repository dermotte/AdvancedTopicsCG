let branchLength = 30;
let minimumWeight = 0.05;
let stemAngle;

function setup() {
    createCanvas(800, 800);
    stemAngle = radians(35);
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
        direction: p5.Vector.normalize(growDirection),
        weight: 1
    });
    splitBranch(endPosition, 1, p5.Vector.normalize(growDirection));
}

function draw() {
    background(255);
    stroke('brown');
    for (let i = 0; i < tree.length; i++) {
        branch = tree[i];
        strokeWeight(branch.weight*10);
        line(branch.start.x, branch.start.y, branch.end.x, branch.end.y);
    }
}

function splitBranch(startPoint, weight, growDirection) {
    // make it stop at a certain level:
    let alpha = Math.random()*0.2+0.1;
    if (weight < minimumWeight) return;

    // stem angle
    // stemAngle = radians(Math.random()*45+45)*Math.sign(Math.random()-0.5);
    let angle = radians(Math.random()*30+45)*Math.sign(Math.random()-0.5);
    let stemWeight = weight*(1-alpha)*1.2;
    let branchWeight = weight*alpha*1.6;
    let stemAngle = -branchWeight/(stemWeight+branchWeight) * angle;
    let branchAngle = stemWeight/(stemWeight+branchWeight) * angle;
    // stem first --------
    // change direction of growth:
    let growDirectionLeft = p5.Vector.rotate(growDirection.copy(), stemAngle).mult(branchLength*stemWeight);
    // find the end point of the branch with vector addition:
    let endPositionLeft = p5.Vector.add(startPoint, growDirectionLeft);
    // add it to the tree
    tree.push({start: startPoint.copy(), end: endPositionLeft.copy(), weight: stemWeight});
    // recursively add more
    splitBranch(endPositionLeft, stemWeight, p5.Vector.normalize(growDirectionLeft));

    // branch follows --------
    // change direction of growth:
    let growDirectionRight = p5.Vector.rotate(growDirection.copy(), branchAngle).mult(branchLength*branchWeight);
    // find the end point of the branch with vector addition:
    let endPositionRight = p5.Vector.add(startPoint, growDirectionRight);
    // add it to the tree
    tree.push({start: startPoint.copy(), end: endPositionRight.copy(), weight: branchWeight});
    // recursively add more
    splitBranch(endPositionRight, branchWeight, p5.Vector.normalize(growDirectionRight));
}