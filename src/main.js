const redux = require('redux');


// Blackjack card game

// * Actions *
// initialize - start with a fresh deck
// shuffle - shuffle the deck
// deal - give two cards to dealer and the player
// hit - give one card just to the player
// stay - end current hand ()
// fold - end current hand (quit)
const storeStructure = {
    deck: [],
    dealer: [],
    player: []
}



function createDeck() {
    const suits = ["hearts", "diamonds", "spades", "clubs"]
    const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']

    const deck = [];
    for (suit of suits) {
        for (face of faces) {
            deck.push({suit: suit, face: face})
        }
    }
    return deck;
}


// create a reducer that accepts action and returns a new state
// depending on the action
const reducer = (state, action) => {
    if (state === undefined) {
        return {
            deck: createDeck(),
            dealer: [],
            player: []
        }        
    }


    switch(action.type) {
        case 'DEAL':
            const copy = [...state.deck]
            return {
                deck: copy,
                dealer: [copy.pop(), copy.pop()],
                dealer: [copy.pop(), copy.pop()],
            }
        case 'HIT': {
            const copy = [...state.deck];
            return {
                deck: copy,
                dealer: state.dealer,
                player: [...state.player, copy.pop()]
            }

        }
        default: {
            return state
        }

    }
}