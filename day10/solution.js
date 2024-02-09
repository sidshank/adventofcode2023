import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const maze = getLinesFromFileAsArray("./input.txt").map(line => line.split(""));
const MAX_ROW = maze.length;
const MAX_COLUMN = maze[0].length;
const DEBUG = false;

const getStartingPoint = maze => {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[0].length; j++) {
            if (maze[i][j] === "S") {
                return [i, j];
            }
        }
    }
}

const getNextPoint = (maze, currentPoint, previousPoint) => {
    const [currentRow, currentColumn] = currentPoint;
    const [previousRow, previousColumn] = previousPoint;
    let directionsToCheck = ['N', 'E', 'S', 'W'];
    if (!(previousRow === -1 && previousColumn === -1)) {
        // If the previous point is not [-1, -1], we are in the maze and should avoid going back to the previous point
        const sourceDirection = previousRow < currentRow ? 'N' : previousRow > currentRow ? 'S' : previousColumn < currentColumn ? 'W' : 'E';
        directionsToCheck = directionsToCheck.filter(direction => direction !== sourceDirection);
    }
    let currentSymbol = maze[currentRow][currentColumn];

    let directionsToFilterOut = [];
    switch(currentSymbol) {
        case 'S': break;
        case '|': directionsToFilterOut = ['E', 'W']; break;
        case '-': directionsToFilterOut = ['N', 'S']; break;
        case 'L': directionsToFilterOut = ['S', 'W']; break;
        case 'J': directionsToFilterOut = ['S', 'E']; break;
        case '7': directionsToFilterOut = ['N', 'E']; break;
        case 'F': directionsToFilterOut = ['N', 'W']; break;
    }
    directionsToCheck = directionsToCheck.filter(direction => directionsToFilterOut.indexOf(direction) === -1);
    if (DEBUG) console.log(`From ${currentSymbol} at ${currentPoint}, checking ${directionsToCheck}`);

    for (let direction of directionsToCheck) {
        let nextRow = currentRow;
        let nextColumn = currentColumn;
        let allowedSymbols = null;
        switch (direction) {
            case 'N':
                nextRow--;
                allowedSymbols = ['|', '7', 'F', 'S'];
                break;
            case 'E':
                nextColumn++;
                allowedSymbols = ['-', 'J', '7', 'S'];
                break;
            case 'S':
                nextRow++;
                allowedSymbols = ['|', 'J', 'L', 'S'];
                break;
            case 'W':
                nextColumn--;
                allowedSymbols = ['-', 'F', 'L', 'S'];
                break;
        }

        if (nextRow >= 0 && nextRow < MAX_ROW && nextColumn >= 0 && nextColumn < MAX_COLUMN && allowedSymbols.indexOf(maze[nextRow][nextColumn]) !== -1) {
            if (DEBUG) console.log(`Moving from ${maze[currentRow][currentColumn]} at [${currentRow}, ${currentColumn}] to ${maze[nextRow][nextColumn]} at ${nextRow}, ${nextColumn}`);
            return [nextRow, nextColumn];
        }
    }
    if (DEBUG) console.log(`Stuck at ${currentPoint} - ${maze[currentRow][currentColumn]}, checking ${directionsToCheck}`);
}

let previousPoint = [-1, -1]; // Indicates that we have not yet started moving in the maze
const startingPoint = getStartingPoint(maze);
let currentPoint = startingPoint

let nextPoint = null;
let stepCount = 0;
let mazeLoopVertices = [[startingPoint[1], startingPoint[0]]]; // x1, y1
let directionChangeIndicators = ['L', 'J', '7', 'F'];
do {
    nextPoint = getNextPoint(maze, currentPoint, previousPoint);
    if (directionChangeIndicators.indexOf(maze[nextPoint[0]][nextPoint[1]]) !== -1) {
        mazeLoopVertices.push([nextPoint[1], nextPoint[0]]); // xn, yn
    }
    previousPoint = currentPoint;
    currentPoint = nextPoint;
    stepCount++;
} while(maze[nextPoint[0]][nextPoint[1]] !== "S");
mazeLoopVertices.push([startingPoint[1], startingPoint[0]]); // x1, y1 to close the polygon

console.log(`Part 1: The farthest point in the maze from the starting point S is ${stepCount / 2} steps away.`);

// Part 2
// Calculate the area of the maze using the shoelace formula
// https://en.wikipedia.org/wiki/Shoelace_formula
const area = Math.abs(mazeLoopVertices.reduce((acc, vertex, index) => {
    let nextIndex = index === mazeLoopVertices.length - 1 ? 0 : index + 1;
    return acc + vertex[0] * mazeLoopVertices[nextIndex][1] - mazeLoopVertices[nextIndex][0] * vertex[1];
}, 0)) / 2;

// Now calculate the number of points in the maze using pick's theorem
// https://en.wikipedia.org/wiki/Pick%27s_theorem
let boundaryPoints = stepCount;
let interiorPoints = area - boundaryPoints / 2 + 1;
console.log(`Part 2: The number of tiles in the maze is ${interiorPoints}.`);
