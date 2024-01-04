import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../common/enums';
import { RolesGuard } from './roles.guard';

export const ROLES = 'Roles';
export const Roles = (roles: Role[]) => {
  return applyDecorators(SetMetadata(ROLES, roles), UseGuards(RolesGuard));
};
