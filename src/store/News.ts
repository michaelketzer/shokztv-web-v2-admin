import { schema } from 'normalizr';
import { 
    LOAD_NEWS_REQUEST,
    LOAD_NEWS_SUCCESS, 
    LOAD_NEWS_FAILURE,
    ADD_NEWS_REQUEST,
    ADD_NEWS_SUCCESS,
    ADD_NEWS_FAILURE,
    UPDATE_NEWS_REQUEST,
    UPDATE_NEWS_SUCCESS,
    UPDATE_NEWS_FAILURE,
    DELETE_NEWS_REQUEST,
    DELETE_NEWS_SUCCESS,
    DELETE_NEWS_FAILURE
} from './Actions';
import { createReducer } from './Reducer/Reducer';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { News } from '../@types/Entities/News';

export const news = new schema.Entity('news');

export interface NewsEntities {
    [x: number]: News;
};

interface DeleteNewsAtion {
    options: {
        urlParams: {
            newsId: number;
        };
    };
    type: typeof DELETE_NEWS_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<NewsEntities>({});

addReducer<DeleteNewsAtion>(DELETE_NEWS_SUCCESS, (state, {options: {urlParams: {newsId}}}) => {
    const newState = {...state};
    delete newState[newsId];
    return newState;
});

export const reducer = combinedReducer;

export function loadNews(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/news/list`,
                schema: [news],
                types: {
                    requestType: LOAD_NEWS_REQUEST,
                    successType: LOAD_NEWS_SUCCESS,
                    failureType: LOAD_NEWS_FAILURE,
                },
            },
        });
    }
}

export function createNews(name: string, description: string, source: string): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/news/create`,
                method: 'post',
                types: {
                    requestType: ADD_NEWS_REQUEST,
                    successType: ADD_NEWS_SUCCESS,
                    failureType: ADD_NEWS_FAILURE,
                },
                options: {
                    data: {name, description, source},
                },
            },
        });

        await dispatch(loadNews());
    }
}

export function patchNews(newsId: number, name: string, description: string, source: string): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/news/:newsId`,
                method: 'patch',
                types: {
                    requestType: UPDATE_NEWS_REQUEST,
                    successType: UPDATE_NEWS_SUCCESS,
                    failureType: UPDATE_NEWS_FAILURE,
                },
                options: {
                    data: {name, description, source},
                    urlParams: {newsId},
                },
            },
        });

        await dispatch(loadNews());
    }
}

export function deleteNews(newsId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/news/:newsId`,
                method: 'del',
                types: {
                    requestType: DELETE_NEWS_REQUEST,
                    successType: DELETE_NEWS_SUCCESS,
                    failureType: DELETE_NEWS_FAILURE,
                },
                options: {
                    urlParams: {newsId},
                },
            },
        });
    }
}