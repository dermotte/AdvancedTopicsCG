let x_resolution = 50;
let y_resolution = 50;
let noiseScale = 0.02;
let z_scale = 10;
let noiseSamples;
let cameraY = 200;
let boxSize = 5;

function setup() {
    let canvas = createCanvas(1280, 720, WEBGL);
    // canvas.mouseWheel(changeSize);
    createheightMap();
    z_scale = z_scale*boxSize;
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
    strokeWeight(0.1);
    // noStroke();
}

function draw() {
    background(220);
    // pointLight(250, 250, 250, -x_resolution/2*50, -y_resolution/2*50, 150);
    camera(0, 0, cameraY, 0, 0, 0)
    // directionalLight(0, 250, 0, 1, 1, 0);
    rotateY(radians(mouseX));
    rotateX(PI / 2);
    translate(-x_resolution*boxSize/2, -y_resolution*boxSize/2, -boxSize*10)
    for (let y = 0; y < y_resolution-1; y++) {
        for (let x = 0; x < x_resolution-1; x++) {
            // scale(boxSize, boxSize, boxSize*noiseSamples[y][x]*z_scale);
            let scale = noiseSamples[y][x]*z_scale;
            translate(x*boxSize, y*boxSize, scale);
            box(boxSize);
            translate(-x*boxSize, -y*boxSize, -scale);
        }
    }
    // box(1);
}
