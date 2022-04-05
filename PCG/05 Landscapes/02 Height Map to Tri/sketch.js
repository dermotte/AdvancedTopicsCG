let x_resolution = 75;
let y_resolution = 75;
let noiseScale = 0.02;
let z_scale = 10;
let mainScale = 50;
let noiseSamples;
let cameraY = 200;

function setup() {
    let canvas = createCanvas(1280, 720, WEBGL);
    // canvas.mouseWheel(changeSize);
    createheightMap();
}

function createheightMap() {
    noiseSamples = [];
    let noise_width = 800;
    let noise_height = 800;
    let x_step = noise_width / x_resolution;
    let y_step = noise_height / y_resolution;
    noiseDetail(15, 0.4);
    for (let y = 0; y < noise_width; y += y_step) {
        noiseSamples.push([]);
        for (let x = 0; x < noise_width; x += x_step) {
            noiseSamples[noiseSamples.length-1].push(noise((x) * noiseScale, (y) * noiseScale));
        }
    }
    // noStroke();
}

function draw() {
    background(220);
    pointLight(250, 250, 250, -x_resolution/2*mainScale, -y_resolution/2*mainScale, 150);
    camera(0, 0, cameraY, 0, 0, 0)
    directionalLight(0, 250, 0, 1, 1, 0);
    rotateY(radians(mouseX));
    scale(mainScale);
    rotateX(PI / 2);
    translate(-x_resolution/2, 2*-y_resolution/3, -z_scale);
    beginShape(TRIANGLES);

    for (let y = 0; y < y_resolution-1; y++) {
        for (let x = 0; x < x_resolution-1; x++) {
            // todo: set z based on a hight map!
            let a = createVector(x, y, noiseSamples[y][x]*z_scale);
            let b = createVector(x, y + 1, noiseSamples[y+1][x]*z_scale);
            let c = createVector(x + 1, y, noiseSamples[y][x+1]*z_scale);
            let d = createVector(x + 1, y + 1, noiseSamples[y+1][x+1]*z_scale);
            vertex(a.x, a.y, a.z);
            vertex(b.x, b.y, b.z);
            vertex(c.x, c.y, c.z);

            vertex(b.x, b.y, b.z);
            vertex(c.x, c.y, c.z);
            vertex(d.x, d.y, d.z);
        }
    }

    endShape();
}

function changeSize(event) {
    if (event.deltaY > 0) {
        cameraY = cameraY + 50;
    } else {
        cameraY = cameraY - 50;
    }
}