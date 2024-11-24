import { Request, Response } from "express";
import winston from "winston";
import { randomBytes } from "crypto";
import DailyRotateFile from "winston-daily-rotate-file";

import config from "@/config";

const { combine, timestamp, json, printf, label, colorize } = winston.format;
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
      printf(({ timestamp, level, message, ...data }) => {
        const response = {
          level,
          logId: generateLogId(),
          timestamp,
          environment: config.env.NODE_ENV,
          message,
          data,
        };

        return JSON.stringify(response, null, 2);
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
    label({ label: config.env.NODE_ENV }),
    timestamp({ format: timestampFormat }),
    colorize({ level: false }),
    printf(
      ({ message, label, timestamp }) => `[${timestamp}] (${label}): ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export function FormatLoggerResponse(
  req: Request,
  res: Response,
  responseBody: any
) {
  return {
    request: {
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    },
    response: {
      statusCode: res.statusCode,
      body: RedactLogData(responseBody),
    },
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
