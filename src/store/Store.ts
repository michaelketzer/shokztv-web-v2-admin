import { combineReducers } from "redux";
import {Ui, uiReducer as ui} from './Ui';

export interface State {
    ui: Ui;
}

export const storeReducer = combineReducers<State>({
    ui,
});