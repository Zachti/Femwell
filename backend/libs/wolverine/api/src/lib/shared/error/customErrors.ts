import { ErrorCode, ErrorMessage } from './enums';

export class InternalServerError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.INTERNAL_SERVER_ERROR);
    this.code = ErrorCode.INTERNAL_SERVER_ERROR;
    this.message = ErrorMessage.INTERNAL_SERVER_ERROR;
  }
}

export class ValidationError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.VALIDATION_ERROR);
    this.code = ErrorCode.VALIDATION_ERROR;
    this.message = ErrorMessage.VALIDATION_ERROR;
  }
}

export class NotFoundError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.NOT_FOUND);
    this.code = ErrorCode.NOT_FOUND;
    this.message = ErrorMessage.NOT_FOUND;
  }
}

export class UnauthenticatedError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.UNAUTHENTICATED);
    this.code = ErrorCode.UNAUTHENTICATED;
    this.message = ErrorMessage.UNAUTHENTICATED;
  }
}

export class ForbiddenError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.FORBIDDEN);
    this.code = ErrorCode.FORBIDDEN;
    this.message = ErrorMessage.FORBIDDEN;
  }
}

export class BadUserInputError extends Error {
  code: ErrorCode;
  override message: ErrorMessage;
  constructor() {
    super(ErrorMessage.BAD_USER_INPUT);
    this.code = ErrorCode.BAD_USER_INPUT;
    this.message = ErrorMessage.BAD_USER_INPUT;
  }
}
