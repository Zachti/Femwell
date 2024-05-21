import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'User',
  Padulla = 'Padulla',
  Premium = 'Premium',
}

registerEnumType(Role, { name: 'RoleType' });

export enum appsPrefix {
  Heimdall = 'heimdall',
  Wolverine = 'wolverine',
  Vault = 'vault',
  Denden = 'denden',
}
