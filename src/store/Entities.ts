import { entitiesReducer } from "./Reducer/EntityReducer";
import { combiner } from "./Reducer/combiner";
import {reducer as role} from './Role';
import {reducer as right} from './Right'
import {reducer as tag} from './Tag';;
import {reducer as article} from './Article';
import {reducer as author} from './Author';
import {reducer as video} from './Video';
import {reducer as organizer} from './Organizer';

export const entityReducer = combiner({
    article: entitiesReducer(article, 'article'),
    author: entitiesReducer(author, 'author'),
    organizer: entitiesReducer(organizer, 'organizer'),
    role: entitiesReducer(role, 'role'),
    right: entitiesReducer(right, 'right'),
    tag: entitiesReducer(tag, 'tag'),
    video: entitiesReducer(video, 'video')
});