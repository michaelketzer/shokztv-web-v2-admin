import { State } from "../Store";
import { RightEntities } from "../Right";

export const rightsSelector = (state: State): RightEntities => state.right;