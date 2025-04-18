import { Request } from "express";
import { randomBytes } from "crypto";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import config from "@/config";
import { HTTPError, ServerError } from "@/utils/errors";

const { combine, timestamp, json, printf, colorize } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

const getFilePath = (callingModule: NodeModule) => {
  const parts = callingModule.filename.split(path.sep);
  const file = parts.pop();
  const folder = parts[parts.length - 1];
  return `${folder}/${file}`;
};

const SENSITIVE_KEYS = new Set(["password"]);

function generateLogId(): string {
  return randomBytes(16).toString("hex");
}

export default function Logger(callingModule: any) {
  return winston.createLogger({
    format: combine(
      timestamp({ format: timestampFormat }),
      json(),
      printf(({ timestamp, level, message }) => {
        const logEntry = {
          level,
          logId: generateLogId(),
          timestamp,
          environment: config.env.NODE_ENV,
          logData: message,
          file: getFilePath(callingModule),
        };

        return JSON.stringify(logEntry, null, 2);
      })
    ),
    transports: [
      new DailyRotateFile({
        ...config.logs,
        filename: "logs/%DATE%.log",
        level: "error",
      }),
    ],
  });
}

export const ConsoleLogger = winston.createLogger({
  format: combine(
    colorize(),
    timestamp({ format: timestampFormat }),
    printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export function FormatErrorResponse(req: Request, error: HTTPError) {
  const isEmpty = (obj: any) =>
    !obj || (typeof obj === "object" && Object.keys(obj).length === 0);

  const FormatField = (fieldData: any) => {
    if (!fieldData || isEmpty(fieldData)) return undefined;
    return RedactLogData(fieldData);
  };

  const request = {
    url: `[${req.method}] ${req.url}`,
    params: FormatField(req.params),
    query: FormatField(req.query),
    body: FormatField(req.body),
  };

  const response = {
    status: `[${error.status}] ${error.error}`,
    error: error.message,
    ...(error instanceof ServerError && error.cause
      ? { cause: error.cause.stack?.split("\n").map((line) => line.trim()) }
      : {}),
  };

  return {
    request,
    response,
  };
}

function RedactLogData(data: any): any {
  if (!data || typeof data !== "object") return data;

  return Array.isArray(data)
    ? data.map((item) => RedactLogData(item))
    : Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          SENSITIVE_KEYS.has(key) ? "[REDACTED]" : RedactLogData(value),
        ])
      );
}
