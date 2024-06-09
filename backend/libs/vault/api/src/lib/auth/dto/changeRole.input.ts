import { Field, InputType } from '@nestjs/graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';
import { Role } from '@backend/infrastructure';

@InputType()
export class ChangeRoleInput {
  @Field(() => GraphQLEmailAddress)
  email!: string;

  @Field(() => Role)
  newRole!: Role;
}
