import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CognitoProvider } from './providers/cognito.provider';

@Module({
  providers: [AuthResolver, AuthService, CognitoProvider],
})
export class AuthModule {}
