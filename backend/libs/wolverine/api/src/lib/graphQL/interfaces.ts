import { LoggerService } from '@backend/logger';
import { Request } from 'express';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

export interface Context {
  logger: LoggerService;
  requestContext: RequestContext;
  request: Request;
}

export interface RequestContext {
  userPayload: CognitoAccessTokenPayload;
  requestId: string;
}
