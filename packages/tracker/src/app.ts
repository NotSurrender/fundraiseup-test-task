import express, { Express } from "express";
import cors from "cors";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { text, json } from "body-parser";
import { TYPES } from "./types";
import { TrackController } from "./tracks/tracks.controller";
import { IConfigService } from "./config/config.service.interface";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import { MongooseService } from "./database/mongoose.service";
import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.ITrackController) private trackController: TrackController,
    @inject(TYPES.MongooseService) private mongooseService: MongooseService
  ) {
    this.app = express();
    this.port = Number(this.configService.get("PORT"));
  }

  useMiddlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(text());
    this.app.use(json());
  }

  useRoutes() {
    this.app.use("/tracker", this.trackController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();
    await this.mongooseService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log("Tracker started on port ", this.port);
  }

  public close() {
    this.server.close();
  }
}
