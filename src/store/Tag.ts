import { schema } from 'normalizr';
import { LOAD_TAGS_REQUEST, LOAD_TAGS_SUCCESS, LOAD_TAGS_FAILURE } from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { Tag } from '../@types/Entities/Tag';

export const tag = new schema.Entity('tag');

export interface TagEntities {
    [x: number]: Tag;
};

const {combinedReducer} = createReducer<TagEntities>({});

export const reducer = combinedReducer;

export function loadTags(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        if(Object.keys(getState().entities.tag).length === 0) {
            await dispatch<Response>({
                [CALL_API]: {
                    endpoint: 'http://localhost/tag/list',
                    schema: [tag],
                    types: {
                        requestType: LOAD_TAGS_REQUEST,
                        successType: LOAD_TAGS_SUCCESS,
                        failureType: LOAD_TAGS_FAILURE,
                    },
                },
            });
        }
    }
}