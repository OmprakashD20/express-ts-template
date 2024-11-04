import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

import { ValidatorFactoryReturn } from "@/types";
import { ValidationError } from "@/utils/errors";

export default function ValidatorFactory<T>(
  schema: ZodSchema<T>
): ValidatorFactoryReturn<T> {
  function validator(req: Request, _res: Response, next: NextFunction): void {
    const data = { body: req.body, query: req.query, params: req.params };

    try {
      schema.parse(data);
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issue = error.errors[0];
        throw new ValidationError(issue.message);
      }
    }
  }

  return { validator };
}
