import getLinesFromFileAsArray from '../utils/getLinesFromFileAsArray.js';

const gameLines = getLinesFromFileAsArray('./input.txt');
const cubeCountsByColourInBag = { 'red': 12, 'green': 13, 'blue': 14 };
let sumOfPossibleGameIds = 0;
let gameId = 0;
let sumOfPowers = 0;

for (let game of gameLines) {
    gameId++;
    const [_, cubeCountsByColourInAllDraws] = game.split(':');
    const draws = cubeCountsByColourInAllDraws.split(';');

    let maxCubeCountByColour = { 'red': 0, 'green': 0, 'blue': 0 };

    const isGamePossible = draws.reduce((acc_isGamePossible, draw) => {
        acc_isGamePossible &= draw.match(/(\d+)\s(\w+)/g).reduce((acc_isDrawPossible, curr) => {
            const [count, colour] = curr.split(' ');
            const numCubes = Number(count);
            if (numCubes > maxCubeCountByColour[colour]) {
                maxCubeCountByColour[colour] = numCubes;
            }

            if (numCubes > cubeCountsByColourInBag[colour]) {
                acc_isDrawPossible &= false;
            }

            return acc_isDrawPossible;
        }, true);
        return acc_isGamePossible;
    }, true);

    if (isGamePossible) {
        sumOfPossibleGameIds += gameId;
    }
    sumOfPowers += maxCubeCountByColour['red'] * maxCubeCountByColour['green'] * maxCubeCountByColour['blue'];
}

console.log(`Part 1: ${sumOfPossibleGameIds}`);
console.log(`Part 2: ${sumOfPowers}`)