import { schema } from 'normalizr';
import {
    ADD_EVENT_REQUEST,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAILURE,
    LOAD_EVENTS_REQUEST,
    LOAD_EVENTS_SUCCESS,
    LOAD_EVENTS_FAILURE
} from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { getDefaultHeader } from './middleware/Network';
import { EventLink, Event } from '../@types/Entities/Event';
import { tag } from './Tag';
import { organizer } from './Organizer';

export const event = new schema.Entity('event', {
    organizer: organizer,
    tags: [tag]
});

export interface EventEntities {
    [x: number]: Event;
};


const {combinedReducer} = createReducer<EventEntities>({});
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
    organizerLogo?: File | null

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
    }
}