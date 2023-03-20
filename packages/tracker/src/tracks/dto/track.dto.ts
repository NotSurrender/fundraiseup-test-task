import { IsArray, IsNumber, IsString } from "class-validator";

export class TrackDto {
  @IsString({ message: "event is required" })
  event: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString({ message: "url is required" })
  url: string;

  @IsString({ message: "title is required" })
  title: string;

  @IsNumber({}, { message: "ts is required" })
  ts: number;
}
