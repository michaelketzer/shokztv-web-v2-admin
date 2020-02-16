import { schema } from 'normalizr';
import { 
    LOAD_ORGANIZERS_REQUEST,
    LOAD_ORGANIZERS_SUCCESS, 
    LOAD_ORGANIZERS_FAILURE, 
    ADD_ORGANIZER_REQUEST, 
    ADD_ORGANIZER_SUCCESS, 
    ADD_ORGANIZER_FAILURE
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