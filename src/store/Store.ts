import { combineReducers } from "redux";
import {Ui, uiReducer as ui} from './Ui';
import { RoleEntities, reducer as role } from "./Role";
import { RightEntities, reducer as right } from "./Right";

export interface State {
    role: RoleEntities;
    right: RightEntities;
    ui: Ui;
}

export const storeReducer = combineReducers<State>({
    role,
    right,
    ui,
});