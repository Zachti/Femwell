import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLEmailAddress } from 'graphql-scalars';

@InputType()
export class RegisterRequest {
  @Field(() => GraphQLString)
  profileUsername!: string;

  @Field(() => GraphQLEmailAddress)
  email!: string;

  @Field(() => GraphQLString)
  password!: string;

  @Field(() => GraphQLString, { nullable: true })
  phoneNumber?: string;
}
