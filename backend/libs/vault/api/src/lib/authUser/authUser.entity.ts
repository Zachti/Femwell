import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString, GraphQLBoolean } from 'graphql/type';
import { GraphQLEmailAddress, GraphQLJWT } from 'graphql-scalars';

@ObjectType()
export class AuthUser {
  @Field(() => GraphQLString)
  id!: string;

  @Field(() => GraphQLEmailAddress)
  username!: string;

  @Field(() => GraphQLJWT)
  jwt!: string;

  @Field(() => GraphQLString)
  refreshToken!: string;

  @Field(() => GraphQLBoolean)
  isValid!: boolean;
}
