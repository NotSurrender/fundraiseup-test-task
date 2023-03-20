import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { resolve } from "path";
import { BaseController } from "../common/base.controller";
import { ValidateMiddleware } from "../common/validate.middleware";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { ITrackController } from "./tracks.controller.interface";
import { TrackDto } from "./dto/track.dto";
import { ITrackService } from "./tracks.service.interface";

@injectable()
export class TrackController
  extends BaseController
  implements ITrackController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ITrackService) private trackService: ITrackService
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: "/",
        method: "get",
        func: this.getFile,
      },
      {
        path: "/",
        method: "post",
        func: this.track,
        middlewares: [new ValidateMiddleware(TrackDto)],
      },
    ]);
  }

  async getFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const filePath = resolve("../../client-build/tracker.js");
    res.sendFile(filePath);
  }

  async track(
    { body }: Request<{}, {}, TrackDto[]>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.trackService.createTracks(body);
    this.ok(res, { message: "ok" });
  }
}
