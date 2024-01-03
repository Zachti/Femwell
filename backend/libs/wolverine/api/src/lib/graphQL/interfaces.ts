import { LoggerService } from '@backend/logger';
import { Request } from 'express';

export interface Context {
  logger: LoggerService
  requestContext: RequestContext
  request: Request
}

export interface RequestContext {
  username: string
  requestId: string
}
