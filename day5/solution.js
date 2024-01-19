import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const almanacData = getLinesFromFileAsArray("./input.txt");
// const almanacData = getLinesFromFileAsArray("./testInput.txt");
const seeds = almanacData[0].split(": ")[1].split(' ').map(seed => parseInt(seed));

const maps = [];

let currentMap = [];
for (let lineIndex = 2; lineIndex < almanacData.length; lineIndex++) {
    const line = almanacData[lineIndex];
    // If we encounter an empty line, push the currentMap into maps and reset currentMap
    if (line.length === 0 && currentMap.length > 0) {
        maps.push(currentMap);
        currentMap = [];
    } else if (line[line.length - 1] === ':') { // If the line ends with a :, it indicates the start of a new map
        // Ignore the line, it contains a map name that we don't need, since we process the maps in the 
        // same order as they appear in the input.
        continue;
    } else {
        const mapEntry = line.match(/(?<destinationStart>\d+)\s(?<sourceStart>\d+)\s(?<rangeLength>\d+)/).groups;
        currentMap.push({
            destinationStart: parseInt(mapEntry.destinationStart),
            sourceStart: parseInt(mapEntry.sourceStart),
            rangeLength: parseInt(mapEntry.rangeLength)
        });
    }
}
maps.push(currentMap);

// We're going to sort each element of the maps array by sourceStart in ascending order.
// Sorting by sourceStart allows us to lookup values more efficiently since we can just go down the list until we find
// two neighboring values a and b such that a.sourceStart <= value <= b.sourceStart.
maps.forEach(map => {
    map.sort((a, b) => a.sourceStart - b.sourceStart);
});

// Part 1
const part1LowestLocation = computeLowestLocation(seeds, maps, false);
console.log(`Part 1 - Lowest Location corresponding to seed numbers: ${part1LowestLocation}`);

// Part2
const part2LowestLocation = computeLowestLocation(seeds, maps, true);
console.log(`Part 2 - Lowest Location corresponding to seed numbers: ${part2LowestLocation}`);
console.log(part2LowestLocation);

function computeLowestLocation(seeds, maps, processSeedsAsRange) {

    const DEBUG = false;
    // Take each seed value and run it through each map in order
    // The last map in "maps" will produce a location.
    // We need to keep track of the lowest location value we have encountered.

    let lowestLocation = Infinity;

    let seedsToProcess = [];
    if (!processSeedsAsRange) {
        seedsToProcess = [seeds];
    } else {

        function* makeRangeIterator(start, end, step = 1) {
            let iterationCount = 0;
            for (let i = start; i < end; i += step) {
                iterationCount++;
                yield i;
            }
            return iterationCount;
        }

        for (let s = 0; s < seeds.length; s = s + 2) {
            const iter = makeRangeIterator(seeds[s], seeds[s] + seeds[s + 1]);
            seedsToProcess.push(iter);
        }
    }

    for (const batch of seedsToProcess) {
        for (const seed of batch) {
            let startValue = seed;
            let destinationValue = 0;
            if (DEBUG) {
                console.log('');
                console.log(`Seed: ${seed}`)
                console.log('==============')
            }
            for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
                const currentMap = maps[mapIndex];
                for (let mapEntryIndex = 0; mapEntryIndex < currentMap.length; mapEntryIndex++) {
                    const currentMapEntry = currentMap[mapEntryIndex];
                    if (DEBUG) console.log(`${startValue} * ${currentMapEntry.sourceStart} - ${currentMapEntry.destinationStart} - ${currentMapEntry.rangeLength}`);

                    if (
                        startValue < currentMapEntry.sourceStart ||
                        (mapEntryIndex === currentMap.length - 1 && startValue > (currentMapEntry.sourceStart + currentMapEntry.rangeLength)) ||
                        (startValue > (currentMapEntry.sourceStart + currentMapEntry.rangeLength) && startValue < currentMap[mapEntryIndex + 1].sourceStart)) {
                        if (DEBUG) console.log('branch1')
                        destinationValue = startValue;
                        break;
                    } else if (startValue <= currentMapEntry.sourceStart + currentMapEntry.rangeLength - 1) {
                        if (DEBUG) console.log('branch2')
                        destinationValue = currentMapEntry.destinationStart + (startValue - currentMapEntry.sourceStart);
                        break;
                    }
                }
                if (DEBUG) console.log(`${startValue} -> ${destinationValue}`)
                startValue = destinationValue;
            }

            if (destinationValue < lowestLocation) {
                lowestLocation = destinationValue;
            }
        };
    }

    return lowestLocation;
}