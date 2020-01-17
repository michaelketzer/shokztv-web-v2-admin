import { State } from "../Store";
import { ArticleEntities } from "../Article";


export const articlesSelector = (state: State): ArticleEntities => state.entities.article;