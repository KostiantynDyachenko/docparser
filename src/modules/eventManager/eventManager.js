const SENTENCE_BLOCK_MOUSE_OVER = "SENTENCE_BLOCK_MOUSE_OVER";
const SENTENCE_BLOCK_MOUSE_OUT = "SENTENCE_BLOCK_MOUSE_OUT";
const WORD_BLOCK_MOUSE_OVER = "WORD_BLOCK_MOUSE_OVER";
const WORD_BLOCK_MOUSE_OUT = "WORD_BLOCK_MOUSE_OUT";

export function SentenceBlockMouseOver(sentence_id) {
    return {
        type: SENTENCE_BLOCK_MOUSE_OVER,
        payload: {
            sentence_id: sentence_id
        }
    }
}

export function SentenceBlockMouseOut() {
    return {
        type: SENTENCE_BLOCK_MOUSE_OUT,
        payload: {}
    }
}


export function WordBlockMouseOver(phrase_id) {
    return {
        type: WORD_BLOCK_MOUSE_OVER,
        payload: {
            phrase_id: phrase_id
        }
    }
}

export function WordBlockMouseOut() {
    return {
        type: WORD_BLOCK_MOUSE_OUT,
        payload: {}
    }
}

const initialState = {
    current_sentence_mouse_hover: null, // current sentence_id of the sentence user has mouse over
    current_word_mouse_hover: null, // current word_id of the phrase user has mouse over
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SENTENCE_BLOCK_MOUSE_OVER: {
            return Object.assign({}, state, {
                current_sentence_mouse_hover: action.payload.sentence_id
            });
        }
        case SENTENCE_BLOCK_MOUSE_OUT: {
            return Object.assign({}, state, {
                current_sentence_mouse_hover: null
            });
        }
        case WORD_BLOCK_MOUSE_OVER: {
            return Object.assign({}, state, {
                current_word_mouse_hover: action.payload.phrase_id
            });
        }
        case WORD_BLOCK_MOUSE_OUT: {
            return Object.assign({}, state, {
                current_word_mouse_hover: null
            });
        }
        default: {
            return state;
        }
    }
}



