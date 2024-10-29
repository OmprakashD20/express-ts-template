import express, { Request, Response } from "express";

import cors from "cors";
import helmet from "helmet";

import "./path";

import config from "@/config";

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

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({ message: "Starter Template" });
});

//404 handler
app.all("*", (_: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(
    `✅ Server listing on port ${PORT}, running in ${config.env.NODE_ENV} env`
  );
});