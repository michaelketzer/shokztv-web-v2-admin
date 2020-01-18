import { schema } from 'normalizr';
import { LOAD_RIGHTS_REQUEST, LOAD_RIGHTS_SUCCESS, LOAD_RIGHTS_FAILURE } from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { Right } from '../@types/Entities/Right';

export const right = new schema.Entity('right');

export interface RightEntities {
    [x: number]: Right;
};

const {combinedReducer} = createReducer<RightEntities>({});

export const reducer = combinedReducer;

export function loadRights(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        if(Object.keys(getState().entities.role).length === 0) {
            await dispatch<Promise<Response>>({
                [CALL_API]: {
                    endpoint: `${process.env.API_URL}/right/list`,
                    schema: [right],
                    types: {
                        requestType: LOAD_RIGHTS_REQUEST,
                        successType: LOAD_RIGHTS_SUCCESS,
                        failureType: LOAD_RIGHTS_FAILURE,
                    },
                },
            });
        }
    }
}