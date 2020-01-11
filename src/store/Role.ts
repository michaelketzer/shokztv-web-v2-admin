import { schema } from 'normalizr';
import { Role } from '../@types/Entities/Role';
import { ApiActionEntitiesResponse } from './middleware/Network';
import { LOAD_ROLES_REQUEST, LOAD_ROLES_SUCCESS, LOAD_ROLES_FAILURE } from './Actions';
import { createReducer } from './Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { right, RightEntities } from './Right';

const role = new schema.Entity('role', {
    rights: [right],
});

export interface RoleEntities {
    [x: number]: Role;
};

export interface LoadRoleSuccess extends ApiActionEntitiesResponse<RoleEntities | RightEntities> {
    type: typeof LOAD_ROLES_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<RoleEntities>({});

addReducer<LoadRoleSuccess>(LOAD_ROLES_SUCCESS, (state: RoleEntities, {response: {entities: {role}}}): RoleEntities => {
    return {
        ...state, 
        ...role,
    };
});

export const reducer = combinedReducer;

export function loadRoles(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        if(Object.keys(getState().role).length === 0) {
            await dispatch<Response>({
                [CALL_API]: {
                    endpoint: 'http://localhost/role/list',
                    schema: [role],
                    types: {
                        requestType: LOAD_ROLES_REQUEST,
                        successType: LOAD_ROLES_SUCCESS,
                        failureType: LOAD_ROLES_FAILURE,
                    },
                },
            });
        }
    }
}