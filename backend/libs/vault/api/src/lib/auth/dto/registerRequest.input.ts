import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';

@InputType()
export class RegisterRequest {
  @Field(() => GraphQLString)
  name!: string;

  @Field(() => GraphQLString)
  password!: string;

  @Field(() => GraphQLString)
  email!: string;

  @Field(() => GraphQLString, { nullable: true })
  phoneNumber?: string;
}
