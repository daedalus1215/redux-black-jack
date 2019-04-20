const redux = require('redux');
const keypress = require('keypress');





// Blackjack card game \\





// Initialize state \\

const storeStructure = {
    deck: [],
    dealer: [],
    player: []
}



// Utility functions \\

//@todo: perhaps we should make a proper 'card' object. This is essentially where we establish the 'card' object's format.
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

/**
 * Retrieve the card's value we pass in.
 * @param {Object} card 
 */
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
            if (state.deck.length < 4) {
                return state;
            }

            const copy = [...state.deck]
            return {
                deck: copy,
                dealer: [copy.pop(), copy.pop()],
                player: [copy.pop(), copy.pop()],
            }
        }
        case 'HIT': {
            // refuse to deal a card to the player if there are no cards to deal out
            if (state.deck.length < 1) {
                return state;
            }

            // don't allow the player to take more cards when they've reached/exceeded the cap for 21 points.
            if (handValue(state.player) >= 21) {
                return state;
            }

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
    const dealerScore = handValue(state.dealer);
    const playerScore = handValue(state.player);

    console.log('deck: ', state.deck.length);
    console.log('dealer: ', state.dealer);
    console.log('Dealer Score: ', dealerScore);
    console.log('player: ', state.player);
    console.log('Player Score: ', playerScore);
    console.log();
});


store.dispatch({type: 'SHUFFLE'});
store.dispatch({type: 'DEAL'});



// keypress library \\
// boilerplate code to interact with terminal 
keypress(process.stdin);
const MENU = '(r) shuffle (d) deal (h) hit (f) finish hand (x) quit';
console.log("=====", MENU);

// register onKeyPress handler and execute store dispatches with certain Actions.
process.stdin.on('keypress', (ch, key) => {
    console.log('key:', key.name);
    if (key.name === 'x') {
        process.stdin.pause();
    } else if (key.name === 'r') {
        store.dispatch({type: "SHUFFLE"});
    } else if (key.name === 'd') {
        store.dispatch({type: "DEAL"});
    } else if (key.name === 'h') {
        store.dispatch({type: "HIT"});
    } else if (key.name === 'f') {
        store.dispatch({type: "FINISH_HAND"});
    }


});

process.stdin.setRawMode(true);
process.stdin.resume();