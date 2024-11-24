import { Request, Response, NextFunction } from "express";

import Logger, { FormatLoggerResponse } from "@/utils/logger";
import config from "@/config";

export default function ResponseInterceptor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (config.env.NODE_ENV === "development") return next();

  const logger = Logger();

  const originalJson = res.json;

  let responseSent = false;

  res.json = function (body: any): Response {
    if (!responseSent) {
      const formattedResponse = FormatLoggerResponse(req, res, body);
      if (res.statusCode >= 400) {
        logger.error(formattedResponse);
      } else {
        logger.info(formattedResponse);
      }

      responseSent = true;
    }

    return originalJson.call(this, body);
  };

  next();
}
