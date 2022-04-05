// initial height map noise
let noiseVal;
let noiseScale = 0.03;
// buffer images for fast creation
let buffer;
let pxBuffer;
let original_noise;
let showOriginal = false;
// thermal erosion parameters
let erosionThreshold = 4;
let iterations = 0;

function setup() {
    createCanvas(1280, 720);
    buffer = createImage(width, height);
    // let canvas = createCanvas(1280, 720, WEBGL);
    buffer = createHeightMap();
    frameRate(15);
    // init noise image
}

function draw() {
    background(0);
    if (showOriginal) {
        image(original_noise, 0, 0);
        text("original noise", 20, 20);
    } else {
        image(buffer, 0, 0);
        text(++iterations + " thermal erosion iterations", 20, 20);
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
    for (let i = 0; i< img.pixels.length; i++) {
        img.pixels[i] = pxBuffer[i];
    }
    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            let currentValue = img.pixels[offset(x, y)];
            if (img.pixels[offset(x-1, y)]-currentValue>erosionThreshold) {
                currentValue += (img.pixels[offset(x - 1, y)] - currentValue)/4;
                writeColor(img, x-1, y, img.pixels[offset(x - 1, y)]-(img.pixels[offset(x - 1, y)] - currentValue)/4)
            }
            if (img.pixels[offset(x+1, y)]-currentValue>erosionThreshold) {
                currentValue += (img.pixels[offset(x + 1, y)] - currentValue)/4;
                writeColor(img, x+1, y, img.pixels[offset(x + 1, y)]-(img.pixels[offset(x + 1, y)] - currentValue)/4)
            }
            if (img.pixels[offset(x, y-1)]-currentValue>erosionThreshold) {
                currentValue += (img.pixels[offset(x, y - 1)] - currentValue)/4;
                writeColor(img, x, y-1, img.pixels[offset(x , y-1)]-(img.pixels[offset(x, y-1)] - currentValue)/4)
            }
            if (img.pixels[offset(x, y+1)]-currentValue>erosionThreshold) {
                currentValue += (img.pixels[offset(x, y + 1)] - currentValue)/4;
                writeColor(img, x, y+1, img.pixels[offset(x , y+1)]-(img.pixels[offset(x , y+1)] - currentValue)/4)
            }
            // noiseDetail of the pixels octave count and falloff value
            writeColor(img, x, y, currentValue);
        }
    }
    pxBuffer = img.pixels;
    img.updatePixels();
    return img;
}

function offset(x,y) {
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
            writeColor(img, x, y, noiseVal*255);
        }
    }
    original_noise = img;
    pxBuffer = img.pixels;
    img.updatePixels();
    return img;
}

// much faster image writing ..
function writeColor(image, x, y, val) {
    let index = (x + y * width) * 4;
    image.pixels[index] = val;
    image.pixels[index + 1] = val;
    image.pixels[index + 2] = val;
    image.pixels[index + 3] = 255;
}