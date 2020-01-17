import { State } from "../Store";
import { AuthorEntities } from "../Author";

export const authorEntitiesSelector = (state: State): AuthorEntities => state.entities.author;