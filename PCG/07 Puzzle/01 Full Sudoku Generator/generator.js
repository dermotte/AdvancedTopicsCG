/**
 * SUDOKU Generator
 * Thanks to https://dsasse07.medium.com/generating-solving-sudoku-puzzles-9ee1305ced01 for inspiration!
 */

let grid;

function createGrid() {
    let grid = [
        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],

        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],

        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],
        [0, 0, 0,   0, 0, 0,   0, 0, 0],
    ]
    return grid;
}

function printGrid(grid) {
    for (let r = 0; r < 9; r++) {
        let line = "";
        for (let c = 0; c < 9; c++) {
            line += grid[r][c] + " ";
        }
        console.log(line);
    }
}

function rowSafe(grid, row, num) {
    let result = true;
    for (let c = 0; c < 9; c++) {
        if (grid[row][c] === num) result = false;
    }
    return result;
}

function colSafe(grid, col, num) {
    let result = true;
    for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num) result = false;
    }
    return result;
}

function boxSafe(grid, row, col, num) {
    // top left corner of box region for empty cell
    let boxStartRow = row - (row % 3)
    let boxStartCol = col - (col % 3)
    let result = true
    for ( let boxRow of [0,1,2] ) {  // Each box region has 3 rows
        for ( let boxCol of [0,1,2] ) { // Each box region has 3 columns
            // Is num is present in box region?
            if ( grid[boxStartRow + boxRow][boxStartCol + boxCol] == num ) {
                result = false // If number is found, it is not safe to place
            }
        }
    }
    return result;
}

function isSafe(grid, row, col, num) {
    return boxSafe(grid, row, col, num) && rowSafe(grid, row, num) && colSafe(grid, col, num);
}

function fillCell(grid, row, col) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers = shuffle(numbers);
    for (let n of numbers) {
        if (isSafe(grid, row, col, n)) {
            grid[row][col] = n;
            return true;
        }
    }
    return false;
}


function shuffle(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

function createFullSudoku() {
    let result = false;
    let count = 0;
    let grid;
    while (!result) {
        count++;
        grid = createGrid();
        result = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                result = result && fillCell(grid, r, c);
            }
        }
    }
    console.log(count + " tries.")
    printGrid(grid);
    return grid;
}

// main ...
createFullSudoku();
