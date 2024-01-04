import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export const AUTH_KEY = 'auth';
export const Auth = () => {
  return applyDecorators(SetMetadata(AUTH_KEY, {}), UseGuards(AuthGuard));
};
