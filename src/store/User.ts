import { createReducer } from "./Reducer/Reducer";
import { schema } from "normalizr";
import { ActionDispatcher, CALL_API } from "./middleware/NetworkMiddlewareTypes";
import {LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, UPDATE_USER_ROLE_REQUEST, UPDATE_USER_ROLE_SUCCESS, UPDATE_USER_ROLE_FAILURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE} from  './Actions';

export const video = new schema.Entity('user');


export interface User {
    id: number;
    twitch_id: number;
    display_name: string;
    avatar: string;
    custom_title: string;
    role: number;
}

export interface UserEntities {
    [x: number]: User;
}

const {combinedReducer} = createReducer<UserEntities>({});
export const reducer = combinedReducer;

export function loadUsers(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/user/list`,
                schema: [video],
                types: {
                    requestType: LOAD_USER_REQUEST,
                    successType: LOAD_USER_SUCCESS,
                    failureType: LOAD_USER_FAILURE,
                },
            },
        });
    }
}

export function updateUserRole(userId: number, roleId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/user/role/:userId`,
                method: 'patch',
                types: {
                    requestType: UPDATE_USER_ROLE_REQUEST,
                    successType: UPDATE_USER_ROLE_SUCCESS,
                    failureType: UPDATE_USER_ROLE_FAILURE,
                },
                options: {
                    urlParams: {
                        userId,
                    },
                    data: {
                        roleId
                    }
                },
            },
        });

        await dispatch(loadUsers());
    }
}

export function updateUser(userId: number, data: Partial<User>): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/user/:userId`,
                method: 'patch',
                types: {
                    requestType: UPDATE_USER_REQUEST,
                    successType: UPDATE_USER_SUCCESS,
                    failureType: UPDATE_USER_FAILURE,
                },
                options: {
                    urlParams: {
                        userId,
                    },
                    data
                },
            },
        });

        await dispatch(loadUsers());
    }
}