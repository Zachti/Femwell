import { registerEnumType } from "@nestjs/graphql";

export enum Role {
  User = 'User',
  Padulla = 'Padulla',
  Premium = 'Premium',
}

registerEnumType( Role, { name: 'RoleType' })
