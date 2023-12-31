import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CognitoProvider } from './providers/cognito.provider';
import { AuditModule } from '@backend/auditService';

@Module({
  imports: [AuditModule.forFeature({ namespace: 'auth' })],
  providers: [AuthResolver, AuthService, CognitoProvider],
})
export class AuthModule {}
