import { Request, Response, NextFunction } from "express";
import { TrackDto } from "./dto/track.dto";

export interface ITrackController {
  getFile(req: Request, res: Response, next: NextFunction): Promise<void>;
  track(
    req: Request<{}, {}, TrackDto[]>,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
