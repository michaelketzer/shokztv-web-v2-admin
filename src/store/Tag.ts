import { schema } from 'normalizr';
import { LOAD_TAGS_REQUEST, LOAD_TAGS_SUCCESS, LOAD_TAGS_FAILURE, ADD_TAG_REQUEST, ADD_TAG_SUCCESS, ADD_TAG_FAILURE } from './Actions';
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

export function createTag(name: string, file?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('name', name);
        file && data.set('image', file);
        
        dispatch<Response>({
            [CALL_API]: {
                endpoint: 'http://localhost/tag/create',
                method: 'post',
                types: {
                    requestType: ADD_TAG_REQUEST,
                    successType: ADD_TAG_SUCCESS,
                    failureType: ADD_TAG_FAILURE,
                },
                options: {
                    data
                },
            },
        });
    }
}

export function patchTag(tagId: number, name?: string, file?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        name && data.set('name', name);
        file && data.set('image', file);

        dispatch<Response>({
            [CALL_API]: {
                endpoint: 'http://localhost/tag/:tagId',
                method: 'patch',
                types: {
                    requestType: ADD_TAG_REQUEST,
                    successType: ADD_TAG_SUCCESS,
                    failureType: ADD_TAG_FAILURE,
                },
                options: {
                    data,
                    urlParams: {
                        tagId,
                    },
                },
            },
        });
    }
}