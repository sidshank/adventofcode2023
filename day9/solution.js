import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const inputData = getLinesFromFileAsArray("./input.txt");

const valueHistories = inputData.map(line => line.split(" ").map(Number));

const createArraysOfDifferences = values => {
    const differences = [];
    let currentArray = values;
    while (!currentArray.every(value => value === 0)) {
      const nextArray = [];
      for (let i = 0; i < currentArray.length - 1; i++) {
        nextArray.push(currentArray[i + 1] - currentArray[i]);
      }
      differences.push(nextArray);
      currentArray = nextArray;
    }
    return differences;
}

const findExtrapolatedValueOnRight = valueHistory => {
    const differences = createArraysOfDifferences(valueHistory);
    differences[differences.length - 1].push(0);
    for (let i = differences.length - 2; i >= 0; i--) {
        const lastElementInCurrentArray = differences[i][differences[i].length - 1];
        const lastElementInNextArray = differences[i + 1][differences[i].length - 1];
        differences[i].push(lastElementInCurrentArray + lastElementInNextArray);
    }

    return valueHistory[valueHistory.length - 1] + differences[0][differences[0].length - 1];
};

const findExtrapolatedValueOnLeft = valueHistory => {
    const differences = createArraysOfDifferences(valueHistory);
    differences[differences.length - 1].unshift(0);
    for (let i = differences.length - 2; i >= 0; i--) {
        const firstElementInCurrentArray = differences[i][0];
        const firstElementInNextArray = differences[i + 1][0];
        differences[i].unshift(firstElementInCurrentArray - firstElementInNextArray);
    }

    return valueHistory[0] - differences[0][0];
}

const sumOfExtrapolatedValuesOnRight = valueHistories.reduce((sum, valueHistory) => sum + findExtrapolatedValueOnRight(valueHistory), 0);
console.log(`Part 1: Sum of Extrapolated values on the right is ${sumOfExtrapolatedValuesOnRight}`);

const sumOfExtrapolatedValuesOnLeft = valueHistories.reduce((sum, valueHistory) => sum + findExtrapolatedValueOnLeft(valueHistory), 0);
console.log(`Part 2: Sum of Extrapolated values on the left is ${sumOfExtrapolatedValuesOnLeft}`);

