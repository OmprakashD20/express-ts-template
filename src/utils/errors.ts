import status from "http-status";
const HttpStatus = status;

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

  toJSON() {
    return {
      success: this.success,
      [this.error]: this.message,
    };
  }
}

export class ClientError extends HTTPError {
  constructor(status: number, message: string, error: string) {
    super(status, message, error);
  }
}

export class ServerError extends HTTPError {
  constructor(message: string = "Server Error, Please try again later") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, "INTERNAL SERVER ERROR");
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message, "NOT FOUND");
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.FORBIDDEN, message, "FORBIDDEN");
  }
}

export class BadRequestError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message, "BAD REQUEST");
  }
}

export class ConflictError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, message, "CONFLICT");
  }
}

export class ValidationError extends ClientError {
  constructor(message: string) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, "VALIDATION ERROR");
  }
}
