import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => GraphQLString, {
    description: 'The username of the user from cognito',
  })
  username!: string;

  //will use validators for this after cognito implementation
  @Field(() => GraphQLUUID, {
    description: 'The unique id of the user from cognito',
  })
  cognitoUserId!: string;
}
