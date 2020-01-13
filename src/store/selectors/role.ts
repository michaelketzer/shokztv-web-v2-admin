import { State } from "../Store";
import { RoleEntities } from "../Role";

export const roleSelector = (state: State): RoleEntities => state.entities.role;