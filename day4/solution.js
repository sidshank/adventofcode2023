import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";
const cardData = getLinesFromFileAsArray('./input.txt');

// Given a line of card data like this: Card   1:  5 37 16  3 56 11 23 72  7  8 |  3 79 35 45 72 69 15 14 48 88 96 37 11 75 83 56 23  7 16 50 21 91 32 97 17
// Produce two arrays, one for the winning cards before the | symbol, and one for the player cards after the | symbol
const getCardDataFromLine = (line) => {
    const [cardInfo, numbers] = line.split(':');
    const cardNumber = parseInt(cardInfo.split(/\s+/)[1]);
    const winningCards = numbers.split('|')[0].trim().split(/\s+/).map(n => parseInt(n));
    const playerCards = numbers.split('|')[1].trim().split(/\s+/).map(n => parseInt(n));
    return { cardNumber, winningCards, playerCards };
}

const getNumberOfWinningCardsFromPlayerCards = (winningCards, playerCards) => {
    // Note: This function assumes no duplicates in `playerCards`
    let numberOfWinningCards = 0;
    const winningCardsSet = new Set();
    winningCards.forEach(wc => winningCardsSet.add(wc));
    playerCards.forEach(pc => {
        if (winningCardsSet.has(pc)) {
            numberOfWinningCards++;
        }
    })
    return numberOfWinningCards;
}

let totalScore = 0;
cardData.forEach(line => {
    const { winningCards, playerCards } = getCardDataFromLine(line);
    const numberOfWinningCards = getNumberOfWinningCardsFromPlayerCards(winningCards, playerCards);
    const lineScore = numberOfWinningCards === 0 ? 0 : Math.pow(2, numberOfWinningCards - 1);
    totalScore += lineScore;
});
console.log(`Part 1: Total points represented by scratch cards: ${totalScore}`);

// Part 2
const cardNumberToProcessingCount = new Map();
const totalCardCount = cardData.length;
const DEBUG = false;
const increaseProcessingCountForCardsBelow = (currentCardNumber, cardCount) => {
    for (let c = currentCardNumber + 1; c <= currentCardNumber + cardCount; c++) {
        if (c > totalCardCount) {
            // throw an error
            console.error(`Processing card ${c} but there are only ${totalCardCount} cards`);
            exit(1);
        }
        if (!cardNumberToProcessingCount.has(c)) {
            cardNumberToProcessingCount.set(c, 1);
        }
        cardNumberToProcessingCount.set(c, cardNumberToProcessingCount.get(c) + 1);
    }
}

cardData.forEach(line => {
    const { cardNumber, winningCards, playerCards } = getCardDataFromLine(line);
    let numberOfTimesToProcessThisCard = 0;
    if (!cardNumberToProcessingCount.has(cardNumber)) {
        // No previous cards have indicated the need to process this card. Process it once.
        cardNumberToProcessingCount.set(cardNumber, 1);
    }
    numberOfTimesToProcessThisCard = cardNumberToProcessingCount.get(cardNumber);
    if (DEBUG) console.log(`Processing card ${cardNumber} ${numberOfTimesToProcessThisCard} times`);
    const numberOfWinningCards = getNumberOfWinningCardsFromPlayerCards(winningCards, playerCards);
    if (DEBUG) console.log(`Increasing processing count for ${numberOfWinningCards} cards below ${cardNumber}`);
    for (let n = 0; n < numberOfTimesToProcessThisCard; n++) {
        increaseProcessingCountForCardsBelow(cardNumber, numberOfWinningCards);
    }
});

// Add up all the values in the map
let totalScratchCardCount = 0;
cardNumberToProcessingCount.forEach(value => {
    totalScratchCardCount += value;
});
console.log(`Part 2: Total number of scratch cards: ${totalScratchCardCount}`);