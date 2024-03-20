export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export enum ErrorMessage {
  INTERNAL_SERVER_ERROR = 'An unexpected error has occurred. Please try again later.',
  BAD_USER_INPUT = 'The provided input is invalid. Please check your input and try again.',
  UNAUTHENTICATED = 'You must be logged in to perform this action.',
  FORBIDDEN = 'You do not have permission to perform this action.',
  NOT_FOUND = 'The requested resource(s) could not be found.',
  CONFLICT = 'The request could not be completed due to a conflict with the current state of the resource.',
  VALIDATION_ERROR = 'The request could not be processed due to validation errors.',
}
