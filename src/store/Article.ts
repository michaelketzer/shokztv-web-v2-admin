import { schema } from 'normalizr';
import { ADD_ARTICLE_FAILURE, ADD_ARTICLE_SUCCESS, ADD_ARTICLE_REQUEST, LOAD_ARTICLES_REQUEST, LOAD_ARTICLES_SUCCESS, LOAD_ARTICLES_FAILURE, PUBLISH_ARTICLE_FAILURE, PUBLISH_ARTICLE_SUCCESS, PUBLISH_ARTICLE_REQUEST, UNPUBLISH_ARTICLE_FAILURE, UNPUBLISH_ARTICLE_SUCCESS, UNPUBLISH_ARTICLE_REQUEST, UPDATE_ARTICLE_REQUEST, UPDATE_ARTICLE_SUCCESS, UPDATE_ARTICLE_FAILURE, DELETE_ARTICLE_FAILURE, DELETE_ARTICLE_SUCCESS, DELETE_ARTICLE_REQUEST } from './Actions';
import { ActionDispatcher, CALL_API } from './middleware/NetworkMiddlewareTypes';
import { getDefaultHeader } from './middleware/Network';
import { loadTags, tag } from './Tag';
import { createReducer } from './Reducer/Reducer';
import { author } from './Author';

export const article = new schema.Entity('article', {
    author,
    tags: [tag]
});

export interface Article {
    id: number;
    title: string;
    body: string;
    slug: string;
    tags: number[];
    cover: string;
    status: string;
    author: number;
    created: number;
}

interface DeleteArticleAction {
    options: {
        urlParams: {
            articleId: number;
        };
    };
    type: typeof DELETE_ARTICLE_SUCCESS;
}

export interface ArticleEntities {
    [x: number]: Article;
};

const {addReducer, combinedReducer} = createReducer<ArticleEntities>({});

addReducer<DeleteArticleAction>(DELETE_ARTICLE_SUCCESS, (state, {options: {urlParams: {articleId}}}) => {
    const newState = {...state};
    delete newState[articleId];
    return newState;
});

export const reducer = combinedReducer;

export function loadArticles(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/list`,
                schema: [article],
                types: {
                    requestType: LOAD_ARTICLES_REQUEST,
                    successType: LOAD_ARTICLES_SUCCESS,
                    failureType: LOAD_ARTICLES_FAILURE,
                },
            },
        });

        await dispatch(loadTags());
    }
}

export function createArticle(title: string, tags: string[], body: string, slug: string, cover?: File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('title', title);
        data.set('body', body);
        data.set('slug', slug);
        cover && data.set('cover', cover);
        tags.forEach((tag) => data.append('tags', tag));
        
        await dispatch<Response>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/create`,
                method: 'post',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: ADD_ARTICLE_REQUEST,
                    successType: ADD_ARTICLE_SUCCESS,
                    failureType: ADD_ARTICLE_FAILURE,
                },
                options: {
                    data
                },
            },
        });

        await dispatch(loadTags());
        await dispatch(loadArticles());
    }
}

export function patchArticle(articleId: number, title: string, tags: string[], body: string, slug: string, cover?: null | string | File): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        const data = new FormData();
        data.set('title', title);
        data.set('body', body);
        data.set('slug', slug);
        cover instanceof File && data.set('cover', cover);
        tags.forEach((tag) => data.append('tags', tag));
        
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/:articleId`,
                method: 'patch',
                headers: {
                    ...(getDefaultHeader()['Authorization'] ? {'Authorization': getDefaultHeader()['Authorization']} : {})
                },
                types: {
                    requestType: UPDATE_ARTICLE_REQUEST,
                    successType: UPDATE_ARTICLE_SUCCESS,
                    failureType: UPDATE_ARTICLE_FAILURE,
                },
                options: {
                    urlParams: {
                        articleId,
                    },
                    data
                },
            },
        });

        await dispatch(loadTags());
        await dispatch(loadArticles());
    }
}

export function publishArticle(articleId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/:articleId/publish`,
                method: 'patch',
                types: {
                    requestType: PUBLISH_ARTICLE_REQUEST,
                    successType: PUBLISH_ARTICLE_SUCCESS,
                    failureType: PUBLISH_ARTICLE_FAILURE,
                },
                options: {
                    urlParams: {
                        articleId,
                    } ,
                },
            },
        });

        await dispatch(loadArticles());
    }
}

export function unpublishArticle(articleId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/:articleId/unpublish`,
                method: 'patch',
                types: {
                    requestType: UNPUBLISH_ARTICLE_REQUEST,
                    successType: UNPUBLISH_ARTICLE_SUCCESS,
                    failureType: UNPUBLISH_ARTICLE_FAILURE,
                },
                options: {
                    urlParams: {
                        articleId,
                    } ,
                },
            },
        });

        await dispatch(loadArticles());
    }
}

export function deleteArticle(articleId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/article/:articleId`,
                method: 'del',
                types: {
                    requestType: DELETE_ARTICLE_REQUEST,
                    successType: DELETE_ARTICLE_SUCCESS,
                    failureType: DELETE_ARTICLE_FAILURE,
                },
                options: {
                    urlParams: {
                        articleId,
                    } ,
                },
            },
        });
    }
}