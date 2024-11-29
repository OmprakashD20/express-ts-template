import HttpStatus from "http-status";

export class HTTPError extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly error: string;
  public readonly success: boolean = false;

  constructor(status: number, message: string, error: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ClientError extends HTTPError {
  constructor(status: number, message: string) {
    super(status, message, GetErrorClass(status));
  }
}

export class ServerError extends HTTPError {
  constructor(message: string = "Server Error, Please try again later") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, GetErrorClass(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.FORBIDDEN, message);
  }
}

export class BadRequestError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

export class ConflictError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, message);
  }
}

export class ValidationError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}

export function GetErrorClass(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.NOT_FOUND:
      return "NOT FOUND";
    case HttpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case HttpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case HttpStatus.BAD_REQUEST:
      return "BAD REQUEST";
    case HttpStatus.CONFLICT:
      return "CONFLICT";
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return "VALIDATION ERROR";
    default:
      return "INTERNAL SERVER ERROR";
  }
}
