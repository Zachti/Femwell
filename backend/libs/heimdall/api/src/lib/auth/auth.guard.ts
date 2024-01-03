import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import * as process from 'process';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

@Injectable()
export class AuthGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    req.user = this.validateJwt(req.headers.authorization);
    return true;
  }
  private async validateJwt(jwt: string): Promise<CognitoAccessTokenPayload>{
    try {
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env['COGNITO_USER_POOL']!,
        tokenUse: 'access',
        clientId: null
      });
      return await verifier.verify(jwt);
    } catch (e) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }
}
