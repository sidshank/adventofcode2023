// Given an input file, return an array of lines
// Each line is a string
// Each line is trimmed of whitespace

import fs from 'fs';

export default (filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return fileContents.split('\n').map((line) => line.trim());
};