// initial height map noise
let noiseVal;
let noiseScale = 0.02;
let noise_width = 640;
let noise_height = 360;
// buffer images for fast creation visualization
let buffer;
let water_overlay;
let original_noise;
let showOriginal = false;
let erode = true;
let showWater = true;
// hydraulic erosion parameters
let rain_amount = 12;   // how much rain per iteration
let solubility = 0.2;   // how much soil is eroded by one unit of water
let evaporation = 1.3; // how much water evaporates each step?
let capacity = 0.5;    // how much soil can be carried by one unit of water
let deposition = 0.2;  // how much soil is deposited if water does not move
let iterations = 0;    // current number of iterations
// data tables
let table_terrain = [];
let table_water = [];
let table_sediment = [];

function setup() {
    createCanvas(640, 360);
    // let canvas = createCanvas(1280, 720, WEBGL);
    buffer = createImage(noise_width, noise_height);
    buffer = createHeightMap();
    original_noise = buffer;
    water_overlay = buffer;
    frameRate(6);
}

function draw() {
    background(125);
    if (showOriginal) {
        // image(buffer, 0, 0);
        // buffer = evaporateAndUpdate();
        image(original_noise, 0, 0);
        text("original noise", 20, 20);
    } else {
        image(buffer, 0, 0);
        if (showWater) image(water_overlay, 0, 0);
        // if (iterations < 30) {
            text(++iterations + " hydraulic erosion iterations", 20, 20);
            buffer = erodeHeightMap();
        // }

    }
    // buffer = erodeHeightMap();
}

function mouseClicked(event) {
    console.log(event);
    showWater = !showWater;
}

function erodeHeightMap() {
    // rainfall & erosion:
    let table_water_moved = Array(noise_height).fill().map(() => Array(noise_width));
    let table_sediment_moved = Array(noise_height).fill().map(() => Array(noise_width));
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            table_water_moved[y][x] = 0;
            table_sediment_moved[y][x] = 0;
        }
    }
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            // rainfall
            if (iterations % 10 == 0) // every n-th iteration it rains ..
                table_water[y][x] += rain_amount;
            // erosion
            // let eroded_sediment = table_water[y][x] * solubility;
            // eroded_sediment = min(table_terrain[y][x], eroded_sediment); // make sure not more than available is eroded
            let eroded_sediment = Math.min(Math.max(0, table_water[y][x]*capacity-table_sediment[y][x]), table_water[y][x] * solubility, table_terrain[y][x]); // make sure it does not exceed the capacity
            table_sediment[y][x] += eroded_sediment;
            table_terrain[y][x] -= eroded_sediment;
            // downhill movement
            if (x > 1 && x < noise_width - 2 && y > 1 && y < noise_height - 2 && table_water[y][x] > 1) {
                let sedimentToMove = table_sediment[y][x]; // how much sediment can be moved ..
                let waterToMove = table_water[y][x];
                let mov = computeMovement(x, y);
                let rem_sed = 0;
                let rem_wat = 0;
                for (let yy = -1; yy <= 1; yy++) {
                    for (let xx = -1; xx <= 1; xx++) {
                        // if (!(xx === 0 && yy === 0)) {
                            table_sediment_moved[y + yy][x + xx] += sedimentToMove * mov[yy + 1][xx + 1];
                            rem_sed += sedimentToMove * mov[yy + 1][xx + 1];
                            table_water_moved[y + yy][x + xx] += waterToMove * mov[yy + 1][xx + 1];
                            rem_wat += waterToMove * mov[yy + 1][xx + 1]
                        // }
                    }
                }
                table_sediment_moved[y][x] -= rem_sed;
                table_water_moved[y][x] -= rem_wat;
                if (rem_wat < 0.01) {
                    // deposit here ..
                    let s = table_sediment[y][x] * deposition;
                    table_sediment_moved[y][x] -= s;
                    table_terrain[y][x] += s;
                }
            }
        }
    }
    for (let y = 1; y < noise_height-1; y++) {
        for (let x = 1; x < noise_width-1; x++) {
            table_water[y][x] += table_water_moved[y][x];
            table_sediment[y][x] += table_sediment_moved[y][x];
        }
    }
    return evaporateAndUpdate();
}

