import { schema } from 'normalizr';
import { createReducer } from './Reducer/Reducer';
import { EventLink } from '../@types/Entities/Event';

export const eventLinks = new schema.Entity('eventLinks');
export interface EventLinkEntities {
    [x: number]: EventLink;
};

const {combinedReducer} = createReducer<EventLinkEntities>({});
export const reducer = combinedReducer;
