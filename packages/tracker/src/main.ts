import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";
import { ExceptionFilter } from "./errors/exception.filter";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { ITrackController } from "./tracks/tracks.controller.interface";
import { TrackController } from "./tracks/tracks.controller";
import { TrackService } from "./tracks/tracks.service";
import { ITrackService } from "./tracks/tracks.service.interface";
import { MongooseService } from "./database/mongoose.service";
import { TracksRepository } from "./tracks/tracks.repository";
import { ITracksRepository } from "./tracks/tracks.repository.interface";

const trackingAppBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<MongooseService>(TYPES.MongooseService)
    .to(MongooseService)
    .inSingletonScope();
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<ITrackController>(TYPES.ITrackController).to(TrackController);
  bind<ITrackService>(TYPES.ITrackService).to(TrackService);
  bind<ITracksRepository>(TYPES.TracksRepository).to(TracksRepository);
  bind<App>(TYPES.Application).to(App);
});

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(trackingAppBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return { appContainer, app };
}

export const boot = bootstrap();
