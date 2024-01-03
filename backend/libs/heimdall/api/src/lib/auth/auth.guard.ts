import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from '@backend/config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( @Inject(awsConfig.KEY)
               private readonly awsCfg: ConfigType<typeof awsConfig>,) {}

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
        userPoolId: this.awsCfg.userPoolId!,
        tokenUse: 'access',
        clientId: this.awsCfg.clientId?? null
      });
      return await verifier.verify(jwt);
    } catch (e) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }
}
