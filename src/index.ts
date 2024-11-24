import express, { Request, Response } from "express";

import cors from "cors";
import helmet from "helmet";

import "./path";

import config from "@/config";
import ErrorHandler from "@/middlewares/errorHandler";
import ResponseInterceptor from "@/middlewares/responseInterceptor";
import AsyncHandler from "@/utils/asyncHandler";
import { NotFoundError } from "@/utils/errors";
import { ConsoleLogger } from "@/utils/logger";

const app = express();

const PORT = config.env.PORT;

app.use(cors());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.disable("x-powered-by");
app.use(express.json());

app.use(ResponseInterceptor);

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
