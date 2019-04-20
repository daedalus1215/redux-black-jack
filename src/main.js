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


// utility function
function createDeck() {
    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

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
        case 'DEAL': {
            const copy = [...state.deck]
            return {
                deck: copy,
                dealer: [copy.pop(), copy.pop()],
                player: [copy.pop(), copy.pop()],
            }
        }
        case 'HIT': {
            const copy = [...state.deck];
            return {
                deck: copy,
                dealer: state.dealer,
                player: [...state.player, copy.pop()]
            }

        }
        case 'SHUFFLE': {
            const copy = [...state.deck]

            // shuffle the deck with Fisher-Yates algorithm (swap every index of an array with a randomly-chosen index).
            return {
                deck: shuffleDeck(copy),
                dealer: state.dealer,
                player: state.player
            };
        }
        default: {
            return state;
        }

    }
}

function shuffleDeck(copy) {
    for (let index in copy) {
        let swapIndex = Math.floor(Math.random() * copy.length);
        let tempCard = copy[swapIndex];
        copy[swapIndex] = copy[index];
        copy[index] = tempCard;
    }

    return copy;
}




const store = redux.createStore(reducer);

store.subscribe(() => {
    const state = store.getState()
    console.log('deck: ', state.deck.length);
    console.log('dealer: ', state.dealer);
    console.log('player: ', state.player);
    console.log();
});


store.dispatch({type: 'SHUFFLE'});
store.dispatch({type: 'DEAL'});
store.dispatch({type: 'HIT'});
store.dispatch({type: 'HIT'});