import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const skyMap = getLinesFromFileAsArray("./input.txt").map(line => line.split(""));

const findEmptyColumnsInSkyMap = (skyMap) => {
    return skyMap[0].map(
        (_, columnIndex) => skyMap.every(row => row[columnIndex] === '.')
    ).map(
        (isEmpty, index) => isEmpty ? index : null
    ).filter(
        index => index !== null
    );
}

const findEmptyRowsInSkyMap = (skyMap) => {
    return skyMap.map(
        row => row.every(cell => cell === '.')
    ).map(
        (isEmpty, index) => isEmpty ? index : null
    ).filter(
        index => index !== null
    );
}

// Find the number of steps between the two galaxies in the skyMap
const findNumberOfSteps = (start, end) => {
    const [g1Row, g1Column] = start;
    const [g2Row, g2Column] = end;
    const rowDiff = Math.abs(g1Row - g2Row);
    const columnDiff = Math.abs(g1Column - g2Column);
    return rowDiff + columnDiff;
};

const emptyColumnIndices = findEmptyColumnsInSkyMap(skyMap);
const emptyRowIndices = findEmptyRowsInSkyMap(skyMap);

const findCoordinatesOfAllGalaxies = (skyMap) => {
    const galaxyCoordinates = [];
    skyMap.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            if (cell === '#') {
                galaxyCoordinates.push([rowIndex, columnIndex]);
            }
        });
    });
    return galaxyCoordinates;
}

const transformGalaxyCoordinates = (galaxyCoordinates, emptyColumnIndices, emptyRowIndices, expansionFactor) => {
    return galaxyCoordinates.map(([row, column]) => {
        let newRow = row;
        let newColumn = column;
        emptyRowIndices.forEach(
            emptyRowIndex => {
                if (row >= emptyRowIndex) {
                    newRow += (expansionFactor - 1);
                }
            }
        );
        emptyColumnIndices.forEach(
            emptyColumnIndex => {
                if (column >= emptyColumnIndex) {
                    newColumn += (expansionFactor - 1);
                }
            }
        );
        return [newRow, newColumn];
    });
}

const galaxyLocations = findCoordinatesOfAllGalaxies(skyMap);

const getSumOfGalaxyDistancesWithExpansionFactor = (galaxyLocations, emptyColumnIndices, emptyRowIndices, expansionFactor) => {
    const transformedGalaxyLocations = transformGalaxyCoordinates(galaxyLocations, emptyColumnIndices, emptyRowIndices, expansionFactor);
    let sumOfDistances = 0;
    for (let i = 0; i < transformedGalaxyLocations.length; i++) {
        for (let j = i + 1; j < transformedGalaxyLocations.length; j++) {
            const numSteps = findNumberOfSteps(transformedGalaxyLocations[i], transformedGalaxyLocations[j]);
            sumOfDistances += numSteps;
        }
    }
    return sumOfDistances;
}

const expansionFactors = [2, 1000000];

expansionFactors.forEach(
    (expansionFactor, index) => console.log(`Part ${index + 1}: Sum of distances with expansion factor of ${expansionFactor} is: ${getSumOfGalaxyDistancesWithExpansionFactor(galaxyLocations, emptyColumnIndices, emptyRowIndices, expansionFactor)}`)
);
