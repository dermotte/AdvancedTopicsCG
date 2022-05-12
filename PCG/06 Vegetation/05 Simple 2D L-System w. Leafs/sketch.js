
let tree
let branchLength = 100
let minimumWeight = 0.03
let iteration

function setup() {
    createCanvas(800, 800);
    // randomSeed(100); // fix the RNG to a seed
    createTree();
    frameRate(30);
}

function createTree() {
    tree = [];
    iteration = 0;
    let grow = createVector(0, -branchLength);
    let position = createVector(400, 800);
    let newPosition = p5.Vector.add(position, grow);
    tree.push({start: position.copy(), end: newPosition.copy(), weight: 1, isLeaf:false, direction:p5.Vector.normalize(grow)});
    splitBranch(newPosition, 1, p5.Vector.normalize(grow));
    print(tree.length)
}

function mouseReleased() {
    // createTree();
}

function draw() {
    background(255);
    iteration+=150;

    for (let i = 0; i< min(tree.length, iteration); i++) {
        branch = tree[i];
        if (branch.isLeaf)
            stroke('green');
        else
            stroke('brown');
        strokeWeight(branch.weight*10);
        line(branch.start.x, branch.start.y, branch.end.x, branch.end.y);
        if (branch.isLeaf) { // create a leaf ..
            fill(color('#33aa33'))
            p1 = p5.Vector.sub(branch.end, branch.start).normalize();
            p2 = createVector(p1.y, -p1.x)
            tmp = p5.Vector.add(branch.end, p1.mult(10));
            t2 = p5.Vector.add(tmp, p2.mult(5));
            t3 = p5.Vector.add(tmp, p2.mult(-1));
            triangle(branch.end.x, branch.end.y, t2.x, t2.y, t3.x, t3.y)
        }
        if (i > iteration) return;
        // print(branch);

    }
}

function splitBranch(p, weight, gd) {
    if (weight < minimumWeight) return;
    // split weight
    let alpha = random(0.25, 0.35);
    let stemWeight = weight*(1-alpha)*1.2;
    let branchWeight = weight*alpha*1.6;
    // create angle
    let angle = radians(random(45, 90))*random([-1, 1]);
    let stemAngle = - branchWeight/(stemWeight+branchWeight) * angle // less angle for the stem
    let branchAngle = stemWeight/(stemWeight+branchWeight) * angle   // more angle for the branch
    // create stem
    let g1 = p5.Vector.rotate(gd.copy().mult(branchLength*stemWeight), stemAngle)
    let n1 = p5.Vector.add(p, g1);
    tree.push({start: p.copy(), end: n1.copy(), weight:stemWeight,  isLeaf:(stemWeight<minimumWeight)});
    splitBranch(n1, stemWeight, p5.Vector.normalize(g1));
    // create Branch:
    let g2 = p5.Vector.rotate(gd.copy().mult(branchLength*branchWeight), branchAngle);
    let n2 = p5.Vector.add(p, g2);
    tree.push({start: p.copy(), end: n2.copy(), weight:branchWeight, isLeaf:(branchWeight<minimumWeight)});
    splitBranch(n2, branchWeight, p5.Vector.normalize(g2));
}