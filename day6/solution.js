import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const raceData = getLinesFromFileAsArray("./input.txt");
const raceDurations = raceData[0].split(/\s+/).slice(1).map((duration) => parseInt(duration));
const distanceRecords = raceData[1].split(/\s+/).slice(1).map((distance) => parseInt(distance));

const numRaces = raceDurations.length;
const DEBUG = false;

const getDistance = (speed, time) => speed * time;

const computeWaysToWin = (raceDuration, distanceRecord) => {
    let pressDuration = raceDuration - 1;
    let waysToWin = 0;
    while (pressDuration > 0) {
        // The boat only moves when we stop pressing the button, and so time allowed to spend travelling is 
        // the difference between the total race duration and the press duration.
        const distance = getDistance(pressDuration, (raceDuration - pressDuration));
        if (distance > distanceRecord) {
            if (DEBUG) console.log(`${pressDuration} ms of pressing the button will get you ${distance} mm which is > ${distanceRecord} mm`);
            waysToWin++;
        } else if (waysToWin > 0 && distance < distanceRecord) {
            // The speed of the boat has reduced to the point where it isn't going to ever go fast enough
            // from here to beat the record.
            break;
        }
        pressDuration--;
    }
    return waysToWin;
}

let productOfWaysToWinAcrossRaces = 1;
for (let raceIndex = 0; raceIndex < numRaces; raceIndex++) {
    if (DEBUG) console.log(`Race ${raceIndex + 1}`)
    const raceDuration = raceDurations[raceIndex];
    const distanceRecord = distanceRecords[raceIndex];

    const waysToWin = computeWaysToWin(raceDuration, distanceRecord)
    productOfWaysToWinAcrossRaces *= waysToWin;
}
console.log(`Part 1 - Product of ways to win across races: ${productOfWaysToWinAcrossRaces}`);

const bigRaceDuration = parseInt(raceData[0].split(/\s+/).slice(1).join(''));
const bigRaceDistanceRecord = parseInt(raceData[1].split(/\s+/).slice(1).join(''));

const waysToWinTheBigRace = computeWaysToWin(bigRaceDuration, bigRaceDistanceRecord);
console.log(`Part 2 - Numbers of ways to win the big race: ${productOfWaysToWinAcrossRaces}`);