import { Mongoose, Schema, Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { getMongoConfig } from "../config/mongo.config";
import { Track } from "../tracks/track.entity";

@injectable()
export class MongooseService {
  private client: Mongoose;
  public TrackModel: Model<Track>;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    this.client = new Mongoose();
  }

  async connect() {
    try {
      const { uri } = getMongoConfig(this.configService);
      await this.client.connect(uri);
      this.registerSchemas();
      this.logger.log("[MongooseService] Connected to database");
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          "[MongooseService] Error connecting to database" + err.message
        );
      }
    }
  }

  async disconnect() {
    await this.client.disconnect();
  }

  private registerSchemas() {
    const TrackSchema = new Schema<Track>({
      event: String,
      tags: [String],
      url: String,
      title: String,
      ts: Number,
    });

    this.TrackModel = this.client.model("Track", TrackSchema);
  }
}
