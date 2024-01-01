import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class AuthenticateRequest {
  @Field(() => GraphQLString)
  name!: string;

  @Field(() => GraphQLString)
  password!: string;
}
