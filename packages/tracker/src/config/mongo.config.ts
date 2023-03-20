import { IConfigService } from "./config.service.interface";

export const getMongoConfig = (configService: IConfigService) => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: IConfigService) =>
  "mongodb://" +
  configService.get("MONGO_LOGIN") +
  ":" +
  configService.get("MONGO_PASSWORD") +
  "@" +
  configService.get("MONGO_HOST") +
  ":" +
  configService.get("MONGO_PORT") +
  "/" +
  configService.get("MONGO_AUTHDATABASE");

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
