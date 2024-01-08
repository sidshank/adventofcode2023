import getLinesFromFileAsArray from '../utils/getLinesFromFileAsArray.js';
import replaceDigitNamesWithDigits from './replaceDigitNamesWithDigits.js';
import getSumOfFirstAndLastDigit from './getSumOfFirstAndLastDigit.js';

const lines = getLinesFromFileAsArray('./input.txt');

// Part 1
let sumOfCalibrationValues = 0;
for (let line of lines) {
    sumOfCalibrationValues += getSumOfFirstAndLastDigit(line);
}
console.log(`Part 1: ` + sumOfCalibrationValues);

// Part 2
let correctSumOfCalibrationValues = 0;
for (let line of lines) {
    line = replaceDigitNamesWithDigits(line);
    correctSumOfCalibrationValues += getSumOfFirstAndLastDigit(line);
}
console.log(`Part 2: ` + correctSumOfCalibrationValues);
