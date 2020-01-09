import { User } from "../@types/Entities/User";
import { createReducer } from "./Reducer";
import { DeepPartial } from "../@types/Generic";
import {mergeStates} from '../utils/MergeStates';
import { SET_UI, LOAD_CURRENT_USER_REQUEST, LOAD_CURRENT_USER_SUCCESS, LOAD_CURRENT_USER_FAILURE, AUTH_USER_REQUEST, AUTH_USER_SUCCESS, AUTH_USER_FAILURE } from "./Actions";
import fetch from 'isomorphic-unfetch';

//#region <interfaces>
export interface Ui {
    currentUser: {
        error?: {
            msg: string;
            code: number;
        };
        requesting: boolean;
        jwt: string | null;
        user: User | null;
    };
};

interface UiSet {
    type: typeof SET_UI;
    ui: DeepPartial<Ui>;
}

interface CurrentUserRequest {
    type: typeof LOAD_CURRENT_USER_REQUEST;
}

interface CurrentUserSuccess {
    type: typeof LOAD_CURRENT_USER_SUCCESS;
    user: User;
}
interface CurrentUserFailure {
    type: typeof LOAD_CURRENT_USER_FAILURE;
    error: {
        msg: string;
        code: number;
    };
}
interface UserAuthorized {
    type: typeof AUTH_USER_SUCCESS;
    jwt: string;
}
//#endregion

const initial: Ui = {
    currentUser: {
        error: null,
        jwt: null,
        requesting: false,
        user: null,
    },
};

//#region <reducer>
const {addReducer, combinedReducer} = createReducer<Ui>(initial);
addReducer<UiSet>(SET_UI, (state, action) => mergeStates(state, action.ui));
addReducer<CurrentUserRequest>(LOAD_CURRENT_USER_REQUEST, (state) => ({
    ...state,
    currentUser: {
        ...state.currentUser,
        requesting: true,
        error: null,
    },
}));
addReducer<CurrentUserSuccess>(LOAD_CURRENT_USER_SUCCESS, (state, {user}) => ({
    ...state,
    currentUser: {
        ...state.currentUser,
        user,
        requesting: false,
        error: null,
    },
}));
addReducer<CurrentUserFailure>(LOAD_CURRENT_USER_FAILURE, (state, {error}) => ({
    ...state,
    currentUser: {
        ...state.currentUser,
        error,
        requesting: false,
    },
}));
addReducer<UserAuthorized>(AUTH_USER_SUCCESS, (state, {jwt}) => ({
    ...state,
    currentUser: {
        ...state.currentUser,
        jwt,
    },
}));

//#endregion

export const uiReducer = combinedReducer;

export function loadCurrentUser() {
    return async (dispatch, getState) => {
        if(!getState().ui.currentUser.requesting) {
            const jwt = getState().ui.currentUser.jwt;
            dispatch({type: LOAD_CURRENT_USER_REQUEST});

            const response = await fetch('http://localhost/auth/user', {
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwt ? {'Authorization': `JWT ${jwt}`} : {})
                },
            });

            if(response.ok) {
                const user = await response.json();
                return dispatch({type: LOAD_CURRENT_USER_SUCCESS, user});
            } else {
                const {msg} = await response.json();
                return dispatch({type: LOAD_CURRENT_USER_FAILURE, error: {msg, code: response.status}});
            }
        }
    }
}

export function authUser(code: string) {
    return async (dispatch, getState) => {
        if(!getState().ui.currentUser.requesting) {
            dispatch({type: AUTH_USER_REQUEST});

            const response = await fetch(
                `http://localhost/auth/twitch/callback?code=${code}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(response.ok) {
                const jwt = await response.json();
                return dispatch({type: AUTH_USER_SUCCESS, jwt});
            } else {
                const {msg} = await response.json();
                return dispatch({type: AUTH_USER_FAILURE, error: {msg, code: response.status}});

            }
        }
    }
}
