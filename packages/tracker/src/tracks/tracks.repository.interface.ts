import { Track } from "./track.entity";

export interface ITracksRepository {
  create: (tracks: Track[]) => Promise<void>;
}
