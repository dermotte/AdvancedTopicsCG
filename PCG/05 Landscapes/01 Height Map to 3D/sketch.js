let x_resolution = 50;
let y_resolution = 50;
let noiseScale = 0.02;
let z_scale = 3;
let noiseSamples;

function setup() {
    createCanvas(640, 480, WEBGL);
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
}

function draw() {
    background(220);
    rotateY(radians(mouseX));
    scale(50);
    rotateX(PI / 2);
    translate(-5, -5, -5);

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