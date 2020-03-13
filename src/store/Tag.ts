import { schema } from 'normalizr';
import { LOAD_TAGS_REQUEST, LOAD_TAGS_SUCCESS, LOAD_TAGS_FAILURE, ADD_TAG_REQUEST, ADD_TAG_SUCCESS, ADD_TAG_FAILURE, DELETE_TAG_REQUEST, DELETE_TAG_SUCCESS, DELETE_TAG_FAILURE, UPDATE_TAG_REQUEST, UPDATE_TAG_SUCCESS, UPDATE_TAG_FAILURE } from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { Tag } from '../@types/Entities/Tag';
import { getDefaultHeader } from './middleware/Network';

export const tag = new schema.Entity('tag');

export interface TagEntities {
    [x: number]: Tag;
};

interface DeleteTagAction {
    options: {
        urlParams: {
            tagId: number;
        };
    };
    type: typeof DELETE_TAG_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<TagEntities>({});

addReducer<DeleteTagAction>(DELETE_TAG_SUCCESS, (state, {options: {urlParams: {tagId}}}) => {
    const newState = {...state};
    delete newState[tagId];
    return newState;
});

export const reducer = combinedReducer;

export function loadTags(): ActionDispatcher<Promise<void>> {
    return async (dispatch, getState) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/tag/list`,
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

export function createTag(name: string, description: string, file?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('name', name);
        data.set('description', description);
        file && data.set('image', file);
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/tag/create`,
                method: 'post',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
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

        await dispatch(loadTags());
    }
}

export function patchTag(tagId: number, name: string = '', description: string = '', file?: File | string | null): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('name', name);
        data.set('description', description);
        if(file instanceof File) {
            data.set('image', file);
        }

        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/tag/:tagId`,
                method: 'patch',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: UPDATE_TAG_REQUEST,
                    successType: UPDATE_TAG_SUCCESS,
                    failureType: UPDATE_TAG_FAILURE,
                },
                options: {
                    data,
                    urlParams: {
                        tagId,
                    },
                },
            },
        });

        await dispatch(loadTags());
    }
}

export function deleteTag(tagId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/tag/:tagId`,
                method: 'del',
                types: {
                    requestType: DELETE_TAG_REQUEST,
                    successType: DELETE_TAG_SUCCESS,
                    failureType: DELETE_TAG_FAILURE,
                },
                options: {
                    urlParams: {
                        tagId,
                    },
                },
            },
        });
    }
}