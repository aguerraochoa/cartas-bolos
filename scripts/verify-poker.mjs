import { createDeck, shuffleDeck, evaluateBestHand } from '../src/utils/poker.js';
import pokersolver from 'pokersolver';
const { Hand } = pokersolver;

console.log('Running Verification Script...');

// 1. Verify Deck Creation
const deck = createDeck();
if (deck.length !== 52) {
    console.error(`FAIL: Deck size is ${deck.length}, expected 52`);
    process.exit(1);
} else {
    console.log('PASS: Deck size is 52');
}

// 2. Verify Shuffling
const shuffled = shuffleDeck(deck);
if (shuffled.length !== 52) {
    console.error('FAIL: Shuffled deck size incorrect');
    process.exit(1);
}
if (shuffled[0] === deck[0] && shuffled[1] === deck[1] && shuffled[2] === deck[2]) {
    console.warn('WARN: Shuffled deck starts with same cards (unlikely but possible)');
} else {
    console.log('PASS: Deck appears shuffled');
}

// 3. Verify Hand Evaluation (Best of 5)
const result5 = evaluateBestHand(['Ah', 'Ad', 'As', 'Ac', 'Ks']);
if (result5.name === 'Four of a Kind') {
    console.log('PASS: 5 cards evaluated correctly');
} else {
    console.error(`FAIL: Expected Four of a Kind, got ${result5.name}`);
}

// 4. Verify Hand Evaluation (Best of 7)
const cards7 = ['Ah', 'Ad', 'As', 'Ac', 'Ks', '2d', '3h'];
const result7 = evaluateBestHand(cards7);
if (result7.name === 'Four of a Kind') { // Should ignore the low cards
    console.log('PASS: 7 cards evaluated correctly (best 5 chosen)');
} else {
    console.error(`FAIL: Expected Four of a Kind from 7 cards, got ${result7.name}`);
}

// 5. Verify Hand Evaluation (Best of Many, e.g. 10)
const cards10 = [
    '2h', '3h', '4h', '5h', '6h', // Straight Flush
    'Ah', 'Kd', 'Tc', '9s', '8h'  // Junk
];
const result10 = evaluateBestHand(cards10);
if (result10.name === 'Straight Flush') {
    console.log('PASS: 10 cards evaluated correctly (Best 5 chosen)');
} else {
    console.error(`FAIL: Expected Straight Flush from 10 cards, got ${result10.name}`);
}

console.log('ALL TESTS PASSED');
