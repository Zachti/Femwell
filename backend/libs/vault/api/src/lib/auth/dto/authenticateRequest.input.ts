import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLEmailAddress } from 'graphql-scalars';

@InputType()
export class AuthenticateRequest {
  @Field(() => GraphQLEmailAddress)
  username!: string;

  @Field(() => GraphQLString)
  password!: string;
}
