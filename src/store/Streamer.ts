import { schema } from 'normalizr';
import {  LOAD_STREAMER_REQUEST, LOAD_STREAMER_SUCCESS, LOAD_STREAMER_FAILURE, ADD_STREAMER_REQUEST, ADD_STREAMER_SUCCESS, ADD_STREAMER_FAILURE, DELETE_STREAMER_REQUEST, DELETE_STREAMER_SUCCESS, DELETE_STREAMER_FAILURE } from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';

export const streamer = new schema.Entity('streamer');

interface Streamer {
    id: number;
    twitchId: string;
    name: string;
    online: boolean;
    title: string;
    preview: string;
    previewWEBP: string;
    previewJP2: string;
}
export interface StreamerEntities {
    [x: number]: Streamer;
};

interface DeleteStreamerAction {
    options: {
        urlParams: {
            streamerId: number;
        };
    };
    type: typeof DELETE_STREAMER_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<StreamerEntities>({});

addReducer<DeleteStreamerAction>(DELETE_STREAMER_SUCCESS, (state, {options: {urlParams: {streamerId}}}) => {
    const newState = {...state};
    delete newState[streamerId];
    return newState;
});

export const reducer = combinedReducer;

export function loadStreamer(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/streamer/list`,
                schema: [streamer],
                types: {
                    requestType: LOAD_STREAMER_REQUEST,
                    successType: LOAD_STREAMER_SUCCESS,
                    failureType: LOAD_STREAMER_FAILURE,
                },
            },
        });
    }
}

export function createStreamer(name: string): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/streamer/create`,
                method: 'post',
                types: {
                    requestType: ADD_STREAMER_REQUEST,
                    successType: ADD_STREAMER_SUCCESS,
                    failureType: ADD_STREAMER_FAILURE,
                },
                options: {
                    data: {name}
                },
            },
        });

        await dispatch(loadStreamer());
    }
}

export function removeStreamer(streamerId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/streamer/remove/:streamerId`,
                method: 'del',
                types: {
                    requestType: DELETE_STREAMER_REQUEST,
                    successType: DELETE_STREAMER_SUCCESS,
                    failureType: DELETE_STREAMER_FAILURE,
                },
                options: {
                    urlParams: {
                        streamerId,
                    },
                },
            },
        });
    }
}