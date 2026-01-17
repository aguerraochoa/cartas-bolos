import pokersolver from 'pokersolver';
const { Hand } = pokersolver;

const testHands = [
    ['As'],
    ['As', 'Ks'],
    ['As', 'Ad', '2c'],
    ['As', 'Ks', 'Qs', 'Js'],
    ['As', 'Ks', 'Qs', 'Js', 'Ts']
];

testHands.forEach(cards => {
    try {
        const hand = Hand.solve(cards);
        console.log(`Cards: ${cards.join(', ')} -> Rank: ${hand.rank}, Name: ${hand.name}, Descr: ${hand.descr}`);
    } catch (e) {
        console.error(`Error with ${cards.length} cards:`, e.message);
    }
});
