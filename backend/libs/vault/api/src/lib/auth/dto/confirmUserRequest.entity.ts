import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class ConfirmUserRequest {
  @Field(() => GraphQLString)
  code!: string;

  @Field(() => GraphQLString)
  email!: string;
}
