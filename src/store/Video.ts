import { schema } from "normalizr";
import { createReducer } from "./Reducer/Reducer";
import { tag } from "./Tag";
import { ActionDispatcher, CALL_API } from "./middleware/NetworkMiddlewareTypes";
import {LOAD_VIDEOS_REQUEST, LOAD_VIDEOS_SUCCESS, LOAD_VIDEOS_FAILURE, ADD_VIDEO_SUCCESS, ADD_VIDEO_FAILURE, ADD_VIDEO_REQUEST, DELETE_VIDEO_REQUEST, DELETE_VIDEO_SUCCESS, DELETE_VIDEO_FAILURE, PATCH_VIDEO_REQUEST, PATCH_VIDEO_SUCCESS, PATCH_VIDEO_FAILURE} from './Actions';

export const video = new schema.Entity('video', {
    tags: [tag]
});

export interface Video {
    id: number;
    title: string;
    source: string;
    thumbnail: string;
}

export interface VideoEntities {
    [x: number]: Video;
}


interface DeleteVideoAction {
    options: {
        urlParams: {
            videoId: number;
        };
    };
    type: typeof DELETE_VIDEO_SUCCESS;
}

const {addReducer, combinedReducer} = createReducer<VideoEntities>({});

addReducer<DeleteVideoAction>(DELETE_VIDEO_SUCCESS, (state, {options: {urlParams: {videoId}}}) => {
    const newState = {...state};
    delete newState[videoId];
    return newState;
});

export const reducer = combinedReducer;


export function loadVideos(): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/video/list`,
                schema: [video],
                types: {
                    requestType: LOAD_VIDEOS_REQUEST,
                    successType: LOAD_VIDEOS_SUCCESS,
                    failureType: LOAD_VIDEOS_FAILURE,
                },
            },
        });
    }
}

export function createVideo(title: string, source: string, tags: string []): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/video/create`,
                method: 'post',
                types: {
                    requestType: ADD_VIDEO_REQUEST,
                    successType: ADD_VIDEO_SUCCESS,
                    failureType: ADD_VIDEO_FAILURE,
                },
                options: {
                    data: {title, source, tags},
                },
            },
        });

        await dispatch(loadVideos());
    }
}

export function patchVideo(videoId: number, title: string): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/video/:videoId`,
                method: 'patch',
                types: {
                    requestType: PATCH_VIDEO_REQUEST,
                    successType: PATCH_VIDEO_SUCCESS,
                    failureType: PATCH_VIDEO_FAILURE,
                },
                options: {
                    data: {title},
                    urlParams: {
                        videoId,
                    },
                },
            },
        });

        await dispatch(loadVideos());
    }
}

export function deleteVideo(videoId: number): ActionDispatcher<Promise<void>> {
    return async (dispatch) => {
        await dispatch<Promise<Response>>({
            [CALL_API]: {
                endpoint: `${process.env.API_URL}/video/:videoId`,
                method: 'del',
                types: {
                    requestType: DELETE_VIDEO_REQUEST,
                    successType: DELETE_VIDEO_SUCCESS,
                    failureType: DELETE_VIDEO_FAILURE,
                },
                options: {
                    urlParams: {
                        videoId,
                    },
                },
            },
        });
    }
}