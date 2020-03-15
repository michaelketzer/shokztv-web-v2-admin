import { State } from "../Store";
import { StreamerEntities } from "../Streamer";

export const streamerSelector = (state: State): StreamerEntities => state.entities.streamer;