import { schema } from 'normalizr';
import { 
    LOAD_ORGANIZERS_REQUEST,
    LOAD_ORGANIZERS_SUCCESS, 
    LOAD_ORGANIZERS_FAILURE, 
    ADD_ORGANIZER_REQUEST, 
    ADD_ORGANIZER_SUCCESS, 
    ADD_ORGANIZER_FAILURE,
    UPDATE_ORGANIZER_SUCCESS,
    UPDATE_ORGANIZER_FAILURE,
    UPDATE_ORGANIZER_REQUEST,
    DELETE_ORGANIZER_REQUEST,
    DELETE_ORGANIZER_SUCCESS,
    DELETE_ORGANIZER_FAILURE
} from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { getDefaultHeader } from './middleware/Network';
import { Organizer } from '../@types/Entities/Organizer';

export const organizer = new schema.Entity('organizer');

export interface OrganizerEntities {
    [x: number]: Organizer;
};


const {combinedReducer} = createReducer<OrganizerEntities>({});
export const reducer = combinedReducer;

export function loadOrganizer(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/organizer/list`,
                schema: [organizer],
                types: {
                    requestType: LOAD_ORGANIZERS_REQUEST,
                    successType: LOAD_ORGANIZERS_SUCCESS,
                    failureType: LOAD_ORGANIZERS_FAILURE,
                },
            },
        });
    }
}

export function createOrganizer(name: string, icon?: File, logo?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('name', name);
        icon && data.set('icon', icon);
        logo && data.set('logo', logo);
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/organizer/create`,
                method: 'post',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: ADD_ORGANIZER_REQUEST,
                    successType: ADD_ORGANIZER_SUCCESS,
                    failureType: ADD_ORGANIZER_FAILURE,
                },
                options: {
                    data
                },
            },
        });

        await dispatch(loadOrganizer());
    }
}

export function patchOrganizer(organizerId: number, name?: string, icon?: File, logo?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        name && data.set('name', name);
        icon && data.set('icon', icon);
        logo && data.set('logo', logo);
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/organizer/:organizerId`,
                method: 'patch',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: UPDATE_ORGANIZER_REQUEST,
                    successType: UPDATE_ORGANIZER_SUCCESS,
                    failureType: UPDATE_ORGANIZER_FAILURE,
                },
                options: {
                    data,
                    urlParams: {
                        organizerId,
                    },
                },
            },
        });

        await dispatch(loadOrganizer());
    }
}

export function deleteOrganizer(organizerId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/organizer/:organizerId`,
                method: 'del',
                types: {
                    requestType: DELETE_ORGANIZER_REQUEST,
                    successType: DELETE_ORGANIZER_SUCCESS,
                    failureType: DELETE_ORGANIZER_FAILURE,
                },
                options: {
                    urlParams: {
                        organizerId,
                    },
                },
            },
        });

        await dispatch(loadOrganizer());
    }
}