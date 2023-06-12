const PROCESS_ACTION = "PROCESS_ACTION";
const CLEAR_ACTIONS = "CLEAR_ACTIONS";

export function ProcessAction(data) {
    return {
        type: PROCESS_ACTION,
        payload: {
            data: data
        }
    }
}

export function ClearActions() {
    return {
        type: CLEAR_ACTIONS,
        payload: {}
    }
}

const initialState = {
    processes: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case PROCESS_ACTION: {
            return Object.assign({}, state, {
                processes: [...state.processes, action.payload.data]
            });
        }
        case CLEAR_ACTIONS: {
            return Object.assign({}, state, {
                processes: []
            });
        }
        default: {
            return state;
        }
    }
}
