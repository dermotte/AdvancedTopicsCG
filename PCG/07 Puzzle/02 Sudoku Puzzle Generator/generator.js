/**
 * SUDOKU Generator
 * Thanks to https://dsasse07.medium.com/generating-solving-sudoku-puzzles-9ee1305ced01 for inspiration!
 */

function createGrid() {
    let grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    return grid;
}

function copyGrid(grid) {
    let result = createGrid();
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            result [r][c] = grid[r][c];
        }
    }
    return result;
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

function prettyPrintGrid(grid) {
    for (let r = 0; r < 9; r++) {
        let line = "";
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] == 0) line += "  ";
            else line += grid[r][c] + " ";
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
    for (let boxRow of [0, 1, 2]) {  // Each box region has 3 rows
        for (let boxCol of [0, 1, 2]) { // Each box region has 3 columns
            // Is num is present in box region?
            if (grid[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
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

function removeNextCell(grid) {
    let cell = Math.floor(Math.random() * 81);
    let row = Math.floor(cell / 9);
    let col = parseInt(cell % 9);
    grid[row][col] = 0;
}


function createPuzzle(grid) {
    let lastStep;
    for (let i = 0; i < 150; i++) {
        lastStep = copyGrid(grid);
        removeNextCell(grid);
        if (countSudokuSolutions(grid, copyGrid(grid), 0) != 1)
            grid = lastStep; // roll back
    }
    return (grid);
}


// adapted from https://dev.to/christinamcmahon/use-backtracking-algorithm-to-solve-sudoku-270
function countSudokuSolutions(matrix, original, count) {
    let row = 0;
    let col = 0;
    let checkBlankSpaces = false;

    /* verify if sudoku is already solved and if not solved,
    get next "blank" space position */
    for (row = 0; row < matrix.length; row++) {
        for (col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 0) {
                checkBlankSpaces = true;
                break;
            }
        }
        if (checkBlankSpaces === true) {
            break;
        }
    }
    // no more "blank" spaces means the puzzle is solved
    if (checkBlankSpaces === false) {
        return count + 1;
    }

    // try to fill "blank" space with correct num
    for (let num = 1; num <= 9; num++) {
        /* isSafe checks that num isn't already present
        in the row, column, or 3x3 box (see below) */
        if (isSafe(matrix, row, col, num)) {
            matrix[row][col] = num;

            count = countSudokuSolutions(matrix, original, count);

            /* if num is placed in incorrect position,
            mark as "blank" again then backtrack with
            a different num */
            matrix[row][col] = 0;
        }
    }
    return count;
}

function writeSVG(grid) {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg">
    <svg x="100" y="100">
        <line x1="0" y1="0" x2="900" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="0" y1="100" x2="900" y2="100" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="200" x2="900" y2="200" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="300" x2="900" y2="300" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="0" y1="400" x2="900" y2="400" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="500" x2="900" y2="500" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="600" x2="900" y2="600" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="0" y1="700" x2="900" y2="700" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="800" x2="900" y2="800" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="0" y1="900" x2="900" y2="900" style="stroke:rgb(0,0,0);stroke-width:4" />

        <line x1="0" y1="0" x2="0" y2="900" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="100" y1="0" x2="100" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="200" y1="0" x2="200" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="300" y1="0" x2="300" y2="900" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="400" y1="0" x2="400" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="500" y1="0" x2="500" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="600" y1="0" x2="600" y2="900" style="stroke:rgb(0,0,0);stroke-width:4" />
        <line x1="700" y1="0" x2="700" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="800" y1="0" x2="800" y2="900" style="stroke:rgb(0,0,0);stroke-width:1" />
        <line x1="900" y1="0" x2="900" y2="900" style="stroke:rgb(0,0,0);stroke-width:4" />
`
    for (let r = 0; r < 9; r++) {
        let line = "";
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] != 0) {
                let xpos = c * 100 + 50;
                let ypos = r * 100 + 80;
                let value = grid[r][c];
                svg += `\t\t<text text-anchor=\"middle\"  x=\"${xpos}\" y=\"${ypos}\" fill=\"black\" style=\"font-size: 90px\">${value}</text>\n`;
            }
        }
    }
    svg += `    </svg>
</svg>`
    return svg;
}

function countClues(grid) {
    let count = 0;
    for (let r = 0; r < 9; r++) {
        let line = "";
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] != 0) {
                count++;
            }
        }
    }
    return count;
}


// main ...
let g = createFullSudoku();
g = createPuzzle(g);
// console.log("---")
// printGrid(g);
// console.log("---")
let c = countSudokuSolutions(g, copyGrid(g), 0)
console.log(c);
prettyPrintGrid(g);
console.log(countClues(g) + " clues in the Sudoku");
const fs = require('fs');
fs.writeFileSync("out.svg", writeSVG(g));
