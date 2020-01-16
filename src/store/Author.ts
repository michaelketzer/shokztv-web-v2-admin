import { schema } from "normalizr";
import { createReducer } from "./Reducer/Reducer";

export const author = new schema.Entity('author');

export interface Author {
    id: number;
    twitch: number;
    name: string;
    title: string;
    avatar: string;
}

export interface AuthorEntities {
    [x: number]: Author;
}

const {combinedReducer} = createReducer<AuthorEntities>({});
export const reducer = combinedReducer;