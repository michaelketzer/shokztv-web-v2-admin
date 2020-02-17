import { State } from "../Store";
import { EventEntities } from "../Events";


export const eventsSelector = (state: State): EventEntities => state.entities.event;