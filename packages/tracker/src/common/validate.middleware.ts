import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { IMiddleware } from "./middleware.interface";
import { validate } from "class-validator";

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    req.body = JSON.parse(req.body);
    const errors = [];

    for (let key in req.body) {
      const instance = plainToClass(this.classToValidate, req.body[key]);
      errors.push(...(await validate(instance)));
    }

    if (errors.length) {
      res.status(422).send(errors);
    } else {
      next();
    }
  }
}
