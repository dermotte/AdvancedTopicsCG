// initial height map noise
let noiseVal;
let noiseScale = 0.02;
let noise_width = 640;
let noise_height = 360;
// buffer images for fast creation visualization
let buffer;
let original_noise;
let showOriginal = false;
// hydraulic erosion parameters
let rain_amount = 4;   // how much rain per iteration
let solubility = 0.1   // how much soil is eroded by one unit of water
let evaporation = 0.6; // how much water evaporates each step?
let capacity = 0.3;    // how much soil can be carried by one unit of water
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
    frameRate(12);
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
        text(++iterations + " hydraulic erosion iterations", 20, 20);
        buffer = erodeHeightMap();
    }
    // buffer = erodeHeightMap();
}

function mouseClicked() {
    console.log("clicked");
    showOriginal = !showOriginal;
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
            table_water[y][x] += rain_amount;
            // erosion
            let eroded_sediment = table_water[y][x] * solubility;
            eroded_sediment = Math.min(table_terrain[y][x], eroded_sediment); // make sure not more than available is eroded
            table_sediment[y][x] += eroded_sediment;
            table_terrain[y][x] -= eroded_sediment;
            // downhill movement
            if (x > 1 && x < noise_width - 2 && y > 1 && y < noise_height - 2) {
                let mov = computeMovementDirection(x, y);
                let sedimentToMove = table_sediment[y][x]; // how much sediment can be moved ..
                let waterToMove = table_water[y][x];
                table_sediment_moved[y + mov.y][x + mov.x] += sedimentToMove;
                table_water_moved[y + mov.y][x + mov.x] += waterToMove;
                table_sediment_moved[y][x] -= sedimentToMove;
                table_water_moved[y][x] -= waterToMove;
                // let sedimentToMove = table_sediment[y][x]; // how much sediment can be moved ..
                // let waterToMove = table_water[y][x];
                // let mov = computeMovement(x, y);
                // let rem_sed = 0;
                // let rem_wat = 0;
                // for (let yy = -1; yy <= 1; yy++) {
                //     for (let xx = -1; xx <= 1; xx++) {
                //         if (!(xx === 0 && yy === 0) && mov[yy + 1][xx + 1] > 0.99) {
                //             table_sediment_moved[y + yy][x + xx] += sedimentToMove * mov[yy + 1][xx + 1];
                //             rem_sed += sedimentToMove * mov[yy + 1][xx + 1];
                //             table_water_moved[y + yy][x + xx] += waterToMove * mov[yy + 1][xx + 1];
                //             rem_wat += waterToMove * mov[yy + 1][xx + 1]
                //         }
                //     }
                // }
                // table_sediment_moved[y][x] -= rem_sed;
                // table_water_moved[y][x] -= rem_wat;
            }
        }
    }
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            table_water[y][x] += table_water_moved[y][x];
            table_sediment[y][x] += table_sediment_moved[y][x];
        }
    }
    return evaporateAndUpdate();
}

function evaporateAndUpdate() {
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            // evaporation in the water table
            table_water[y][x] -= table_water[y][x] * evaporation;
            // dropping sediment according to current water level
            let overflow = table_water[y][x] * capacity - table_sediment[y][x];
            if (overflow < 0) {
                table_sediment[y][x] += overflow;
                table_terrain[y][x] -= overflow;
            }
        }
    }

    let img = createImage(noise_width, noise_height);
    img.loadPixels();
    // configure noise
    for (let y = 0; y < noise_height; y++) {
        for (let x = 0; x < noise_width; x++) {
            writeColor(img, x, y, table_terrain[y][x] + table_sediment[y][x]);
        }
    }
    img.updatePixels();
    return img;
}

function computeMovement(x, y) {
    let a = table_terrain[y][x];
    let amount = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let min = 0;
    for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
            amount[yy + 1][xx + 1] = table_terrain[y + yy][x + xx] - a;
            amount[yy + 1][xx + 1] = Math.min(amount[yy + 1][xx + 1], 0);
            min = Math.min(amount[yy + 1][xx + 1], min);
        }
    }
    for (let yy = 0; yy < 3; yy++) {
        for (let xx = 0; xx < 3; xx++) {
            if (amount[yy][xx] > min) amount[yy][xx] = 0;
            else amount[yy][xx] = Math.abs(min);
        }
    }
    return amount;
}

function computeMovementDirection(x, y) {
    let a = computeMovement(x, y);
    let result = {x: 0, y: 0};
    for (let yy = 0; yy < 3; yy++) {
        for (let xx = 0; xx < 3; xx++) {
            if (a[yy][xx] > 0.1) {
                result = {x: xx - 1, y: yy - 1};
            }
        }
    }
    return result;
}

// using sobel
function getGradient(x, y) {
    let gx = terr(x - 1, y - 1) + terr(x - 1, y) + terr(x - 1, y + 1) -
        (terr(x + 1, y - 1) + terr(x + 1, y) + terr(x + 1, y + 1));
    let gy = terr(x - 1, y - 1) + terr(x, y - 1) + terr(x + 1, y - 1) -
        (terr(x - 1, y + 1) + terr(x, y + 1) + terr(x + 1, y + 1));
    return createVector(gx, gy);
}

function terr(x, y) {
    let xx = Math.max(0, Math.min(noise_width - 1, x))
    let yy = Math.max(0, Math.min(noise_height - 1, y))
    return table_terrain[yy][xx];
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
    let index = (x + y * noise_width) * 4;
    image.pixels[index] = val;
    image.pixels[index + 1] = val;
    image.pixels[index + 2] = val;
    image.pixels[index + 3] = 255;
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
