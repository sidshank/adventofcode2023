const overlappingRegEx = /oneight|threeight|fiveight|nineight|twone|sevenine|eightwo|eighthree/g;
const digitNameRegex = /one|two|three|four|five|six|seven|eight|nine/g;
export default (line) => {
    line = line.replace(overlappingRegEx, (match) => {
        switch (match) {
            case 'oneight': return 'oneeight';
            case 'threeight': return 'threeeight';
            case 'fiveight': return 'fiveeight';
            case 'nineight': return 'nineeight';
            case 'twone': return 'twoone';
            case 'sevenine': return 'sevennine';
            case 'eightwo': return 'eighttwo';
            case 'eighthree': return 'eightthree';
            default: match;
        }
    });
    return line.
        replace(digitNameRegex, (match) => {
            switch (match) {
                case 'one': return '1';
                case 'two': return '2';
                case 'three': return '3';
                case 'four': return '4';
                case 'five': return '5';
                case 'six': return '6';
                case 'seven': return '7';
                case 'eight': return '8';
                case 'nine': return '9';
                default: return match;
            }
        });
}