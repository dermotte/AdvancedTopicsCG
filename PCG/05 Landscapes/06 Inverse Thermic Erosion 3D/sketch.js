// initial height map noise
let noiseVal;
let noiseScale = 0.03;
let noise_width = 300;
let noise_height = 300;
// buffer images for fast creation
let buffer;
let pxBuffer;
let original_noise;
let showOriginal = false;
// thermal erosion parameters
let erosionThreshold = 8;
let iterations = 0;
// triangulation:
let z_scale = 10;
let mainScale = 50;
let noiseSamples;
let cameraY = 2000;
let x_resolution = 50;
let y_resolution = 50;

function setup() {
    // createCanvas(640, 360);
    buffer = createImage(noise_width, noise_height);
    let canvas = createCanvas(1280, 720, WEBGL);
    buffer = createHeightMap();
    original_noise = buffer;
    frameRate(12);
}

function draw() {
    background(125);
    // if (showOriginal) {
    //     image(original_noise, 0, 0);
    //     text("original noise", 20, 20);
    // } else {
    //     image(buffer, 0, 0);
    //     text(++iterations + " inverse thermal erosion iterations", 20, 20);
    //     buffer = erodeHeightMap();
    // }
    camera(0, -500, cameraY, 0, 0, 0)
    directionalLight(0, 150, 0, 1, 1, 0);
    rotateY(radians(mouseX));
    pointLight(250, 50, 250, 0, -500, 0);
    scale(mainScale);
    rotateX(PI / 2);
    translate(-x_resolution/2, -2*y_resolution/3, -z_scale);
    // box(10);
    beginShape(TRIANGLES);

    for (let y = 0; y < y_resolution-1; y++) {
        for (let x = 0; x < x_resolution-1; x++) {

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
    buffer = erodeHeightMap();

}

function mouseClicked() {
    console.log("clicked");
    showOriginal = !showOriginal;
}

function erodeHeightMap() {
    noiseSamples = [];
    let x_step = noise_width / x_resolution;
    let y_step = noise_height / y_resolution;
    let img = createImage(noise_width, noise_height);
    img.loadPixels();
    // copy buffer, clone does not work ?!?
    for (let i = 0; i < img.pixels.length; i++) {
        img.pixels[i] = pxBuffer[i];
    }
    for (let y = 1; y < noise_height - 1; y++) {
        for (let x = 1; x < noise_width - 1; x++) {
            let currentValue = img.pixels[offset(x, y)];
            let countLower = 0;
            let countHigher = 0;
            // count how many neighbours are smaller ..
            for (let xx = -1; xx <= 1; xx++) {
                for (let yy = -1; yy <= 1; yy++) {
                    if (Math.abs(currentValue - img.pixels[offset(x+xx, y+yy)] <= erosionThreshold)) {
                        countLower++;
                    }
                }
            }
            // console.log(countLower);
            // deposit some material there ..
            let oldHeight = currentValue
            if (countLower > 0) {
                // console.log("*");
                for (let xx = -1; xx <= 1; xx++) {
                    for (let yy = -1; yy <= 1; yy++) {
                        if (Math.abs(oldHeight - img.pixels[offset(x+xx, y+yy)]) <= erosionThreshold) {
                            currentValue -= (oldHeight - img.pixels[offset(x+xx, y+yy)]) / (countLower + 1);
                            writeColor(img, x+xx, y+yy, img.pixels[offset(x+xx, y+yy)] + (oldHeight - img.pixels[offset(x+xx, y+yy)]) / (countLower + 1));
                        }
                    }
                }
                writeColor(img, x, y, currentValue);
            }
        }
    }
    pxBuffer = img.pixels;
    img.updatePixels();
    for (let y = 0; y < noise_width; y += y_step) {
        noiseSamples.push([]);
        for (let x = 0; x < noise_width; x += x_step) {
            let myNoise = pxBuffer[offset(x, y)]/255;
            noiseSamples[noiseSamples.length-1].push(myNoise);
        }
    }

    return img;
}

function offset(x, y) {
    return (y * noise_width + x) * 4;
}

function createHeightMap() {
    noiseSamples = [];
    let x_step = noise_width / x_resolution;
    let y_step = noise_height / y_resolution;

    let img = createImage(noise_width, noise_height);
    img.loadPixels();
    // configure noise
    noiseDetail(7, 0.5);
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            // noiseDetail of the pixels octave count and falloff value
            noiseVal = noise((x) * noiseScale, (y) * noiseScale);
            // noiseVal = Math.floor(noiseVal*6)/6;
            writeColor(img, x, y, noiseVal * 255);
            // img.set(x, y, color(noiseVal * 255));
        }
    }
    pxBuffer = img.pixels;
    img.updatePixels();

    for (let y = 0; y < noise_width; y += y_step) {
        noiseSamples.push([]);
        for (let x = 0; x < noise_width; x += x_step) {
            let myNoise = pxBuffer[offset(x, y)]/255;
            noiseSamples[noiseSamples.length-1].push(myNoise);
        }
    }
    return img;
}

function writeColor(image, x, y, val) {
    let index = (x + y * noise_width) * 4;
    image.pixels[index] = val;
    image.pixels[index + 1] = val;
    image.pixels[index + 2] = val;
    image.pixels[index + 3] = 255;
}