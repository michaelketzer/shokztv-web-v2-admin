import { State } from "../Store";

export const newsSelector = (state: State) => state.entities.news;