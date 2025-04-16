import HttpStatus from "http-status";
import winston from "winston";

export class HTTPError extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly error: string;
  public readonly success: boolean = false;
  public readonly logger?: winston.Logger;

  constructor(
    status: number,
    message: string,
    error: string,
    logger?: winston.Logger
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
    this.logger = logger;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ClientError extends HTTPError {
  constructor(status: number, message: string, logger?: winston.Logger) {
    super(status, message, GetErrorClass(status), logger);
  }
}

export class ServerError extends HTTPError {
  public readonly cause?: Error;
  constructor(
    message: string = "Server Error, Please try again later",
    cause?: Error
  ) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      GetErrorClass(HttpStatus.INTERNAL_SERVER_ERROR)
    );
    this.cause = cause;
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.NOT_FOUND, message, logger);
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.UNAUTHORIZED, message, logger);
  }
}

export class ForbiddenError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.FORBIDDEN, message, logger);
  }
}

export class BadRequestError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.BAD_REQUEST, message, logger);
  }
}

export class ConflictError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.CONFLICT, message, logger);
  }
}

export class ValidationError extends ClientError {
  constructor(message: string, logger?: winston.Logger) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, logger);
  }
}

export function GetErrorClass(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.NOT_FOUND:
      return "NOT_FOUND";
    case HttpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case HttpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case HttpStatus.BAD_REQUEST:
      return "BAD_REQUEST";
    case HttpStatus.CONFLICT:
      return "CONFLICT";
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return "VALIDATION_ERROR";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}
