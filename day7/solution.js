import getLinesFromFileAsArray from "../utils/getLinesFromFileAsArray.js";
import { matches } from "z";

const FiveOfAKind = "FiveOfAKind";
const FourOfAKind = "FourOfAKind";
const FullHouse = "FullHouse";
const ThreeOfAKind = "ThreeOfAKind";
const TwoPair = "TwoPair";
const OnePair = "OnePair";
const HighCard = "HighCard";
const cardStrengths = {
    "A": 14,
    "K": 13,
    "Q": 12,
    "J": 11,
    "T": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
};

const handStrengths = {
    [HighCard]: 1,
    [OnePair]: 2,
    [TwoPair]: 3,
    [ThreeOfAKind]: 4,
    [FullHouse]: 5,
    [FourOfAKind]: 6,
    [FiveOfAKind]: 7,
};

const indicateStrongerHand = (firstHand, secondHand, options = {interpretJAsJoker: false}) => {
    const firstHandType = getHandName(firstHand, options);
    const secondHandType = getHandName(secondHand, options);
    let relativeHandStrength = indicateStrongerHandType(firstHandType, secondHandType);
    let cardIndex = 0;
    while (relativeHandStrength === 0) {
        const firstCardType = firstHand[cardIndex];
        const secondCardType = secondHand[cardIndex];
        relativeHandStrength = indicateStrongerCard(firstCardType, secondCardType);
        cardIndex++;
    }
    return relativeHandStrength;
};

const indicateStrongerHandType = (firstHandType, secondHandType) => {
    if (handStrengths[firstHandType] > handStrengths[secondHandType]) {
        return 1;
    } else if (handStrengths[firstHandType] < handStrengths[secondHandType]) {
        return -1;
    } else {
        return 0;
    }
};

const indicateStrongerCard = (firstCardType, secondCardType) => {
    if (cardStrengths[firstCardType] > cardStrengths[secondCardType]) {
        return 1;
    } else if (cardStrengths[firstCardType] < cardStrengths[secondCardType]) {
        return -1;
    } else {
        return 0;
    }
};

const getHandName = (hand, { interpretJAsJoker }) => {
    // check if hand is a string
    if (typeof hand !== 'string') {
        throw new Error(`Expected hand to be a string, but got ${typeof hand}`);
    }
    if (hand.length !== 5) {
        throw new Error(`Expected hand to be 5 cards, but got ${hand.length}`);
    }
    
    // convert a string with 5 letters into an object where each letter is a key and the value is the number of times it appears
    const cardCounts = hand.split('').reduce((counts, card) => {
        if (counts[card]) {
            counts[card]++;
        } else {
            counts[card] = 1;
        }
        return counts;
    }, {});
    const counts = Object.values(cardCounts);
    counts.sort();

    // If we are required to interpret J's as Jokers, and...
    // If the hand contains one or more Js, and...
    // If the hand does not contain 5 Js (in which case it is already the most powerful hand - FiveOfAKind)
    if (interpretJAsJoker && cardCounts.J !== undefined && cardCounts.J !== 5) {
        const index = counts.indexOf(cardCounts.J);
        counts.splice(index, 1);
        counts[counts.length - 1] += cardCounts.J;
    }

    return matches(counts)(
        (a = 5, tail = []) => FiveOfAKind,
        (a = 1, b = 4, tail = []) => FourOfAKind,
        (a = 2, b = 3, tail = []) => FullHouse,
        (a = 1, b = 1, c = 3, tail = []) => ThreeOfAKind,
        (a = 1, b = 2, c = 2, tail = []) => TwoPair,
        (a = 1, b = 1, c = 1, d = 2, tail = []) => OnePair,
        (a = 1, b = 1, c = 1, d = 1, e = 1, tail = []) => HighCard,
    );
}

const getTotalBidAmount = (handAndBidData) => handAndBidData.reduce((total, handAndBid, index) => {
        const bid = handAndBid.bid;
        const winAmount = bid * (index + 1);
        return total + winAmount;
    }, 0);

const inputData = getLinesFromFileAsArray('./input.txt');
const handsAndBids = inputData.map(line => {
    const [hand, bid] = line.split(' ');
    return { hand, bid };
});

const handsAndBidsPartOne = [...handsAndBids];
handsAndBidsPartOne.sort((firstHandAndBid, secondHandAndBid) => indicateStrongerHand(firstHandAndBid.hand, secondHandAndBid.hand));
const totalWinAmount = getTotalBidAmount(handsAndBidsPartOne);
console.log(`Part 1: The total win amount is ${totalWinAmount}`);

// Part 2
cardStrengths.J = 1;
const handsAndBidsPartTwo = [...handsAndBids];
handsAndBidsPartTwo.sort((firstHandAndBid, secondHandAndBid) => indicateStrongerHand(
    firstHandAndBid.hand, secondHandAndBid.hand, {interpretJAsJoker: true}
));
const totalWinAmountPartTwo = getTotalBidAmount(handsAndBidsPartTwo);
console.log(`Part 2: The total win amount is ${totalWinAmountPartTwo}`);
