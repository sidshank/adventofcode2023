import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const engineDiagram = getLinesFromFileAsArray('./input.txt');
// const engineDiagram = getLinesFromFileAsArray('./testInput.txt');
const numRows = engineDiagram.length;
const numCols = engineDiagram[0].length;

let partNumbers = [];
let currentPartNumberString = '';
let hasAdjacentSymbol = false;
let adjacentSymbol = '';
let adjacentSymbolRow = -1;
let adjacentSymbolCol = -1;
const gearSymbolLocationToPartNumber = new Map();

const resetPartNumberString = () => {
    currentPartNumberString = '';
}

const addPartNumber = () => {
    partNumbers.push(Number(currentPartNumberString));
    resetPartNumberString();
    hasAdjacentSymbol = false;
}

const isNumericPixel = (pixel) => {
    return pixel.match(/\d/) !== null;
}

const checkForSymbolInCoordinates = (coordinatesToCheck) => {
    for (let [row, col] of coordinatesToCheck) {
        if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
            const pixel = engineDiagram[row][col];
            if (!isNumericPixel(pixel) && pixel !== '.') {
                hasAdjacentSymbol = true;
                adjacentSymbol = pixel;
                adjacentSymbolRow = row;
                adjacentSymbolCol = col;
                break;
            }
        }
    }
}

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const pixel = engineDiagram[row][col];
        if (isNumericPixel(pixel)) {
            if (currentPartNumberString.length === 0) {
                // We have encountered the first digit of a potential part number
                // We need to check the following pixel locations for symbols:
                // row - 1, col (above)
                // row - 1, col - 1 (above left)
                // row, col - 1 (left)
                // row + 1, col - 1 (below left)
                // row + 1, col (below)
                const coordinatesToCheck = [
                    [row - 1, col],
                    [row - 1, col - 1],
                    [row, col - 1],
                    [row + 1, col - 1],
                    [row + 1, col]
                ];
                checkForSymbolInCoordinates(coordinatesToCheck);
            } else {
                if (!hasAdjacentSymbol) {
                    // This isn't the first digit in the part number, so we only need to check
                    // the following pixel locations for symbols:
                    // row - 1, col (above)
                    // row + 1, col (below)
                    const coordinatesToCheck = [
                        [row - 1, col],
                        [row + 1, col]
                    ];
                    checkForSymbolInCoordinates(coordinatesToCheck);
                }
            }
            currentPartNumberString += pixel;
        } else {
            // We have encountered a non-numeric pixel
            // If currentPartNumberString is not empty, we have just finished reading a potential part number
            if (currentPartNumberString.length > 0) {
                if(!hasAdjacentSymbol) {
                    // We have just passed the last digit in a potential part number, without seeing any adjacent symbols
                    // Check the following pixel locations for symbols as a final check:
                    // row - 1, col (above)
                    // row, col (current)
                    // row + 1, col (below)
                    const coordinatesToCheck = [
                        [row - 1, col],
                        [row, col],
                        [row + 1, col]
                    ];
                    checkForSymbolInCoordinates(coordinatesToCheck);
                }
                if (hasAdjacentSymbol) {
                    if (adjacentSymbol === '*') {
                        // We have encountered a gear symbol
                        if (!gearSymbolLocationToPartNumber.has(`${adjacentSymbolRow},${adjacentSymbolCol}`)) {
                            gearSymbolLocationToPartNumber.set(`${adjacentSymbolRow},${adjacentSymbolCol}`, []);
                        }
                        gearSymbolLocationToPartNumber.get(`${adjacentSymbolRow},${adjacentSymbolCol}`).push(Number(currentPartNumberString));
                    }
                    addPartNumber();

                } else {
                    resetPartNumberString();
                }
            }
        }
    }
    // We have reached the end of the row
    // If currentPartNumberString is not empty
    if (currentPartNumberString.length > 0) {
        if (!hasAdjacentSymbol) {
            resetPartNumberString();
        } else {
            addPartNumber();
        }
    }
}

// Part 1: Find the sum of all part numbers
const sum = partNumbers.reduce((sum, partNumber) => sum + partNumber, 0);
console.log(sum);

// Part 2: Enumerate all entries in gearSymbolLocationToPartNumber
// For each entry, find the product of the part numbers in the array
// Find the sum of all products
let productSum = 0;
for (let [_, partNumbers] of gearSymbolLocationToPartNumber) {
    if (partNumbers.length === 2) {
        const gearRatio = partNumbers[0] * partNumbers[1];
        productSum += gearRatio;
    }
}

console.log(productSum);
