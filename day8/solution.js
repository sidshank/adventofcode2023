import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";

const inputData = getLinesFromFileAsArray("./input.txt");

const leftRightSteps = inputData[0];
inputData.shift();
inputData.shift();

const nodeNetworkMap = inputData.reduce((acc, line) => {
    const matches = line.match(/(?<source>\w+) = \((?<leftNode>\w+), (?<rightNode>\w+)\)/);
    const { source, leftNode, rightNode } = matches.groups;
    acc[source] = { L: leftNode, R: rightNode };
    return acc;
}, {});

let stepCount = 0;
let stepIndex = 0;
let currentNode = "AAA";
while (currentNode !== "ZZZ") {
    if (stepIndex === leftRightSteps.length) {
        stepIndex = 0;
    }
    const direction = leftRightSteps[stepIndex];
    const nextNode = nodeNetworkMap[currentNode][direction];
    currentNode = nextNode;
    stepCount++;
    stepIndex++;
}
console.log(`Part 1: The Step Count to go from AAA to ZZZ is: ${stepCount}`)

// Part 2
// Find all entries in the nodeNetworkMap that end in A
const doAllEntriesEndInZ = (nodes) => nodes.every(node => node.endsWith("Z"));

const nodeNetworkMapKeys = Object.keys(nodeNetworkMap);
const currentNodes = nodeNetworkMapKeys.filter(key => key.endsWith("A"));
let ghostStepCount = 0;
let ghostStepIndex = 0;

let nodeToStepCount = {};
for (let i = 0; i < currentNodes.length; i++) {
    nodeToStepCount[i] = [];
}

while (!doAllEntriesEndInZ(currentNodes) && ghostStepCount < 50000) {
    if (ghostStepIndex === leftRightSteps.length) {
        ghostStepIndex = 0;
    }
    const direction = leftRightSteps[ghostStepIndex];
    ghostStepCount++;

    for (let i = 0; i < currentNodes.length; i++) {
        const node = currentNodes[i];
        const nextNode = nodeNetworkMap[node][direction];
        currentNodes[i] = nextNode;
        if (nextNode.endsWith("Z")) {
            nodeToStepCount[i].push(ghostStepCount + 1);
        }
    }

    ghostStepIndex++;
}

const gcd = (a, b) => {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

const lcm = (a, b) => {
    return a * b / gcd(a, b);
}

const stepCountsToReachZ = Object.values(nodeToStepCount).map(arr => arr[0]);
console.log(
    `Part 2: The number of steps for all nodes that end with A to reach nodes that end with Z at the same time is: ${stepCountsToReachZ.reduce(lcm)}`
);