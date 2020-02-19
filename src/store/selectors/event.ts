import { State } from "../Store";
import { EventEntities } from "../Events";
import { EventLinkEntities } from "../EventLinks";


export const eventsSelector = (state: State): EventEntities => state.entities.event;
export const eventLinkEntitiesSelector = (state: State): EventLinkEntities => state.entities.eventLinks;