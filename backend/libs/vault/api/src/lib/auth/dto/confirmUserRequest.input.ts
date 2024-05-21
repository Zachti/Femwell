import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLEmailAddress } from 'graphql-scalars';

@InputType()
export class ConfirmUserRequest {
  @Field(() => GraphQLString)
  code!: string;

  @Field(() => GraphQLEmailAddress)
  email!: string;

  @Field(() => GraphQLString)
  password!: string;
}
