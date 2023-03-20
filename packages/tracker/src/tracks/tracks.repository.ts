import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { ITracksRepository } from "./tracks.repository.interface";
import { Track } from "./track.entity";
import { MongooseService } from "../database/mongoose.service";

@injectable()
export class TracksRepository implements ITracksRepository {
  constructor(
    @inject(TYPES.MongooseService) private mongooseService: MongooseService
  ) {}

  async create(tracks: Track[]) {
    await this.mongooseService.TrackModel.create(tracks);
  }
}

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
