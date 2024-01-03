import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Request } from 'express';

type authPayload = {
  user: CognitoAccessTokenPayload;
}

export type RequestWithPayload = Request & authPayload;
