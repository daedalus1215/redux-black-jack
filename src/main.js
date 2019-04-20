const redux = require('redux');


// Blackjack card game

// initial state
const storeStructure = {
    deck: [],
    dealer: [],
    player: []
}


// utility functions \\

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


function getCardValue(card) {
    if (card.face === 'A') {
        return 11;
    } if ('JQK'.indexOf(card.face) >= 0) {
        return 10;
    } else {
        return card.face;
    }
}


function handValue(hand) {
    return hand.map(getCardValue).reduce((a, b) => a + b, 0);
}


/**
 ****** Actions *******
 * 
 * Create a reducer that accepts action and returns a new state
 * depending on the action
 * 
 * 
 * initialize - start with a fresh deck
 * shuffle - shuffle the deck
 * deal - give two cards to dealer and the player
 * hit - give one card just to the player
 * stay - end current hand ()
 * fold - end current hand (quit)
 */
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
        case 'FINISH_HAND': {
            return {
                deck: [...state.deck, ...state.dealer, ...state.player],
                dealer: [],
                player: []
            }
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
store.dispatch({type: 'FINISH_HAND'});