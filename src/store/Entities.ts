import { entitiesReducer } from "./Reducer/EntityReducer";
import { combiner } from "./Reducer/combiner";
import {reducer as role} from './Role';
import {reducer as right} from './Right'
import {reducer as tag} from './Tag';;
import {reducer as article} from './Article';

export const entityReducer = combiner({
    article: entitiesReducer(article, 'article'),
    role: entitiesReducer(role, 'role'),
    right: entitiesReducer(right, 'right'),
    tag: entitiesReducer(tag, 'tag'),
});