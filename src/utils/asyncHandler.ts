import { Request, Response, NextFunction } from "express";

import { AsyncHandlerReturn } from "@/types";
import { HTTPError, ServerError } from "@/utils/errors";

export default function AsyncHandler<T>(
  fn: (req: Request, res: Response) => Promise<AsyncHandlerReturn<T>>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { statusCode, data } = await fn(req, res);

      res.status(statusCode).json({ success: true, data });
    } catch (error: any) {
      if (error instanceof HTTPError) next(error);
      else {
        throw new ServerError();
      }
    }
  };
}
