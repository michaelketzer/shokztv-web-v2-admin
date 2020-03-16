import { schema } from 'normalizr';
import {
    ADD_EVENT_REQUEST,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAILURE,
    LOAD_EVENTS_REQUEST,
    LOAD_EVENTS_SUCCESS,
    LOAD_EVENTS_FAILURE,
    CHANGE_MAIN_EVENT_REQUEST,
    CHANGE_MAIN_EVENT_SUCCESS,
    CHANGE_MAIN_EVENT_FAILURE,
    CHANGE_FEATURE_EVENT_REQUEST,
    CHANGE_FEATURE_EVENT_SUCCESS,
    CHANGE_FEATURE_EVENT_FAILURE,
    DELETE_EVENT_REQUEST,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAILURE,
    UPDATE_EVENT_FAILURE,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_REQUEST
} from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { getDefaultHeader } from './middleware/Network';
import { EventLink, Event } from '../@types/Entities/Event';
import { tag } from './Tag';
import { organizer } from './Organizer';
import { eventLinks } from './EventLinks';

export const event = new schema.Entity('event', {
    organizer: organizer,
    tags: [tag],
    links: [eventLinks]
});

export interface EventEntities {
    [x: number]: Event;
};

interface DeleteEventAction {
    options: {
        urlParams: {
            eventId: number;
        };
    };
    type: typeof DELETE_EVENT_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<EventEntities>({});

addReducer<DeleteEventAction>(DELETE_EVENT_SUCCESS, (state, {options: {urlParams: {eventId}}}) => {
    const newState = {...state};
    delete newState[eventId];
    return newState;
});

export const reducer = combinedReducer;

export function loadEvents(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/list`,
                schema: [event],
                types: {
                    requestType: LOAD_EVENTS_REQUEST,
                    successType: LOAD_EVENTS_SUCCESS,
                    failureType: LOAD_EVENTS_FAILURE,
                },
            },
        });
    }
}

export function createEvent(
    name: string,
    organizer: number,
    shortDescription: string,
    start: number,
    end: number,
    country: string,
    location: string,
    pricePool: string,
    description: string,
    descType: string,
    disclaimer: string,
    tags: string[],
    links: Partial<EventLink>[],
    banner?: File | null,
    organizerLogo?: File | null,
    slug?: string
): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('name', name);
        data.set('organizer', ''+organizer);
        data.set('shortDescription', shortDescription);
        data.set('start', ''+start);
        data.set('end', ''+end);
        data.set('country', country);
        data.set('location', location);
        data.set('pricePool', pricePool);
        data.set('descType', descType);
        data.set('description', description);
        data.set('disclaimer', disclaimer);
        data.set('slug', slug);
        banner && data.set('banner', banner);
        organizerLogo && data.set('organizerLogo', organizerLogo);
        tags.forEach((tag) => data.append('tags', tag));
        links.forEach((link) => data.append('links', JSON.stringify(link)));
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/create`,
                method: 'post',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: ADD_EVENT_REQUEST,
                    successType: ADD_EVENT_SUCCESS,
                    failureType: ADD_EVENT_FAILURE,
                },
                options: {
                    data
                },
            },
        });

        await dispatch(loadEvents());
    }
}

export function patchEvent(
    eventId: number,
    name?: string,
    organizer?: number,
    shortDescription?: string,
    start?: number,
    end?: number,
    country?: string,
    location?: string,
    pricePool?: string,
    description?: string,
    descType?: string,
    disclaimer?: string,
    banner?: File | null,
    organizerLogo?: File | null,
    tags?: string[],
    links?: Partial<EventLink>[],
    slug?: string
): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        name && data.set('name', name);
        organizer && data.set('organizer', ''+organizer);
        shortDescription && data.set('shortDescription', shortDescription);
        start && data.set('start', ''+start);
        end && data.set('end', ''+end);
        country && data.set('country', country);
        location && data.set('location', location);
        pricePool && data.set('pricePool', pricePool);
        descType && data.set('descType', descType);
        description && data.set('description', description);
        disclaimer && data.set('disclaimer', disclaimer);
        banner && data.set('banner', banner);
        slug && data.set('slug', slug);
        organizerLogo && data.set('organizerLogo', organizerLogo);
        //@ts-ignore
        tags.length > 0 ? tags.forEach((tag) => data.append('tags', tag)) : data.append('tags', []);
        //@ts-ignore
        links.length > 0 ? links.forEach((link) => data.append('links', JSON.stringify(link))) : data.append('links', []);
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/:eventId`,
                method: 'patch',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: UPDATE_EVENT_REQUEST,
                    successType: UPDATE_EVENT_SUCCESS,
                    failureType: UPDATE_EVENT_FAILURE,
                },
                options: {
                    data,
                    urlParams: {
                        eventId
                    },
                },
            },
        });

        await dispatch(loadEvents());
    }
}

export function changeMainEvent(eventId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/mainEvent/:eventId`,
                method: 'put',
                types: {
                    requestType: CHANGE_MAIN_EVENT_REQUEST,
                    successType: CHANGE_MAIN_EVENT_SUCCESS,
                    failureType: CHANGE_MAIN_EVENT_FAILURE,
                },
                options: {
                    urlParams: {
                        eventId
                    },
                },
            },
        });

        await dispatch(loadEvents());
    }
}

export function toggleFeature(eventId: number, feature: boolean): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/${feature ? 'feature' : 'unfeature'}/:eventId`,
                method: 'put',
                types: {
                    requestType: CHANGE_FEATURE_EVENT_REQUEST,
                    successType: CHANGE_FEATURE_EVENT_SUCCESS,
                    failureType: CHANGE_FEATURE_EVENT_FAILURE,
                },
                options: {
                    urlParams: {
                        eventId
                    },
                },
            },
        });

        await dispatch(loadEvents());
    }
}

export function deleteEvent(eventId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/event/:eventId`,
                method: 'del',
                types: {
                    requestType: DELETE_EVENT_REQUEST,
                    successType: DELETE_EVENT_SUCCESS,
                    failureType: DELETE_EVENT_FAILURE,
                },
                options: {
                    urlParams: {
                        eventId
                    },
                },
            },
        });

        await dispatch(loadEvents());
    }
}