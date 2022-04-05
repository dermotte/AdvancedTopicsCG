// initial height map noise
let noiseVal;
let noiseScale = 0.03;
// buffer images for fast creation
let buffer;
let pxBuffer;
let original_noise;
let showOriginal = false;
// thermal erosion parameters
let erosionThreshold = 8;
let iterations = 0;

function setup() {
    createCanvas(640, 360);
    buffer = createImage(width, height);
    // let canvas = createCanvas(1280, 720, WEBGL);
    buffer = createHeightMap();
    original_noise = buffer;
    frameRate(30);
}

function draw() {
    background(0);
    if (showOriginal) {
        image(original_noise, 0, 0);
        text("original noise", 20, 20);
    } else {
        image(buffer, 0, 0);
        text(++iterations + " inverse thermal erosion iterations", 20, 20);
        buffer = erodeHeightMap();
    }
}

function mouseClicked() {
    console.log("clicked");
    showOriginal = !showOriginal;
}

function erodeHeightMap() {
    let img = createImage(width, height);
    img.loadPixels();
    // copy buffer, clone does not work ?!?
    for (let i = 0; i < img.pixels.length; i++) {
        img.pixels[i] = pxBuffer[i];
    }
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
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
    return img;
}

function offset(x, y) {
    return (y * width + x) * 4;
}

function createHeightMap() {
    let img = createImage(width, height);
    img.loadPixels();
    // configure noise
    noiseDetail(7, 0.5);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // noiseDetail of the pixels octave count and falloff value
            noiseVal = noise((x) * noiseScale, (y) * noiseScale);
            // noiseVal = Math.floor(noiseVal*6)/6;
            writeColor(img, x, y, noiseVal * 255);
            // img.set(x, y, color(noiseVal * 255));
        }
    }
    pxBuffer = img.pixels;
    img.updatePixels();
    return img;
}

function writeColor(image, x, y, val) {
    let index = (x + y * width) * 4;
    image.pixels[index] = val;
    image.pixels[index + 1] = val;
    image.pixels[index + 2] = val;
    image.pixels[index + 3] = 255;
}