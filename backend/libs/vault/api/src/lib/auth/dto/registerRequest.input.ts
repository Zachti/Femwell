import { Field, InputType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { GraphQLEmailAddress } from 'graphql-scalars';

@InputType()
export class RegisterRequest {
  @Field(() => GraphQLString)
  name!: string; // Pay attention please this field is not the username!

  @Field(() => GraphQLEmailAddress)
  email!: string; // this field will be the username!

  @Field(() => GraphQLString)
  password!: string;

  @Field(() => GraphQLString, { nullable: true })
  phoneNumber?: string;
}
