import {deleteCookie} from "../../components/utils/deleteCookie";

const USER_LOGIN = "USER_LOGIN";
const USER_LOGOUT = "USER_LOGOUT";

// user: user object settings
export function userLogin(user) {
    return {
        type: USER_LOGIN,
        payload: {
            user
        }
    }
}

export function userLogout() {
    return {
        type: USER_LOGOUT
    }
}

const initialState = {
    logged_in: false,
    userSettings: {}
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN: {
            return Object.assign({}, state, {
                logged_in: true,
                userSettings: action.payload.user
            });
        }
        case USER_LOGOUT: {
            deleteCookie("csrftoken" ,"/", window.location.hostname);
            deleteCookie("sessionid" ,"/", window.location.hostname);
            return Object.assign({}, state, initialState);
        }
        default: {
            return state;
        }
    }
}
