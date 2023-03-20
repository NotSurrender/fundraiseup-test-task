import { TrackDto } from "./dto/track.dto";

export interface ITrackService {
  createTracks: (dto: TrackDto[]) => Promise<void>;
}
