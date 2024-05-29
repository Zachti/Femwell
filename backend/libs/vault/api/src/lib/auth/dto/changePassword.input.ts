import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLJWT } from 'graphql-scalars';

@InputType()
export class ChangePasswordInput {
  @Field(() => GraphQLString)
  previousPassword!: string;

  @Field(() => GraphQLString)
  proposedPassword!: string;

  @Field(() => GraphQLJWT)
  accessToken!: string;
}
