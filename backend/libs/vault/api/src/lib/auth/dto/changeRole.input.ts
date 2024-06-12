import { Field, InputType } from '@nestjs/graphql';
import { GraphQLEmailAddress, GraphQLUUID } from 'graphql-scalars';
import { Role } from '@backend/infrastructure';
import { GraphQLString } from 'graphql/type';

@InputType()
export class ChangeRoleInput {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLEmailAddress)
  email!: string;

  @Field(() => GraphQLString)
  profileUsername!: string;

  @Field(() => Role)
  newRole!: Role;
}
