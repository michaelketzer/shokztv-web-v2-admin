import { State } from "../Store";
import { User } from "../../@types/Entities/User";

export const currentUserSelector = (state: State): User | null => state.ui.currentUser;