function evaporateAndUpdate() {
    let maxWater = 0;
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            // evaporation in the water table
            table_water[y][x] -= table_water[y][x] * evaporation;
            // table_water[y][x] -= Math.min(evaporation, table_water[y][x]);
            maxWater = Math.max(table_water[y][x], maxWater);
            // dropping sediment according to current water level
            let overflow = table_water[y][x] * capacity - table_sediment[y][x];
            if (overflow < 0) {
                table_sediment[y][x] += overflow;
                table_terrain[y][x] -= overflow;
            }
        }
    }

    water_overlay = createImage(noise_width, noise_height);
    water_overlay.loadPixels();
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            writeRGBColor(water_overlay, x, y, 0, 0, 255, map(table_water[y][x], 0, maxWater, 0, 196));
        }
    }
    water_overlay.updatePixels();
    // console.log(maxWater);
    let img = createImage(noise_width, noise_height);
    img.loadPixels();
    // configure noise
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            writeColor(img, x, y, table_terrain[y][x]);
            // use if you want to show how much soil is in the water ..
            // writeColor(img, x, y, table_terrain[y][x] + table_sediment[y][x]);
        }
    }
    img.updatePixels();
    return img;
}

function computeMovement(x, y) {
    let a = table_terrain[y][x] + table_water[y][x] + table_sediment[y][x];
    let amount = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let sum = 0;
    for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
            amount[yy + 1][xx + 1] = (table_terrain[y + yy][x + xx] + table_water[y + yy][x + xx] + table_sediment[y + yy][x + xx]) - a;
            amount[yy + 1][xx + 1] = Math.min(amount[yy + 1][xx + 1], 0);
            sum  += amount[yy + 1][xx + 1];
        }
    }
    if (sum > -0.2) return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let yy = 0; yy < 3; yy++) {
        for (let xx = 0; xx < 3; xx++) {
            if (amount[yy][xx] > 0) amount[yy][xx] = 0;
            else amount[yy][xx] = amount[yy][xx] / sum;
        }
    }
    return amount;
}

/**
 * Initial creation of the height map.
 */
function createHeightMap() {
    // init tables:
    table_terrain = Array(noise_height).fill().map(() => Array(noise_width));
    table_water = Array(noise_height).fill().map(() => Array(noise_width));
    table_sediment = Array(noise_height).fill().map(() => Array(noise_width));
    // create noise for terrain and init all tables:
    let img = createImage(noise_width, noise_height);
    img.loadPixels();
    // configure noise
    noiseDetail(7, 0.5);
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            // noiseDetail of the pixels octave count and falloff value
            noiseVal = noise((x) * noiseScale, (y) * noiseScale);
            writeColor(img, x, y, noiseVal * 255);
            // init values for tables:
            table_terrain[y][x] = noiseVal * 255;
            table_water[y][x] = 0;
            table_sediment[y][x] = 0;
        }
    }
    img.updatePixels();
    return img;
}

/**
 * Writes a value into an image using the faster method.
 */
function writeColor(image, x, y, val) {
    writeRGBColor(image, x, y, val, val, val, 255);
    // false color
    // writeRGBColor(image, x, y, map(val, 0, 128, 0, 255), map(val, 129, 255, 255, 0), 0, 255);
}
/**
 * Writes a value into an image using the faster method.
 */
function writeRGBColor(image, x, y, r, g, b, a) {
    let index = (x + y * noise_width) * 4;
    image.pixels[index] = r;
    image.pixels[index + 1] = g;
    image.pixels[index + 2] = b;
    image.pixels[index + 3] = a;
}

/**
 * Helper function to access pixel values in an image (RBGA but grey).
 * @param x coordinate of the pixel
 * @param y coordinate of the pixel
 * @returns {number} value of the pixel
 */
function offset(x, y) {
    return (y * noise_width + x) * 4;
}
