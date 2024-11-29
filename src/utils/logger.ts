import { Request, Response } from "express";
import winston from "winston";
import { randomBytes } from "crypto";
import DailyRotateFile from "winston-daily-rotate-file";

import config from "@/config";
import { GetErrorClass } from "@/utils/errors";

const { combine, timestamp, json, printf, colorize } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

enum SensitiveKeys {
  Password = "password",
}

const SensitiveKeysList: string[] = Object.values(SensitiveKeys);

function generateLogId(): string {
  return randomBytes(16).toString("hex");
}

export default function Logger() {
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
        };

        return JSON.stringify(logEntry, null, 2);
      })
    ),
    transports: [
      new DailyRotateFile({
        ...config.logs,
        filename: "logs/combined/%DATE%.log",
        level: "info",
      }),
      new DailyRotateFile({
        ...config.logs,
        filename: "logs/errors/%DATE%.log",
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

export function FormatLoggerResponse(
  req: Request,
  res: Response,
  responseBody: any
) {
  const isEmpty = (obj: any) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

  const FormatField = (fieldData: any) => {
    if (isEmpty(fieldData)) return undefined;
    return RedactLogData(fieldData);
  };

  const isError = res.statusCode >= 400;
  const request = {
    url: `[${req.method}] ${req.url}`,
    params: FormatField(req.params),
    query: FormatField(req.query),
    body: FormatField(req.body),
  };
  const response = {
    status: `[${res.statusCode}] ${
      isError ? GetErrorClass(res.statusCode) : "SUCCESS"
    }`,
    body: !isError ? RedactLogData(responseBody["data"]) : undefined,
    error: isError ? responseBody[GetErrorClass(res.statusCode)] : undefined,
  };

  return {
    request,
    response,
  };
}

function RedactLogData(data: any): any {
  if (!data) {
    return data;
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map((item) => RedactLogData(item));
    }

    const redactedData = { ...data };

    Object.keys(data).forEach((key) => {
      if (SensitiveKeysList.includes(key)) {
        redactedData[key] = "[REDACTED]";
      } else {
        redactedData[key] = RedactLogData(data[key]);
      }
    });

    return redactedData;
  }

  return data;
}
