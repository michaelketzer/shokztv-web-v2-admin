import { combineReducers } from "redux";
import {Ui, uiReducer as ui} from './Ui';
import { RoleEntities, reducer as role } from "./Role";
import { RightEntities, reducer as right } from "./Right";
import { entityReducer } from "./Entities";
import { TagEntities } from "./Tag";

export interface State {
    entities: {
        role: RoleEntities;
        right: RightEntities;
        tag: TagEntities;
    };
    ui: Ui;
}

export const storeReducer = combineReducers<State>({
    //@ts-ignore
    entities: entityReducer,
    ui,
});