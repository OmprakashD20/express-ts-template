import express, { Request, Response } from "express";

import helmet from "helmet";

import "./path";

import config from "@/config";
import { CorsHandler } from "@/middlewares/corsHandler";
import { ErrorHandler } from "@/middlewares/errorHandler";
import AsyncHandler from "@/utils/asyncHandler";
import { NotFoundError } from "@/utils/errors";
import { ConsoleLogger } from "@/utils/logger";

const app = express();

const PORT = config.env.PORT;

app.use(CorsHandler);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.disable("x-powered-by");
app.use(express.json());

app.get(
  "/",
  AsyncHandler(async (_: Request, __: Response) => {
    return { message: "Starter Template", statusCode: 200 };
  })
);

//404 handler
app.all(
  "*",
  AsyncHandler((_: Request, __: Response) => {
    throw new NotFoundError("Route not found");
  })
);

app.use(ErrorHandler);

app.listen(PORT, () => {
  ConsoleLogger.info(
    `✅ Server listing on port ${PORT}, running in ${config.env.NODE_ENV} env`
  );
});
