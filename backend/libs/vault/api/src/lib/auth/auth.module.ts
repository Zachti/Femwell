import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

@Module({
  providers: [AuthResolver, AuthService, CognitoUserPool],
})
export class AuthModule {}
