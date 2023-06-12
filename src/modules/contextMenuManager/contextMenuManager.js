const SET_CONTEXT_MENU = 'SET_CONTEXT_MENU';
const OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';
const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';

const _bool = false;
const _x = 0;
const _y = 0;
const _actions = [];
const _handleActions = (action) => { console.log(action) };

export function setContextMenu(bool = _bool, x = _x, y = _y, actions = _actions, handleActions = _handleActions) {
    return {
        type: SET_CONTEXT_MENU,
        payload: {
            props: {
                bool: bool,
                x: x,
                y: y,
                actions: actions,
                handleActions: handleActions
            }
        }
    }
}

export function openContextMenu(x = _x, y = _y, actions = _actions, handleActions = _handleActions) {
    return {
        type: OPEN_CONTEXT_MENU,
        payload: {
            props: {
                bool: true,
                x: x,
                y: y,
                actions: actions,
                handleActions: handleActions
            }
        }
    }
}

export function closeContextMenu() {
    return {
        type: CLOSE_CONTEXT_MENU,
        payload: {
            props: {
                bool: false,
                x: _x,
                y: _y,
                actions: _actions,
                handleActions: _handleActions
            }
        }
    }
}

const initialState = {
    bool: false,
    x: 0,
    y: 0,
    actions: [],
    handleActions: () => {}
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CLOSE_CONTEXT_MENU:
        case OPEN_CONTEXT_MENU:
        case SET_CONTEXT_MENU: {
            return Object.assign({}, state, {
                ...action.payload.props
            });
        }
        default: {
            return state;
        }
    }
}
