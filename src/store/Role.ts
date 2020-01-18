import { schema } from 'normalizr';
import { Role } from '../@types/Entities/Role';
import { LOAD_ROLES_REQUEST, LOAD_ROLES_SUCCESS, LOAD_ROLES_FAILURE, ASSIGN_ROLE_RIGHT_REQUEST, ASSIGN_ROLE_RIGHT_SUCCESS, ASSIGN_ROLE_RIGHT_FAILURE, REMOVE_ROLE_RIGHT_REQUEST, REMOVE_ROLE_RIGHT_SUCCESS, REMOVE_ROLE_RIGHT_FAILURE, ADD_ROLE_REQUEST, ADD_ROLE_SUCCESS, ADD_ROLE_FAILURE } from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API, ServerResponseAction } from './middleware/NetworkMiddlewareTypes';
import { right } from './Right';

const role = new schema.Entity('role', {
    rights: [right],
});

export interface RoleEntities {
    [x: number]: Role;
};

const {addReducer, combinedReducer} = createReducer<RoleEntities>({});

addReducer<ServerResponseAction>(ASSIGN_ROLE_RIGHT_SUCCESS, (state: RoleEntities, {options: {urlParams}}): RoleEntities => {
    const roleId = urlParams.roleId as number;
    const rightId = urlParams.rightId as number;
    const rightSet = new Set<number>([...state[roleId].rights, rightId]);
    //@ts-ignore
    const rights = [...(rightSet.values())];

    return {
        ...state,
        [roleId]: {
            ...state[roleId],
            rights,
        }
    };
});

addReducer<ServerResponseAction>(REMOVE_ROLE_RIGHT_SUCCESS, (state: RoleEntities, {options: {urlParams}}): RoleEntities => {
    const roleId = urlParams.roleId as number;
    const rightId = urlParams.rightId as number;

    return {
        ...state,
        [roleId]: {
            ...state[roleId],
            rights: state[roleId].rights.filter((id) => id !== rightId),
        }
    };
})

export const reducer = combinedReducer;

export function loadRoles(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/role/list`,
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

export function addRole(name: string):  ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const response = await dispatch<Promise<string>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/role/create`,
                method: 'post',
                types: {
                    requestType: ADD_ROLE_REQUEST,
                    successType: ADD_ROLE_SUCCESS,
                    failureType: ADD_ROLE_FAILURE,
                },
                options: {
                    data: {
                        name,
                    },
                },
            },
        });

        if(response === 'success') {
            await dispatch(loadRoles());
        }
    }
}

export function addRight(roleId: number, rightId: number):  ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        const role = getState().entities.role[roleId];
        if(!role.rights.includes(rightId)) {
            dispatch<Promise<Response>>({
                [CALL_API]: {
                    endpoint: `${process.env.API_URL}/role/assignRight/:roleId/:rightId`,
                    method: 'put',
                    types: {
                        requestType: ASSIGN_ROLE_RIGHT_REQUEST,
                        successType: ASSIGN_ROLE_RIGHT_SUCCESS,
                        failureType: ASSIGN_ROLE_RIGHT_FAILURE,
                    },
                    options: {
                        urlParams: {
                            roleId,
                            rightId
                        },
                    }
                },
            });
        }
    }
}

export function removeRight(roleId: number, rightId: number):  ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        const role = getState().entities.role[roleId];
        if(role.rights.includes(rightId)) {
            dispatch<Promise<Response>>({
                [CALL_API]: {
                    endpoint: `${process.env.API_URL}/role/removeRight/:roleId/:rightId`,
                    method: 'del',
                    types: {
                        requestType: REMOVE_ROLE_RIGHT_REQUEST,
                        successType: REMOVE_ROLE_RIGHT_SUCCESS,
                        failureType: REMOVE_ROLE_RIGHT_FAILURE,
                    },
                    options: {
                        urlParams: {
                            roleId,
                            rightId
                        },
                    }
                },
            });
        }
    }
}