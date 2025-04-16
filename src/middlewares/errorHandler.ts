import { NextFunction, Request, Response } from "express";

import { HTTPError } from "@/utils/errors";
import Logger, { FormatErrorResponse } from "@/utils/logger";

export function ErrorHandler(
  err: HTTPError,
  req: Request,
  res: Response,
  __: NextFunction
) {
  const statusCode = err.status;

  const errorResposne = FormatErrorResponse(req, err);

  if (err.logger) err.logger.error(errorResposne);
  else {
    const logger = Logger(module);
    logger.error(errorResposne);
  }

  res.status(statusCode).json({
    success: err.success,
    [err.error]: err.message,
  });
}
