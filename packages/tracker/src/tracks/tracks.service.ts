import { inject, injectable } from "inversify";
import { ITrackService } from "./tracks.service.interface";
import { TrackDto } from "./dto/track.dto";
import { ITracksRepository } from "./tracks.repository.interface";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class TrackService implements ITrackService {
  constructor(
    @inject(TYPES.TracksRepository) private tracksRepository: ITracksRepository,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  async createTracks(dto: TrackDto[]): Promise<void> {
    await this.tracksRepository.create(dto);
    this.logger.log("Tracks created", { dto });
  }
}
