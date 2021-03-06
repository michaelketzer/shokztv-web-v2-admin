import { combineReducers } from "redux";
import {Ui, uiReducer as ui} from './Ui';
import { RoleEntities, reducer as role } from "./Role";
import { RightEntities, reducer as right } from "./Right";
import { entityReducer } from "./Entities";
import { TagEntities } from "./Tag";
import { ArticleEntities } from "./Article";
import { AuthorEntities } from "./Author";
import { VideoEntities } from "./Video";
import { OrganizerEntities } from "./Organizer";
import { EventEntities } from "./Events";
import { NewsEntities } from "./News";
import { EventLinkEntities } from "./EventLinks";
import { UserEntities } from "./User";
import { StreamerEntities } from "./Streamer";

export interface State {
    entities: {
        article: ArticleEntities;
        author: AuthorEntities;
        event: EventEntities;
        eventLinks: EventLinkEntities;
        organizer: OrganizerEntities;
        news: NewsEntities;
        role: RoleEntities;
        right: RightEntities;
        streamer: StreamerEntities;
        tag: TagEntities;
        user: UserEntities;
        video: VideoEntities;
    };
    ui: Ui;
}

export const storeReducer = combineReducers<State>({
    //@ts-ignore
    entities: entityReducer,
    ui,
});