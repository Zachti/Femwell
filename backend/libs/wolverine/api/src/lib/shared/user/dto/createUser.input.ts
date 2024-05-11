import { InputType, Field } from '@nestjs/graphql';
import { GraphQLPhoneNumber, GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateUserInput {
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user from cognito',
  })
  cognitoUserId!: string;

  @Field(() => GraphQLString)
  email!: string;

  @Field(() => GraphQLString, {
    description: 'The username in aurora db and in the profile of the app',
  })
  profileUsername!: string;

  @Field(() => GraphQLPhoneNumber, { nullable: true })
  phoneNumber?: string;
}
