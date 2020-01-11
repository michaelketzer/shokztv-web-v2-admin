import { schema } from 'normalizr';
import { ApiActionEntitiesResponse } from './middleware/Network';
import { LOAD_RIGHTS_REQUEST, LOAD_RIGHTS_SUCCESS, LOAD_RIGHTS_FAILURE, LOAD_ROLES_SUCCESS } from './Actions';
import { createReducer } from './Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { Right } from '../@types/Entities/Right';
import { LoadRoleSuccess } from './Role';

export const right = new schema.Entity('right');

export interface RightEntities {
    [x: number]: Right;
};

interface LoadRightSuccess extends ApiActionEntitiesResponse<RightEntities> {
    type: typeof LOAD_RIGHTS_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<RightEntities>({});

addReducer<LoadRoleSuccess>(LOAD_ROLES_SUCCESS, (state: RightEntities, {response: {entities: {right}}}): RightEntities => {
    //@ts-ignore
    return {
        ...state, 
        ...right,
    };
});

addReducer<LoadRightSuccess>(LOAD_RIGHTS_SUCCESS, (state: RightEntities, {response: {entities: {right}}}): RightEntities => {
    return {
        ...state, 
        ...right,
    };
});

export const reducer = combinedReducer;

export function loadRights(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        if(Object.keys(getState().role).length === 0) {
            await dispatch<Response>({
                [CALL_API]: {
                    endpoint: 'http://localhost/right/list',
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