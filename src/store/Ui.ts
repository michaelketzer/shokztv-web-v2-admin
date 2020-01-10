import { User } from "../@types/Entities/User";
import { createReducer } from "./Reducer";
import { DeepPartial } from "../@types/Generic";
import {mergeStates} from '../utils/MergeStates';
import { SET_UI, LOAD_CURRENT_USER_REQUEST, LOAD_CURRENT_USER_SUCCESS, LOAD_CURRENT_USER_FAILURE, AUTH_USER_REQUEST, AUTH_USER_SUCCESS, AUTH_USER_FAILURE } from "./Actions";
import { CALL_API, ActionDispatcher } from './middleware/NetworkMiddlewareTypes';
import { ApiActionResponse } from "./middleware/Network";

//#region <interfaces>
export interface Ui {
    currentUser: User | null;
};

interface UiSet {
    type: typeof SET_UI;
    ui: DeepPartial<Ui>;
}

interface CurrentUserSuccess extends ApiActionResponse<User> {
    type: typeof LOAD_CURRENT_USER_SUCCESS;
}
//#endregion

const initial: Ui = {
    currentUser: null,
};

//#region <reducer>
const {addReducer, combinedReducer} = createReducer<Ui>(initial);
addReducer<UiSet>(SET_UI, (state, action) => mergeStates(state, action.ui));
addReducer<CurrentUserSuccess>(LOAD_CURRENT_USER_SUCCESS, (state, {response: {data}}) => {
    return {
        ...state,
        currentUser: data ? data : null
    };
});

//#endregion

export const uiReducer = combinedReducer;

export function loadCurrentUser(): ActionDispatcher<Promise<Response>> {
    return async (dispatch, getState) => {
        if(!getState().ui.currentUser) {
            return await dispatch({
                [CALL_API]: {
                    endpoint: 'http://localhost/auth/user',
                    types: {
                        requestType: LOAD_CURRENT_USER_REQUEST,
                        successType: LOAD_CURRENT_USER_SUCCESS,
                        failureType: LOAD_CURRENT_USER_FAILURE,
                    },
                },
            });
        }
    }
}

export function authUser(code: string) {
    return async (dispatch, getState) => {
        if(!getState().ui.currentUser) {
            const response = await dispatch({
                [CALL_API]: {
                    endpoint: `http://localhost/auth/twitch/callback?code=${code}`,
                    headers: { 'Content-Type': 'text/html' },
                    types: {
                        requestType: AUTH_USER_REQUEST,
                        successType: AUTH_USER_SUCCESS,
                        failureType: AUTH_USER_FAILURE,
                    },
                },
            });
            if(response.code === 200) {
                localStorage.setItem('jwt', response.data);
            }

            await dispatch(loadCurrentUser());
        }
    }
}
