import { NextFunction, query, Request, Response } from "express";

import { TObject } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { StandardValidator } from "typebox-validators/standard";

import { ValidatorFactoryReturn } from "@/types";
import { ValidationError } from "@/utils/errors";

export default function ValidatorFactory<T>(
  schema: TObject
): ValidatorFactoryReturn<T> {
  const C = TypeCompiler.Compile(schema);

  const validator = new StandardValidator(schema);

  function validate(req: Request, _res: Response, next: NextFunction): void {
    const data = { body: req.body, query: req.query, params: req.params };
    const isValid = C.Check(data);
    if (isValid) {
      return next();
    }

    const error = validator.testReturningFirstError(data)!;
    const path = error.path.split("/").reverse()[0];
    const errorMsg = `${path.charAt(0).toUpperCase() + path.slice(1)}: ${
      error.message
    }`;

    throw new ValidationError(errorMsg);
  }

  return { schema, validate };
}

export * from "./project";
